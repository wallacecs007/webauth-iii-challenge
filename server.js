const express = require('express')

//Route definitions here

const server = express();
server.use(express.json());

//Server uses

module.exports = server;