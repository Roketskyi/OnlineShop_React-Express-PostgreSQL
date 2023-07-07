const express = require('express');
const bcrypt = require('bcrypt');
const routes = require('./routes/routes');
const pool = require('./db');
const jwt = require('jsonwebtoken');
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
  apiKey: "4ca14c170f7ca87f0c03b84db91545ea",
  apiSecret: "18cb8d356002c06987bb0976f11539e6"
});

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
          email VARCHAR(255),
          admin INT
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

    // Перевірка на унікальність поштової скриньки
    const emailExists = await pool.query(
      'SELECT * FROM "base" WHERE email = $1;',
      [email]
    );

    if (emailExists.rows.length > 0) {
      return res.status(400).json({ error: 'This email is busy' });
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
app.post('/api/submit', async (req, res) => {
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
      const token = jwt.sign({ login }, 'mySecretKeyByRoman', { expiresIn: '1d' });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: "Неправильний пароль." });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Помилка сервера');
  }
});

// відновлення пароля
app.post('/api/reset-password', async (req, res) => {
  const generateNewPassword = () => {
    const length = 8; // Довжина нового пароля
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let newPassword = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      newPassword += characters.charAt(randomIndex);
    }
  
    return newPassword;
  };
  
  const sendNewPasswordByEmail = (email, login, password) => {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      "Messages": [
        {
          "From": {
            "Email": 'hello.online.shop.if@gmail.com',
            "Name": 'OnlineShop'
          },
          "To": [
            {
              "Email": email,
              "Name": 'OnlineShop'
            }
          ],
          "Subject": 'Password Reset By OnlineShop',
          "TextPart": `Your login: ${login}\nYour new password: ${password}`,
        }
      ]
    });
  
    request
      .then(result => {
        console.log('Password reset email sent');
      })
      .catch(error => {
        console.error('Failed to send password reset email:', error.statusCode, error.message);
      });
  };
  
  const { email } = req.body;

  try {
    // Отримати користувача за електронною поштою
    const user = await pool.query('SELECT * FROM "base" WHERE email = $1;', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Згенерувати новий пароль
    const newPassword = generateNewPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Оновити пароль користувача в базі даних
    await pool.query('UPDATE "base" SET password = $1 WHERE email = $2;', [hashedPassword, email]);

    // Відправити новий пароль на пошту користувача
    sendNewPasswordByEmail(email, user.rows[0].login, newPassword);

    res.status(200).json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Перевірка валідності токена
app.post('/api/check-token', async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, 'mySecretKeyByRoman', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      return res.status(200).json({ message: 'Token is valid' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/check-admin', async (req, res) => {
  const { token } = req.body;

  try {
    jwt.verify(token, 'mySecretKeyByRoman', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const login = decoded.login;
      const user = await pool.query('SELECT admin FROM "base" WHERE login = $1;', [login]);

      if (user.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const isAdmin = user.rows[0].admin === 1;

      return res.status(200).json({ isAdmin });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server started on http://${IP}:${PORT}/`));
