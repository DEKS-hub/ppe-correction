import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware pour analyser les requêtes JSON
app.use(express.json());
app.use(cors());

// Configurer la connexion PostgreSQL
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Penuel01',
  port: 5432
});

// Exemple de route pour récupérer les utilisateurs
app.get('/users', async (_, res) => {
  try {
    const { rows: results } = await db.query('SELECT * FROM users');
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const { rows: results } = await db.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Connexion réussie
    res.status(200).json({ message: 'Connexion réussie', user: { id: user.id, name: user.name, phone: user.phone } });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/register', async (req, res) => {
  console.log('Reception de la requête d\'inscription...');
  const { name, phone, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('Reception de la requête d\'inscription...');
    await db.query('INSERT INTO users (name, phone, password) VALUES ($1, $2, $3)', [name, phone, hashedPassword]);
    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors de la création du compte.' });
  }
});

// Démarrer le serveur
/* app.listen(port, '127.0.0.1', () => {
  console.log(`Le serveur backend est en cours d'exécution sur http://127.0.0.1:${port}`);
});
 */
app.listen(port, () => {
  console.log(`Le serveur backend est en cours d'exécution sur http://10.150.1.181:${port}`);
});