const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('index')
})

router.get('/:id', async (req, res) => {
    res.render(req.params.id)
})


module.exports = router;