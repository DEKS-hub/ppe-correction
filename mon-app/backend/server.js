const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const app = express();
const port = 3000;
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
const { v4: uuidv4 } = require('uuid');
const router = express.Router();


app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dekoua',
  database: 'ppe301',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test API
app.get('/', (req, res) => {
  res.send({ status: "Started" });
});


// Enregistrement
app.post("/register", async (req, res) => {
  const { name, email, mobile, password, user_type } = req.body;
  console.log(req.body);

  // 1. Vérification des champs obligatoires
  if (!name || !email || !mobile || !password || !user_type) {
    return res.status(400).send({ status: "error", data: "Tous les champs sont requis" });
  }

  // 2. Vérification du type d'utilisateur (ENUM)
  if (!["User", "Admin"].includes(user_type)) {
    return res.status(400).send({ status: "error", data: "Type d'utilisateur invalide" });
  }

  try {
    console.log("Préparation pour l'insertion");

    // Générer un identifiant unique pour le QR code
    const qrcode = uuidv4();

    // 3. Insérer l'utilisateur en base, avec le champ qrcode
    const [result] = await db.query(
      "INSERT INTO users (name, email, mobile, password, user_type, qrcode) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, mobile, password, user_type, qrcode]
    );
    console.log("Utilisateur créé :", result);

    // 4. Réponse succès (on renvoie aussi la valeur qrcode)
    return res.status(201).send({
      status: "success",
      data: {
        id: result.insertId,
        name,
        email,
        mobile,
        user_type,
        qrcode
      }
    });

  } catch (error) {
    console.error("Erreur d'enregistrement :", error);
    return res.status(500).send({
      status: "error",
      data: "Une erreur est survenue lors de l'enregistrement"
    });
  }
});


// Connexion utilisateur
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  

  console.log(req.body);

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.send({ data: "User doesn't exist!!" });
    }

    const user = users[0];

    // Comparaison directe du mot de passe sans cryptage
    if (password !== user.password) {
      return res.send({ data: "Mot de passe incorrect" });
    }
    console.log("preparation pour la connexion");
    console.log("le type d utilisateur", user.user_type);

    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    res.send({
    status: "ok",
    data: {
    token: token,
    id: user.id,
    userType: user.user_type
    }
    });
    console.log("Connexion réussie voici l id de l utilisateur :", user.id);
    console.log("Token généré :", token);
    console.log("Type d'utilisateur :", user.user_type);
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.send({ error: "Erreur serveur" });
  }
});





// Récupération des infos utilisateur via token
app.post("/userdata", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [decoded.email]);

    res.send({ status: "Ok", data: rows[0] });
  } catch (error) {
    res.send({ error });
  }
});






// GET /api/qrcode
app.get('/api/qrcode', async (req, res) => {
  const id = req.query.id;
  console.log("ID utilisateur reçu :", id);
  if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });

  try {
    const [rows] = await db.execute(
      'SELECT qrcode FROM users WHERE id = ?',
      [id]
    );
    console.log("Résultat de la requête :");

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé ou pas de QR code' });
    }

    res.json({ qrCode: rows[0].qrcode }); // Assure-toi que `qrcode` contient soit : un texte, soit une image base64
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// Récupérer l'historique des transactions avec détails utilisateur
app.get('/api/historique', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'ID utilisateur requis' });

  try {
    const [rows] = await db.query(
      `SELECT 
         t.id,
         t.sender_id,
         s.name AS sender_name,
         t.receiver_id,
         r.name AS receiver_name,
         t.amount,
         t.status,
         t.transaction_type,
         t.created_at
       FROM transactions t
       LEFT JOIN users s ON t.sender_id = s.id
       LEFT JOIN users r ON t.receiver_id = r.id
       WHERE t.sender_id = ? OR t.receiver_id = ?
       ORDER BY t.created_at DESC`,
      [userId, userId]
    );

    res.json({ status: "ok", data: rows });
  } catch (err) {
    console.error("Erreur récupération historique :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Récupérer le solde d'un utilisateur
app.get('/api/solde/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: 'ID utilisateur manquant' });
  }

  try {
    console.log("🔍 Recherche du solde pour l'utilisateur ID :", userId);

    const [rows] = await db.execute('SELECT solde FROM users WHERE id = ?', [userId]);

    if (rows.length > 0) {
      const solde = rows[0].solde;
      console.log("✅ Solde trouvé :", solde);
      return res.json({ solde });
    } else {
      console.warn("⚠️ Utilisateur non trouvé avec l'ID :", userId);
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

  } catch (err) {
    console.error(" Erreur serveur :", err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Transaction entre utilisateurs
app.post("/transaction", async (req, res) => {
  const { senderId, receiverPhone, amount } = req.body;
  console.log("Données de transaction reçues :", req.body);

  if (!senderId || !receiverPhone || !amount || amount <= 0) {
    return res.status(400).json({ message: "Données invalides" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[sender]] = await conn.query("SELECT solde FROM users WHERE id = ?", [senderId]);
    if (!sender) {
      throw new Error("Émetteur introuvable");
    }
    if (sender.solde < amount) {
      throw new Error("Solde insuffisant");
    }

    const [[receiver]] = await conn.query("SELECT id FROM users WHERE mobile = ?", [receiverPhone]);
    if (!receiver) {
      throw new Error("Destinataire introuvable");
    }

    const [debitResult] = await conn.query(
      "UPDATE users SET solde = solde - ? WHERE id = ?",
      [amount, senderId]
    );
    if (debitResult.affectedRows === 0) {
      throw new Error("Échec du débit");
    }

    const [creditResult] = await conn.query(
      "UPDATE users SET solde = solde + ? WHERE id = ?",
      [amount, receiver.id]
    );
    if (creditResult.affectedRows === 0) {
      throw new Error("Échec du crédit");
    }

    await conn.query(
    "INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (?, ?, ?)",
    [senderId, receiver.id, amount]
    );


    await conn.commit();
    res.status(200).json({ message: "Transaction réussie" });

  } catch (error) {
    console.error("Erreur transaction :", error.message);
    await conn.rollback();
    res.status(500).json({ message: "Transaction annulée", erreur: error.message });
  } finally {
    conn.release();
  }
});


// Mise à jour de la fonction utilitaire
async function getUserByEmailOrNumero(identifier) {
  let query, params;
  if (/^\d+$/.test(identifier)) { // Si c’est un nombre (ici numéro de mobile)
    // CORRECTION : Utilisation de 'mobile' au lieu de 'numero'
    query = 'SELECT id, solde FROM users WHERE mobile = ?';
    params = [identifier];
  } else { // Sinon c’est un email
    query = 'SELECT id, solde FROM users WHERE email = ?';
    params = [identifier];
  }
  const [users] = await db.query(query, params);
  return users[0] || null;
}

// Routes corrigées (utilisent le 'router' défini plus haut)
router.post('/api/admin/credit', async (req, res) => {
  const { recipient, amount } = req.body;
  const montant = parseFloat(amount);

  if (!recipient || !amount || isNaN(montant) || montant <= 0) {
    return res.status(400).json({ status: 'error', error: 'Données invalides : destinataire et montant positif requis.' });
  }
  console.log("Tentative de crédit pour le destinataire :", recipient, "avec le montant :", montant);

  try {
    const user = await getUserByEmailOrNumero(recipient);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'Utilisateur non trouvé.' });
    }
console.log("Utilisateur trouvé :", user);
    const nouveauSolde = parseFloat(user.solde) + montant;
    await db.query('UPDATE users SET solde = ? WHERE id = ?', [nouveauSolde, user.id]);
console.log("Nouveau solde après crédit :", nouveauSolde);
    return res.status(200).json({ status: 'ok', message: 'Compte crédité.', solde: nouveauSolde });
  } catch (err) {
    console.error('Erreur crédit:', err);
    return res.status(500).json({ status: 'error', error: 'Erreur serveur lors du crédit.' });
  }
});

router.post('/api/admin/debit', async (req, res) => {
  const { recipient, amount } = req.body;
  const montant = parseFloat(amount);

  if (!recipient || !amount || isNaN(montant) || montant <= 0) {
    return res.status(400).json({ status: 'error', error: 'Données invalides : destinataire et montant positif requis.' });
  }

  try {
    const user = await getUserByEmailOrNumero(recipient);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'Utilisateur non trouvé.' });
    }

    if (parseFloat(user.solde) < montant) {
      return res.status(400).json({ status: 'error', error: 'Solde insuffisant.' });
    }

    const nouveauSolde = parseFloat(user.solde) - montant;
    await db.query('UPDATE users SET solde = ? WHERE id = ?', [nouveauSolde, user.id]);

    return res.status(200).json({ status: 'ok', message: 'Compte débité.', solde: nouveauSolde });
  } catch (err) {
    console.error('Erreur débit:', err);
    return res.status(500).json({ status: 'error', error: 'Erreur serveur lors du débit.' });
  }
});

app.use(router);
// Nouveau Middleware pour vérifier le token JWT pour n'importe quel utilisateur
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Accès non autorisé : Token manquant.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // Stocke l'email de l'utilisateur décodé dans req.user pour un usage ultérieur
        req.user = decoded;
        next(); // Le token est valide, on passe au prochain middleware/gestionnaire de route
    } catch (err) {
        return res.status(403).json({ status: 'error', error: 'Accès non autorisé : Token invalide ou expiré.' });
    }
};



// NOUVELLE ROUTE : Récupérer le répertoire des autres utilisateurs (pour les transactions)
router.get('/api/users/recipients', authenticateUser, async (req, res) => {
    try {
        // L'email de l'utilisateur qui fait la requête est dans req.user.email
        const requestingUserEmail = req.user.email;

        // Récupérer l'ID de l'utilisateur qui fait la requête
        const [requestingUserRows] = await db.query("SELECT id FROM users WHERE email = ?", [requestingUserEmail]);
        if (requestingUserRows.length === 0) {
            return res.status(404).json({ status: 'error', error: 'Utilisateur demandeur non trouvé.' });
        }
        const requestingUserId = requestingUserRows[0].id;

        // Récupérer tous les utilisateurs SAUF l'utilisateur qui fait la requête
        const [recipients] = await db.query(
            `SELECT id, name, email, mobile
             FROM users
             WHERE id != ?
             ORDER BY name ASC`,
            [requestingUserId]
        );

        res.json({ status: "ok", data: recipients });
    } catch (err) {
        console.error("Erreur lors de la récupération du répertoire des destinataires :", err);
        res.status(500).json({ status: 'error', error: 'Erreur serveur lors de la récupération du répertoire.' });
    }
});
// scan.controller.js
router.post('/api/scan', async (req, res) => {
  const { receiverPhone } = req.body;

  if (!receiverPhone) {
    return res.status(400).json({ status: 'error', message: 'Numéro manquant.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT id, nom, prenom, solde FROM utilisateurs WHERE telephone = ?',
      [receiverPhone]
    );

    if (rows.length === 0) {
  
    return res.status(404).json({ status: 'error', message: 'Utilisateur non trouvé.' });
    }

    return res.status(200).json({ status: 'success', data: rows[0] });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Erreur serveur.' });
  }
});

// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
