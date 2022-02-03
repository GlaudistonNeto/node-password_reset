const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

let user = {
  id: "87465741",
  email: "email@email.com",
  password: "",
};

const JWT_SECRET = 'secret'

app.get('/', (req, res) => {
  res.send("It's alive!");
});

app.get('/forgot-password', (req, res, next) => {
  res.render('forgot-password');
});

app.post('/forgot-password', (req, res, next) => {
  const { email } = req.body;
  if (email !== user.email) {
    res.send('User not regeistered');
    return;
  }

  const secret = JWT_SECRET + user.password
  const payload = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, secret, { expiresIn: '15m' });
  const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
  console.log(link);
  res.send('Password reset link has been sent tou your e-mail');
});

app.get('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  
  if (id !== user.id) {
    res.send('Invalid id');
    return;
  }

  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render('reset-password', {email: user.email});
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
});

app.post('/reset-password/:id/:token', (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body;
  
  if (id !== user.id) {
    res.send('Invalid id');
    return;
  }

  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret)
    // validate password and password2 should match
    // have to hash the password before sending to the database
    user.password = password;
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
});

app.listen(3000, () => console.log('http://127.0.0.1:3000'));
