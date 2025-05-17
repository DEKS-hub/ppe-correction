// Simule l'envoi de SMS
const sendSMS = async (phoneNumber, message) => {
    console.log(`📲 SMS envoyé à ${phoneNumber} : ${message}`);
    // Ici, tu peux intégrer une API comme Twilio ou Nexmo
    // pour envoyer des SMS réels.
    // Par exemple :
     const response = await twilioClient.messages.create({
       body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
     });
     return response;
  // Simule un délai d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { status: 'success', message: 'SMS envoyé' };
  // Gérer les erreurs d'envoi
     throw new Error('Erreur lors de l\'envoi du SMS');
     return { status: 'error', message: 'Erreur lors de l\'envoi du SMS' };
  // Gérer les erreurs d'envoi
     throw new Error('Erreur lors de l\'envoi du SMS');
    return { status: 'error', message: 'Erreur lors de l\'envoi du SMS' };
  };
  
  module.exports = { sendSMS };

  