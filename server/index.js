const express = require('express');
const routes = require ('./routes/routes');
const pool = require('./db');

const IP = 'localhost';
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

app.use('/api', routes);

app.post("/", (req, res) => {
    res.status(200).json('good')
})

// Створення таблиці
app.get('/createTable', (req, res) => {
    pool.query(
        `CREATE TABLE IF NOT EXISTS "base" (
          id SERIAL PRIMARY KEY,
          login VARCHAR(255),
          password VARCHAR(255)
        );`,
    
        (error, results) => {
          if (error) throw error;
    
          res.status(200).json(results.rows)
          console.log('Таблиця успішно створена');
        }
    );
});
// ------------------------------------------------------------------
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO "base" (login, password) VALUES ($1, $2);',
      [login, hashedPassword]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post("/api/submit", async (req, res) => {
  const inputValue = req.body.password;
  const login = req.body.login;

  try {
    const result = await pool.query(
      'SELECT password FROM "base" WHERE login = $1;',
      [login]
    );

    if (!result.rows[0]) {
      return res.status(401).json({ message: "Неправильний логін." });
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(inputValue, hashedPassword);

    if (isMatch) {
      return res.status(200).json({ message: "Пароль співпадає." });
    } else {
      return res.status(401).json({ message: "Неправильний пароль." });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
});


app.listen(PORT, () => console.log(`Server started on http://${IP}:${PORT}/`));
