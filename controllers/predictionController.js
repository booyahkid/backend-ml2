const { v4: uuidv4 } = require('uuid');
const tf = require('@tensorflow/tfjs-node');
const modelService = require('../services/modelService');

let model;

modelService.loadModel().then(loadedModel => {
    model = loadedModel;
    console.log('Model loaded successfully');
}).catch(error => {
    console.error('Error loading model:', error);
});

exports.predict = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    try {
        const image = tf.node.decodeImage(req.file.buffer);
        const resizedImage = tf.image.resizeBilinear(image, [224, 224]); // Example image size, adjust as needed
        const expandedImage = resizedImage.expandDims(0); // Add batch dimension
        const prediction = model.predict(expandedImage);
        const result = prediction.dataSync()[0] > 0.5 ? 'Cancer' : 'Non-cancer';

        const response = {
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
                result,
                suggestion: 'Segera periksa ke dokter!',
                createdAt: new Date().toISOString()
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(400).json({ status: 'fail', message: 'Terjadi kesalahan dalam melakukan prediksi' });
    }
};
