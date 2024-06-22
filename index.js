const express = require('express');
const app = express();
const { PORT } = require('./config/config');
const upload = require('./middlewares/uploadMiddleware.js');
const predictionController = require('./controllers/predictionController');

app.post('/predict', upload.single('image'), predictionController.predict);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        res.status(413).json({ status: 'fail', message: 'Payload content length greater than maximum allowed: 1000000' });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
