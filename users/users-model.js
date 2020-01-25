const bcrypt = require('bcrypt.js')

const db = require('../database/db-config.js')

function find() {
    return db('users').select('id', 'username')
}

function findBy(filter) {
    return db('users').where(filter).select('id', 'username', 'password')
}

function findById(id) {
    return db('users').where({id}).first('id', 'username')
}

async function add(user) {
    user.password = await bcrypt.hash(user.password, 12)
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    add, find, findBy, findById
}