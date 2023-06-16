const express = require('express');
const bcrypt = require('bcrypt');
const routes = require ('./routes/routes');
const pool = require('./db');
const jwt = require('jsonwebtoken');

const IP = 'localhost';
const PORT = 5000;
const app = express();

app.use(express.json());

app.use('/api', routes);

// Очищення таблиці
app.post('/clearTable', (req, res) => {
  pool.query(
    'DROP TABLE IF EXISTS "base";',
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Помилка сервера');
      }

      // Після видалення таблиці, створіть її заново
      pool.query(
        `CREATE TABLE IF NOT EXISTS "base" (
          id SERIAL PRIMARY KEY,
          login VARCHAR(255) UNIQUE,
          password VARCHAR(255),
          email VARCHAR(255)
        );`,
    
        (error, results) => {
          if (error) throw error;
    
          res.status(200).json({ message: 'Таблицю очищено' });
        }
      );
    }
  );
});

// Додавання інформації в таблицю
app.post('/register', async (req, res) => {
  try {
    const { login, password, email } = req.body;

    // Перевірка на унікальність логіна
    const loginExists = await pool.query(
      'SELECT * FROM "base" WHERE login = $1;',
      [login]
    );

    if (loginExists.rows.length > 0) {
      return res.status(400).json({ error: 'This login is busy' });
    }

    // Генерація хеша пароля
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO "base" (login, password, email) VALUES ($1, $2, $3);',
      [login, hashedPassword, email]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Перевірка чи є дані в базі
app.post("/api/submit", async (req, res) => {
  const inputValue = req.body.password;
  const login = req.body.login;

  try {
    const result = await pool.query(
      'SELECT password FROM "base" WHERE login = $1;',
      [login]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Неправильний логін." });
    }

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(inputValue, hashedPassword);

    if (isMatch) {
      // Створення токена
      const token = jwt.sign({ login }, 'mySecretKeyByRoman');
      
      // Відправлення токена як відповідь
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: "Неправильний пароль." });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Помилка сервера');
  }
});

app.listen(PORT, () => console.log(`Server started on http://${IP}:${PORT}/`));
