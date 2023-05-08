const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Initialize an array to store user data
let users = [];

// Parse incoming JSON data
app.use(express.json());

// Define routes for CRUD operations
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', getUser, (req, res) => {
  res.json(res.user);
});

app.patch('/users/:id', getUser, (req, res) => {
  const user = res.user;
  if (req.body.name != null) {
    user.name = req.body.name;
  }
  if (req.body.email != null) {
    user.email = req.body.email;
  }
  if (req.body.age != null) {
    user.age = req.body.age;
  }
  res.json(user);
});

app.delete('/users/:id', getUser, (req, res) => {
  const index = users.indexOf(res.user);
  users.splice(index, 1);
  res.json({ message: 'User deleted' });
});

// Middleware function to get a user by ID
function getUser(req, res, next) {
  const id = req.params.id;
  const user = users.find(user => user.id === id);
  if (user == null) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.user = user;
  next();
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
