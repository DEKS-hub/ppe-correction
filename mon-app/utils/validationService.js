// Valide un numéro de téléphone (simple regex)
const validatePhoneNumber = (phone) => {
    const regex = /^\+?[0-9]{8,15}$/;
    return regex.test(phone);
  };
  
  module.exports = { validatePhoneNumber };
  