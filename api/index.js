const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database sementara (In-Memory Array)
let beritaList = [
  {
    id: '1',
    judul: 'Peluncuran Sistem CMS Baru',
    konten: 'Sistem CMS berbasis Node.js berhasil dijalankan dan siap digunakan.',
    tanggal: '2026-10-09'
  }
];

// 1. Halaman Depan (Public)
app.get('/', (req, res) => {
  res.render('index', { beritaList });
});

// 2. Halaman Dashboard Kelola Berita
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { beritaList });
});

// 3. Tambah Berita Baru
app.post('/dashboard/tambah', (req, res) => {
  const { judul, konten } = req.body;
  const newBerita = {
    id: Date.now().toString(),
    judul,
    konten,
    tanggal: new Date().toISOString().split('T')[0]
  };
  beritaList.unshift(newBerita);
  res.redirect('/dashboard');
});

// 4. Form Edit Berita
app.get('/dashboard/edit/:id', (req, res) => {
  const berita = beritaList.find(b => b.id === req.params.id);
  if (!berita) return res.redirect('/dashboard');
  res.render('edit', { berita });
});

// 5. Update Berita
app.post('/dashboard/edit/:id', (req, res) => {
  const { judul, konten } = req.body;
  const index = beritaList.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    beritaList[index] = { ...beritaList[index], judul, konten };
  }
  res.redirect('/dashboard');
});

// 6. Hapus Berita
app.post('/dashboard/hapus/:id', (req, res) => {
  beritaList = beritaList.filter(b => b.id !== req.params.id);
  res.redirect('/dashboard');
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

module.exports = app;