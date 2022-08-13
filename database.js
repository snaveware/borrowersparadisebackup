
const {connect}  = require('mongoose')
const Logger = require('./Logger')
const sysConfig = require('./Config')

function DBConnect(){
    console.log('database connection called')
    Logger.info('connecting to database...')
    
    const dbString = sysConfig.DB_CONNECTION_STRING
    
    if(!dbString){
        return Logger.error(` No database string provided`)
    }

    
    try {
        connect(dbString) 
       
    } catch (error) {
        Logger.error(`failed to connect to database error: ${error}`)
        process.emit('SIGINT', {reason: "Failed to connect to database"})
    }
}


module.exports = {DBConnect}