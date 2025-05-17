// Génère un OTP aléatoire à 4 chiffres
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

module.exports = { generateOTP };
