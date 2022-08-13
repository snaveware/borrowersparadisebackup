module.exports = {
    DB_CONNECTION_STRING:  process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/borrowersbackup',
    PORT: process.env.PORT || '5000',
    SECRET: process.env.SECRET,
    NODE_ENV:  process.env.NODE_ENV || 'development'
}