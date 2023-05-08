const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define a mongoose schema for our data
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
});

// Define a mongoose model for our data
const User = mongoose.model('User', UserSchema);

// Parse incoming JSON data
app.use(express.json());

// Define routes for CRUD operations
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/users/:id', getUser, (req, res) => {
  res.json(res.user);
});

app.patch('/users/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.age != null) {
    res.user.age = req.body.age;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/users/:id', getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a user by ID
async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
