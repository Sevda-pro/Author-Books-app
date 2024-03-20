const express = require('express')
const router = express.Router()
const controller=require('../Controller/authorController')

router.get('/',controller.allauthors);
router.get('/new',controller.newauthor )
router.post('/',controller.postauthor )
router.get('/:id',controller.authorbyid)
router.get('/:id/edit',controller.editauthor )
router.put('/:id',controller.updateauthor)
router.delete('/:id', controller.deleteauthor)

module.exports = router