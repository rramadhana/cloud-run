const express = require('express');
const app = express();

// Daftar tugas (placeholder)
let tasks = [
  { id: 1, name: 'Membuat tugas akhir' },
  { id: 2, name: 'Berbelanja bahan makanan' },
  { id: 3, name: 'Menyelesaikan buku terbaru' }
];

// Menampilkan daftar tugas
app.get('/', (req, res) => {
  let taskList = '';
  for (let task of tasks) {
    taskList += `<li>${task.name}</li>`;
  }
  let html = `<h1>To-Do List</h1><ul>${taskList}</ul>`;
  res.send(html);
});

// Menambahkan tugas baru
app.post('/tasks', express.json(), (req, res) => {
  let newTask = req.body;
  tasks.push(newTask);
  res.send('Tugas berhasil ditambahkan!');
});

// Menghapus tugas
app.delete('/tasks/:id', (req, res) => {
  let taskId = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== taskId);
  res.send('Tugas berhasil dihapus!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
