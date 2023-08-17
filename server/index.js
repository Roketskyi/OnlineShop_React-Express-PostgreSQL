const express = require('express');
const bcrypt = require('bcrypt');
const routes = require('./routes/routes');
const sequelize = require('./db');
const { Base } = require('./models/allBase');
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
app.post('/clearTable', async (req, res) => {
  try {
    await sequelize.query('DROP TABLE IF EXISTS "base";');
    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "base" (
        id SERIAL PRIMARY KEY,
        login VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        email VARCHAR(255),
        admin INT
      );
    `);

    res.status(200).json({ message: 'Table Table is cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Додавання інформації в таблицю
app.post('/register', async (req, res) => {
  try {
    const { login, password, email } = req.body;

    // Check if login exists
    const loginExists = await Base.findOne({
      where: { login },
    });

    if (loginExists) {
      return res.status(400).json({ error: 'This login is busy' });
    }

    // Check if email exists
    const emailExists = await Base.findOne({
      where: { email },
    });

    if (emailExists) {
      return res.status(400).json({ error: 'This email is busy' });
    }

    // Generate password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await Base.create({
      login,
      password: hashedPassword,
      email,
      admin: 0,
    });

    res.status(200).json(newUser);
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
    const result = await sequelize.query(
      'SELECT password FROM "base" WHERE login = :login;',
      {
        replacements: { login },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (result.length === 0) {
      return res.status(401).json({ error: "Неправильний логін." });
    }

    const hashedPassword = result[0].password;
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
    const user = await Base.findOne({
      where: { email }
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Згенерувати новий пароль
    const newPassword = generateNewPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Оновити пароль користувача в базі даних
    await user.update({ password: hashedPassword });

    // Відправити новий пароль на пошту користувача
    sendNewPasswordByEmail(email, user.login, newPassword);

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
    const decoded = jwt.verify(token, 'mySecretKeyByRoman');
    const login = decoded.login;

    const user = await sequelize.query('SELECT admin FROM "base" WHERE login = :login', {
      replacements: { login },
      type: sequelize.QueryTypes.SELECT,
    });

    if (user.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isAdmin = user[0].admin === 1;

    return res.status(200).json({ isAdmin });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/add-products', async (req, res) => {
  const { name, description, price, image } = req.body;

  try {
    const product = await Product.create({ name, description, price, image });
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server started on http://${IP}:${PORT}/`));
