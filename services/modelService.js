const tf = require('@tensorflow/tfjs-node');
const { MODEL_URL } = require('../config/config');

exports.loadModel = async () => {
    try {
        const model = await tf.loadGraphModel(MODEL_URL);
        return model;
    } catch (error) {
        throw new Error('Error loading model: ' + error.message);
    }
};
