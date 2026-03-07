const User = require('../models/user');


// Criar usuário
const createUser = async (req, res) => {

    try {

        const user = await User.create(req.body);

        res.status(201).json(user);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }
};


// Listar usuários
const getUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }
};


module.exports = {
    createUser,
    getUsers
};