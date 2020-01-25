const bcrypt = require('bcryptjs')
const express = require('express')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets.js')
const users = require('../users/users-model.js')

const router = express.Router();

router.post('/register', async(req, res, next) => {
    const user = req.body;

    if (!user || !user.username || !user.password) {
        return res.status(401).json({message: 'Please include a username and password.'})
    }

    users.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(err => {
            res.status(500).json({message: `Failed to register for: ${err}`})
        })
})

router.post('/login', async(req, res, next) => {
    try {
        const {username, password} = req.body;
        const user = await users.findBy({username}).first()
        const passwordValid = await bcrypt.compare(password, user.password)

        if(user && passwordValid) {
            req.session.user = user;
            const token = generateToken(user);
            res.status(200).json({
                token,
                message: `User ${username} authenticated.`
            })
        } else {
            res.status(401).json({message: `Authentication Failed`})
        }

    } catch (err) {
        next(err)
    }
})

router.get('/users', async (req, res, next) => {
    try {
        const users = await usersModel.find()
        res.status(200).json(users)
    } catch(err) {
        next(err)
    }
})

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    }

    const options = {
        expiresIn: '1h',
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;