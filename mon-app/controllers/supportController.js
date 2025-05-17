// controllers/supportController.js
const { SupportTicket } = require('../models');
const { Op } = require('sequelize');
const { sendSMS } = require('../utils/smsService');
const { generateOTP } = require('../utils/otpService');
const { sendEmail } = require('../utils/emailService');
const { validatePhoneNumber } = require('../utils/validationService');
const { sendPushNotification } = require('../utils/pushNotificationService');
const dotenv = require('dotenv');
dotenv.config();


// Logique pour gérer les demandes de support
const createSupportTicket = async (req, res) => {
  const { userId, message } = req.body;

  // Validation des données
  if (!userId || !message) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Création du ticket de support
  try {
    const ticket = await SupportTicket.create({
      user_id: userId,
      message,
    });

    // Envoi d'un e-mail de confirmation
    sendEmail(userId, 'Confirmation de création de ticket', `Votre ticket a été créé avec succès. ID: ${ticket.id}`);

    // Envoi d'une notification push
    sendPushNotification(userId, 'Confirmation de création de ticket', `Votre ticket a été créé avec succès. ID: ${ticket.id}`);

    return res.status(201).json({ message: 'Ticket créé avec succès', ticket });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création du ticket' });
  }
};
const getSupportTickets = async (req, res) => {
  const { userId } = req.params;

  // Validation des données
  if (!userId) {
    return res.status(400).json({ message: 'L\'ID utilisateur est requis' });
  }

  // Récupération des tickets de support
  try {
    const tickets = await SupportTicket.findAll({
      where: { user_id: userId },
    });

    return res.status(200).json({ tickets });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des tickets' });
  }
};

