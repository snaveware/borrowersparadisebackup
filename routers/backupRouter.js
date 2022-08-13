const router = require('express').Router()

const {BackupsController} = require('../Controllers')

const {authMiddleware} = require('../middlewares')


router.get('/restore',authMiddleware,BackupsController.restoreBackup,)

router.post('/save',authMiddleware,BackupsController.saveBackup)

router.get('/download',BackupsController.downloadBackup)

module.exports = router