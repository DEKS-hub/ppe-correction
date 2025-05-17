// Simule l'envoi d'un email
const sendEmail = async (to, subject, content) => {
    console.log(`📧 Email envoyé à ${to} - Sujet : ${subject} - Contenu : ${content}`);
    // Tu peux intégrer une API comme SendGrid ou Nodemailer ici
  };
  
  module.exports = { sendEmail };
  