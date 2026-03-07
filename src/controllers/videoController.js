const Video = require('../models/video');


// Função para cadastrar um vídeo
const createVideo = async (req, res) => {

    try {

        const { title, category, duration } = req.body;

        const video = await Video.create({
            title,
            category,
            duration
        });

        res.status(201).json(video);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }
};


// Lista todos os vídeos
const getVideos = async (req, res) => {

    try {

        const videos = await Video.find();

        res.json(videos);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
};


// Lista os 10 vídeos mais assistidos
const getTopVideos = async (req, res) => {

    try {

        const videos = await Video.find()
            .sort({ views: -1 })
            .limit(10);

        res.json(videos);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
};


// Busca vídeos por categoria
const getVideosByCategory = async (req, res) => {

    try {

        const { category } = req.params;

        const videos = await Video.find({ category });

        res.json(videos);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
};


module.exports = {
    createVideo,
    getVideos,
    getTopVideos,
    getVideosByCategory
};