// controllers/billController.js
const { User, Bill, Transaction } = require('../models');
const { Op } = require('sequelize');
const { sendSMS } = require('../utils/smsService');
const { generateOTP } = require('../utils/otpService');
const { sendEmail } = require('../utils/emailService');
const { validatePhoneNumber } = require('../utils/validationService');
const { sendPushNotification } = require('../utils/pushNotificationService');
const dotenv = require('dotenv');
dotenv.config();

// Logique pour payer une facture
const payBill = async (req, res) => {
  const { userId, billId } = req.body;

  // Validation des données
  if (!userId || !billId) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification de l'existence de la facture
  const bill = await Bill.findByPk(billId);
  if (!bill) {
    return res.status(404).json({ message: 'Facture non trouvée' });
  }

  // Vérification du solde de l'utilisateur
  if (user.balance < bill.amount) {
    return res.status(400).json({ message: 'Solde insuffisant' });
  }

  // Mise à jour du solde de l'utilisateur et du statut de la facture
  try {
    await user.update({ balance: user.balance - bill.amount });
    await bill.update({ status: 'paid' });

    // Enregistrement de la transaction
    await Transaction.create({
      user_id: userId,
      bill_id: billId,
      amount: bill.amount,
      type: 'payment',
    });

    // Envoi d'un e-mail de confirmation
    sendEmail(user.email, 'Confirmation de paiement', `Votre paiement de ${bill.amount} a été effectué avec succès.`);

    // Envoi d'une notification push
    sendPushNotification(user.id, 'Confirmation de paiement', `Votre paiement de ${bill.amount} a été effectué avec succès.`);

    return res.status(200).json({ message: 'Paiement effectué avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors du traitement du paiement' });
  }
};
// Logique pour récupérer les factures d'un utilisateur
const getUserBills = async (req, res) => {
  const { userId } = req.params;

  // Validation des données
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Récupération des factures de l'utilisateur
  try {
    const bills = await Bill.findAll({ where: { user_id: userId } });
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des factures' });
  }
};
// Logique pour créer une facture
const createBill = async (req, res) => {
  const { userId, billName, amount } = req.body;

  // Validation des données
  if (!userId || !billName || !amount) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Création de la facture
  try {
    const bill = await Bill.create({
      user_id: userId,
      bill_name: billName,
      amount,
    });

    // Envoi d'un e-mail de confirmation
    sendEmail(user.email, 'Création de facture', `Votre facture de ${amount} a été créée avec succès.`);

    // Envoi d'une notification push
    sendPushNotification(user.id, 'Création de facture', `Votre facture de ${amount} a été créée avec succès.`);

    return res.status(201).json(bill);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création de la facture' });
  }
};
// Logique pour supprimer une facture
const deleteBill = async (req, res) => {
  const { billId } = req.params;

  // Validation des données
  if (!billId) {
    return res.status(400).json({ message: 'L\'ID de la facture est requis' });
  }

  // Vérification de l'existence de la facture
  const bill = await Bill.findByPk(billId);
  if (!bill) {
    return res.status(404).json({ message: 'Facture non trouvée' });
  }

  // Suppression de la facture
  try {
    await bill.destroy();
    return res.status(200).json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de la facture' });
  }
};
// Logique pour mettre à jour une facture
const updateBill = async (req, res) => {
  const { billId } = req.params;
  const { billName, amount } = req.body;

  // Validation des données
  if (!billId || !billName || !amount) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de la facture
  const bill = await Bill.findByPk(billId);
  if (!bill) {
    return res.status(404).json({ message: 'Facture non trouvée' });
  }

  // Mise à jour de la facture
  try {
    await bill.update({
      bill_name: billName,
      amount,
    });

    return res.status(200).json(bill);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la facture' });
  }
};
// Logique pour envoyer un rappel de paiement
const sendPaymentReminder = async (req, res) => {
  const { userId, billId } = req.body;

  // Validation des données
  if (!userId || !billId) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification de l'existence de la facture
  const bill = await Bill.findByPk(billId);
  if (!bill) {
    return res.status(404).json({ message: 'Facture non trouvée' });
  }

  // Envoi d'un rappel de paiement
  try {
    sendSMS(user.phone_number, `Rappel : Votre facture ${bill.bill_name} est due. Montant : ${bill.amount}`);
    return res.status(200).json({ message: 'Rappel de paiement envoyé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l\'envoi du rappel de paiement' });
  }
};
// Logique pour générer un rapport de factures
const generateBillReport = async (req, res) => {
  const { userId } = req.params;

  // Validation des données
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Récupération des factures de l'utilisateur
  try {
    const bills = await Bill.findAll({ where: { user_id: userId } });
    // Génération du rapport (à implémenter)
    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la génération du rapport de factures' });
  }
};
// Exportation des fonctions
module.exports = {
  payBill,
  getUserBills,
  createBill,
  deleteBill,
  updateBill,
  sendPaymentReminder,
  generateBillReport,
};

