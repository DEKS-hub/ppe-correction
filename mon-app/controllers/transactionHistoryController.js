// controllers/transactionHistoryController.js
const { Transaction } = require('../models');
const { Op } = require('sequelize');
const { sendSMS } = require('../utils/smsService');
const { generateOTP } = require('../utils/otpService');
const { sendEmail } = require('../utils/emailService');
const { validatePhoneNumber } = require('../utils/validationService');
const { sendPushNotification } = require('../utils/pushNotificationService');


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
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
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
// Logique pour récupérer les détails d'une transaction
const getTransactionDetails = async (req, res) => {
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

  return res.status(200).json({ transaction });
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
// Logique pour vérifier le solde d'un utilisateur
const checkUserBalance = async (req, res) => {
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

  return res.status(200).json({ balance: user.balance });
};
