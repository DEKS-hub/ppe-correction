// Simule l'envoi de notifications push
const sendPushNotification = async (userId, title, message) => {
    console.log(`🔔 Notification pour l'utilisateur ${userId} - ${title}: ${message}`);
    // Intègre une solution comme Firebase FCM ici
  };
  
  module.exports = { sendPushNotification };
  