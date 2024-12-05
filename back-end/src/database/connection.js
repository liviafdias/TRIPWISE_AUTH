
var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host : 'localhost' || process.env.HOST_DB,
        user : 'root',
        password : '12345678',
        database : 'tripwise'
     }
});

module.exports = knex