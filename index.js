const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// HEDEF: Senin Minecraft sunucunun web portu
const TARGET_SERVER = 'http://144.31.46.17:14320';

// Sağlık kontrolü endpoint'i (Cronjob'un uyanık tutması için)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy is running 24/7!' });
});

// Gelen tüm web paneli isteklerini Minecraft sunucuna yönlendirir
app.use('/', createProxyMiddleware({
  target: TARGET_SERVER,
  changeOrigin: true,
  ws: true, // WebSocket (Canlı loglar/konsol bağlantısı için gerekebilir)
  logLevel: 'info',
  onError: (err, req, res) => {
    res.status(500).send('Minecraft sunucusuna bağlanılamadı. Lütfen sunucunun açık ve portun aktif olduğunu kontrol edin.');
  }
}));

app.listen(PORT, () => {
  console.log(`Proxy sunucusu port ${PORT} üzerinde çalışıyor.`);
});
