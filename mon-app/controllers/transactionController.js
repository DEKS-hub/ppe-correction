// controllers/transactionController.js
const { User, Transaction } = require('../models');
const { Op } = require('sequelize');
const { sendSMS } = require('../utils/smsService');
const { generateOTP } = require('../utils/otpService');
const { sendEmail } = require('../utils/emailService');
const { validatePhoneNumber } = require('../utils/validationService');
const { sendPushNotification } = require('../utils/pushNotificationService');


// Logique pour effectuer un transfert  d'argent
const transferMoney = async (req, res) => {
  const { senderId, receiverId, amount } = req.body;

  // Validation des données
  if (!senderId || !receiverId || !amount) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur expéditeur
  const sender = await User.findByPk(senderId);
  if (!sender) {
    return res.status(404).json({ message: 'Utilisateur expéditeur non trouvé' });
  }

  // Vérification de l'existence de l'utilisateur destinataire
  const receiver = await User.findByPk(receiverId);
  if (!receiver) {
    return res.status(404).json({ message: 'Utilisateur destinataire non trouvé' });
  }

  // Vérification du solde de l'expéditeur
  if (sender.balance < amount) {
    return res.status(400).json({ message: 'Solde insuffisant' });
  }

  // Mise à jour du solde de l'expéditeur et du destinataire
  try {
    await sender.update({ balance: sender.balance - amount });
    await receiver.update({ balance: receiver.balance + amount });

    // Enregistrement de la transaction
    await Transaction.create({
      sender_id: senderId,
      receiver_id: receiverId,
      amount,
      type: 'transfer',
    });

    // Envoi d'un e-mail de confirmation
    sendEmail(sender.email, 'Confirmation de transfert', `Votre transfert de ${amount} a été effectué avec succès.`);

    // Envoi d'une notification push
    sendPushNotification(sender.id, 'Confirmation de transfert', `Votre transfert de ${amount} a été effectué avec succès.`);

    return res.status(200).json({ message: 'Transfert effectué avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors du traitement du transfert' });
  }
};
// Logique pour récupérer l'historique des transactions
const getTransactionHistory = async (req, res) => {
  const { userId } = req.params;

  // Validation des données
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Récupération de l'historique des transactions
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId },
        ],
      },
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique des transactions' });
  }
};
// Logique pour annuler une transaction
const cancelTransaction = async (req, res) => {
  const { transactionId } = req.params;

  // Validation des données
  if (!transactionId) {
    return res.status(400).json({ message: 'L\'ID de la transaction est requis' });
  }

  // Vérification de l'existence de la transaction
  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction non trouvée' });
  }

  // Annulation de la transaction
  try {
    await transaction.update({ status: 'cancelled' });

    // Envoi d'un e-mail de confirmation
    sendEmail(transaction.sender_id, 'Annulation de la transaction', `Votre transaction a été annulée avec succès.`);

    // Envoi d'une notification push
    sendPushNotification(transaction.sender_id, 'Annulation de la transaction', `Votre transaction a été annulée avec succès.`);

    return res.status(200).json({ message: 'Transaction annulée avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de l\'annulation de la transaction' });
  }
};
// Logique pour vérifier le statut d'une transaction
const checkTransactionStatus = async (req, res) => {
  const { transactionId } = req.params;

  // Validation des données
  if (!transactionId) {
    return res.status(400).json({ message: 'L\'ID de la transaction est requis' });
  }

  // Vérification de l'existence de la transaction
  const transaction = await Transaction.findByPk(transactionId);
  if (!transaction) {
    return res.status(404).json({ message: 'Transaction non trouvée' });
  }

  return res.status(200).json({ status: transaction.status });
};
// Logique pour générer un rapport de transactions
const generateTransactionReport = async (req, res) => {
  const { userId } = req.params;

  // Validation des données
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Récupération de l'historique des transactions
  try {
    const transactions = await Transaction.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId },
        ],
      },
    });

    // Logique pour générer le rapport (par exemple, au format PDF ou CSV)
    // ...

    return res.status(200).json({ message: 'Rapport généré avec succès', transactions });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la génération du rapport' });
  }
};
// Exportation des fonctions
module.exports = {
  transferMoney,
  getTransactionHistory,
  cancelTransaction,
  checkTransactionStatus,
  generateTransactionReport,
};
// Logique pour effectuer un paiement de facture
const payBill = async (req, res) => {
  const { userId, billId, amount } = req.body;

  // Validation des données
  if (!userId || !billId || !amount) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du solde de l'utilisateur
  if (user.balance < amount) {
    return res.status(400).json({ message: 'Solde insuffisant' });
  }

  // Mise à jour du solde de l'utilisateur
  try {
    await user.update({ balance: user.balance - amount });

    // Enregistrement de la transaction
    await Transaction.create({
      sender_id: userId,
      receiver_id: null, // Pas de destinataire pour le paiement de facture
      amount,
      type: 'bill_payment',
    });

    // Envoi d'un e-mail de confirmation
    sendEmail(user.email, 'Confirmation de paiement', `Votre paiement de ${amount} a été effectué avec succès.`);

    // Envoi d'une notification push
    sendPushNotification(user.id, 'Confirmation de paiement', `Votre paiement de ${amount} a été effectué avec succès.`);

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

  // Récupération des factures de l'utilisateur
  try {
    const bills = await Bill.findAll({
      where: { user_id: userId },
    });

    return res.status(200).json({ bills });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des factures' });
  }
};
// Exportation des fonctions
module.exports = {
  transferMoney,
  getTransactionHistory,
  cancelTransaction,
  checkTransactionStatus,
  generateTransactionReport,
  payBill,
  getUserBills,
};
