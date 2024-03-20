const express = require('express')
const router = express.Router()
const controller=require('../Controller/bookController')

router.get('/',controller.getbooks)
router.get('/new',controller.newbook)
router.post('/', controller.postbook)
router.get('/:id', controller.getbookbyid)
router.get('/:id/edit', controller.editbook)
router.put('/:id', controller.updatebook)
router.delete('/:id', controller.deletebook)

module.exports = router