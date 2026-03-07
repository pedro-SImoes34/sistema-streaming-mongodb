// Importa os modelos necessários
const History = require('../models/history');
const Video = require('../models/video');
const mongoose = require('mongoose');


// Função responsável por registrar uma visualização de vídeo
const registerView = async (req, res) => {

    try {

        // Dados enviados pelo cliente
        const { userId, videoId, progress, rating } = req.body;

        // Criamos um novo registro de histórico no banco
        const history = await History.create({
            userId,
            videoId,
            progress,
            rating
        });

        // Incrementa o número de visualizações do vídeo
        // O operador $inc soma +1 ao campo views
        await Video.findByIdAndUpdate(videoId, {
            $inc: { views: 1 }
        });

        // Caso o usuário tenha avaliado o vídeo
        if (rating) {

            // Buscamos o vídeo no banco
            const videoDoc = await Video.findById(videoId);

            // Calcula nova média de avaliações
            const newAverage =
                ((videoDoc.averageRating * videoDoc.views) + rating) /
                (videoDoc.views + 1);

            // Atualiza a média de avaliação
            await Video.findByIdAndUpdate(videoId, {
                averageRating: newAverage
            });
        }

        // Retorna o histórico criado
        res.status(201).json(history);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }
};



// Função que busca o histórico de um usuário
const getUserHistory = async (req, res) => {

    try {

        const { userId } = req.params;

        // Aggregation usada para buscar o histórico
        const history = await History.aggregate([

            // Filtra registros apenas do usuário informado
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },

            // Faz um JOIN com a coleção de vídeos
            {
                $lookup: {
                    from: 'videos',
                    localField: 'videoId',
                    foreignField: '_id',
                    as: 'video'
                }
            },

            // Converte o array retornado pelo lookup em objeto
            {
                $unwind: '$video'
            },

            // Ordena pelo vídeo mais recente
            {
                $sort: { viewDate: -1 }
            }

        ]);

        res.json(history);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
};


// Exporta as funções
module.exports = {
    registerView,
    getUserHistory
};