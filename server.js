const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint khusus Proxy Download (Memaksa Browser HP mengunduh file)
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;
    const title = req.query.title || 'tiktok_video';
    
    if (!videoUrl) return res.status(400).send('URL Video tidak ditemukan');

    try {
        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream'
        });

        // Header ini yang MEMAKSA HP langsung download tanpa buka tab baru
        res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
        res.setHeader('Content-Type', 'video/mp4');

        response.data.pipe(res);
    } catch (error) {
        res.status(500).send('Gagal mengunduh video dari server');
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
