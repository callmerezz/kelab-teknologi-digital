# Kelab Teknologi Digital

## Kandungan Laman Web

- **Laman Utama (`index.html`)** — Memaparkan maklumat kelab, aktiviti, teknologi yang dipelajari dan berita terkini.
- **Tentang Kelab (`about.html`)** — Penerangan tentang latar belakang dan objektif kelab.
- **Pendaftaran (`register.html`)** — Borang untuk bakal ahli mendaftar.
- **Log Masuk (`login.html`)** — Halaman log masuk ahli.
- **Bayaran (`payment.html`)** — Borang untuk memaparkan maklumat bayaran dan nombor rujukan.
- **Berita (`berita.html`)** — Artikel berkaitan teknologi dan keselamatan siber.

## Teknologi

Projek ini dibina menggunakan HTML, CSS dan JavaScript tanpa rangka kerja front-end.

- `style.css` — Gaya utama laman web.
- `animation.css` — Gaya animasi.
- `theme.js` — Fungsi pertukaran tema.
- `news-data.js` — Fungsi paparan berita.
- `fetch-news.js` — Script Node.js untuk mengambil dan mengemas kini data berita ke dalam `berita.json`.

## Cara Menjalankan

1. Muat turun atau klon repositori ini.
2. Buka `index.html` dalam pelayar web untuk melihat laman utama.

Untuk mengemas kini berita, jalankan script berikut menggunakan versi Node.js yang menyokong `fetch` dan `AbortSignal.timeout`:

```bash
node fetch-news.js
```

Script ini memerlukan sambungan internet dan menggunakan perkhidmatan RSS2JSON serta suapan RSS yang ditetapkan dalam `fetch-news.js`.

## Nota

Laman ini ialah projek front-end statik. Borang log masuk, pendaftaran dan bayaran tidak disambungkan kepada pangkalan data atau gerbang pembayaran; maklumat yang dipaparkan pada halaman bayaran hanyalah rujukan dan bukan pengesahan transaksi.

## Hak Cipta

© 2026 Kelab Teknologi Digital. Hak cipta terpelihara.
