// Добавьте необходимые зависимости
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

// Подключение к базе данных MongoDB
mongoose.connect('mongodb+srv://PaintAdmin:PaintShop1@paintshop.cehkbub.mongodb.net/ArtStore?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.use(express.static(path.join(__dirname, 'frontend')));

// Схемы и модели
const paintingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrls: [String]
});

const accountSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'buyer' },
  address: { type: String, required: true }
});

const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number
  }]
});

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: {
    type: String,
    default: 'Pending'
  }
});

const Painting = mongoose.model('Painting', paintingSchema);
const Account = mongoose.model('Account', accountSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);

// Middleware для проверки токена
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Маршруты для работы с картинами
app.get('/api/paintings', async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (error) {
    console.error('Error fetching paintings:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/paintings', async (req, res) => {
  try {
    const painting = new Painting(req.body);
    await painting.save();
    res.status(201).json(painting);
  } catch (error) {
    console.error('Error adding painting:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullname, username, email, password, address } = req.body;

    // Проверка существования пользователя с таким же email или username
    const existingUser = await Account.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newAccount = new Account({
      fullname,
      username,
      email,
      password: hashedPassword,
      role: 'buyer',  // Установка роли "buyer" при регистрации
      address
    });

    await newAccount.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Логин пользователя
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Account.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Получение информации о текущем пользователе
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await Account.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Выход из системы
app.post('/api/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Маршруты API для корзины
app.get('/api/cart', async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/cart', async (req, res) => {
  try {
    const cart = new Cart(req.body);
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error adding cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Маршруты API для заказов
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Запуск сервера
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
