// controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { Op } = require('sequelize');
const { sendSMS } = require('../utils/smsService');
const { generateOTP } = require('../utils/otpService');
const { sendEmail } = require('../utils/emailService');
const { validatePhoneNumber } = require('../utils/validationService');
const { sendPushNotification } = require('../utils/pushNotificationService');

// Logique pour l'inscription et la connexion
const register = async (req, res) => {
  const { email, password, full_name, phone_number } = req.body;

  // Validation des données
  if (!email || !password || !full_name || !phone_number) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé' });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création de l'utilisateur
  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      full_name,
      phone_number,
    });

    // Envoi d'un e-mail de bienvenue
    sendEmail(email, 'Bienvenue', 'Merci de vous être inscrit !');

    // Envoi d'une notification push
    sendPushNotification(newUser.id, 'Bienvenue', 'Merci de vous être inscrit !');

    return res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation des données
  if (!email || !password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification du mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Mot de passe incorrect' });
  }

  // Génération du token JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({ token });
};
const logout = async (req, res) => {
  // Logique de déconnexion (par exemple, suppression du token côté client)
  return res.status(200).json({ message: 'Déconnexion réussie' });
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Validation des données
  if (!email) {
    return res.status(400).json({ message: 'L\'email est requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Génération d'un OTP
  const otp = generateOTP();

  // Envoi de l'OTP par e-mail
  sendEmail(email, 'Réinitialisation du mot de passe', `Votre OTP est : ${otp}`);

  // Envoi de l'OTP par SMS
  sendSMS(user.phone_number, `Votre OTP est : ${otp}`);

  return res.status(200).json({ message: 'OTP envoyé avec succès' });
};
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Validation des données
  if (!email || !otp) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Vérification de l'OTP (à implémenter)
  const isValidOTP = true; // Remplacez par la logique de vérification de l'OTP

  if (!isValidOTP) {
    return res.status(400).json({ message: 'OTP invalide' });
  }

  return res.status(200).json({ message: 'OTP vérifié avec succès' });
};
const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  // Validation des données
  if (!email || !new_password) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification de l'existence de l'utilisateur
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur non trouvé' });
  }

  // Hachage du nouveau mot de passe
  const hashedPassword = await bcrypt.hash(new_password, 10);

  // Mise à jour du mot de passe
  try {
    await User.update({ password: hashedPassword }, { where: { email } });
    return res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};
const updateProfile = async (req, res) => {
  const { full_name, phone_number } = req.body;
  const userId = req.user.id;

  // Validation des données
  if (!full_name || !phone_number) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  // Vérification du numéro de téléphone
  if (!validatePhoneNumber(phone_number)) {
    return res.status(400).json({ message: 'Numéro de téléphone invalide' });
  }

  // Mise à jour du profil
  try {
    await User.update({ full_name, phone_number }, { where: { id: userId } });
    return res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
};
const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  // Récupération du profil de l'utilisateur
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.user.id;

  // Suppression de l'utilisateur
  try {
    await User.destroy({ where: { id: userId } });
    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};
const getAllUsers = async (req, res) => {
  // Récupération de tous les utilisateurs
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

