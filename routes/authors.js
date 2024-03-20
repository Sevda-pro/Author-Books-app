const express = require('express')
const router = express.Router()
const constroller=require('../Controller/authorController')

router.get('/',controller.allauthors);
router.get('/new',controller.newauthor )
router.post('/',controller.postauthor )
router.get('/:id',constroller.authorbyid)
router.get('/:id/edit',constroller.editauthor )
router.put('/:id',controller.updateauthor)
router.delete('/:id', controller.deleteauthor)

module.exports = router