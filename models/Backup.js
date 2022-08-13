const {Schema, model} = require('mongoose') 

const backupSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    data: {
        type: [Object],
        default: []
    }
})



const Backup = model('Backup',backupSchema)

module.exports = Backup