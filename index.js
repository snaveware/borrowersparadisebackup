
const {resolve} = require('path')
global.appRoot = resolve(__dirname);


/**
 * Third Party Modules
 */
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const {mkdirSync,existsSync} = require('fs')

/**
 * Custom Modules
 */

const Logger = require('./Logger');
const RequestHandler = require('./RequestHandler');
const {DBConnect} = require('./database');
const {backupsRouter} = require('./routers');
const {createRequestId,logRequests} = require('./middlewares')
const sysConfig = require('./config')



/** log folder */

const folderName = global.appRoot  + '/logs/'

try {
if (!existsSync(folderName)) {
    mkdirSync(folderName)
}
} catch (err) {
console.error(err)
Logger.error(err)
process.emit('SIGINT', {reason: "Failed to create logs folder"}) 
}

/** uploads folder */

const dir = global.appRoot + '/uploads';

try {
    if (!existsSync(dir)){
        mkdirSync(dir)
    }
} catch(error) {
    console.log(error)
    Logger.error(error)
    process.emit('SIGINT', {reason: "Failed to create uploads folder"})
}



/**
 * High Level Declarations and Functions
*/

DBConnect()

const app = express();
const PORT= sysConfig.PORT


/**
 * Middlewares
 */

app.use(express.json());
app.use(cors())
app.use(createRequestId)
app.use(logRequests)



/**
 * Using root for health check
 */
app.get('/health', (req,res)=>{
RequestHandler.sendSuccess(req.requestId,res,"Borrower's Paradise Backup Server is Up and Running")
})

const {sign} = require('jsonwebtoken')

const token  = sign({
    description: "A KEY TO AUTHENTICATE WITH BORROWER'S PARADISE BACKUP SERVER",
    exp: Math.floor(Date.now() / 1000) + (86400 * 365)
},sysConfig.SECRET)

console.log("A Token: ",token)

/**
 * Routers
 */
app.use('/backup', backupsRouter);


/**
 * Other routes are recorded as 404 and 500
 */
app.get('*',( req, res) => {
    
    RequestHandler.sendErrorMessage(req.requestId,res,404,'The GET route you are trying to reach is not available' );
    
})

app.post('*',( req, res) => {
    
    RequestHandler.sendErrorMessage(req.requestId,res,404,'The POST route you are trying to reach is not available' );
    
})

app.put('*',( req, res) => {
    
    RequestHandler.sendErrorMessage(req.requestId,res,404,'The PUT route you are trying to reach is not available' );
    
})
app.patch('*',( req, res) => {
    RequestHandler.sendErrorMessage(req.requestId,res,404,'The PATCH route you are trying to reach is not available' );
    
})

app.delete('*',( req, res) => {
    RequestHandler.sendErrorMessage(req.requestId,res,404,'The DELETE route you are trying to reach is not available' );
    
})

/**
 * Connecting to database before starting the server
*/

mongoose.connection.on('connected', async () =>{

console.log('Database Connected successfully')

    

Logger.info('Starting the server...')

app.listen(PORT || 5000 ,() =>{
    if(!PORT){
        console.log('Server Running on the Default Port 5000')
        return;
    }
        
    console.log(`Server Started on Runtime Port ${PORT} ...`)

    console.log('---all good---')

})  
    
})


process.on('SIGINT', (info) => {
Logger.warn(`Stopping Server   ${info.reason?  'Reason: '+ info.reason : 'Unknown reason' }`)
console.error(`Stopping Server... ${info.reason ? 'Reason: '+ info.reason : 'Unknown reason'}`)
process.exit()
})
 
 
 
 