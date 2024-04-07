const express = require('express')
const router = express.Router()
const inventorySchema = require('../models/inventory')

router.use(express.json())

//gets everything
router.get('/', async (req, res) => {
    try {
        const inventorydatas = await inventorySchema.find()
        res.json(inventorydatas)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//gets 1
router.get('/:id', getinventory, (req, res) => {
    res.json(res.inventory)
})

router.get('/getItems/:id', async (req, res) => {//fix this
    try {
        const items = await inventorySchema.findOne({userID: req.params.id});
        res.json(items)
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

//posts 1
router.post('/', async (req, res) => {
    const inventory = new inventorySchema({
        userID: req.body.userID,
        itemName: req.body.itemName,
        itemDesc: req.body.itemDesc,
        itemPrice: req.body.itemPrice,
        itemCount: req.body.itemCount,
        itemIMG: req.body.itemIMG,
        itemRarity: req.body.itemRarity,
        itemIndex: req.body.itemIndex
    })

    try {
        const newinventory = await inventory.save()
        res.status(201).json(newinventory)

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//edits 1
router.patch('/:id', getinventory, async (req, res) => {
    if (req.body.userID != null) {
        res.inventory.userID = req.body.userID
    }
    if (req.body.itemName != null) {
        res.inventory.itemName = req.body.itemName
    }
    if (req.body.itemDesc != null) {
        res.inventory.itemDesc = req.body.itemDesc
    }
    if (req.body.itemPrice != null) {
        res.inventory.itemPrice = req.body.itemPrice
    }
    if (req.body.itemCount != null) {
        res.inventory.itemCount = req.body.itemCount
    }
    if (req.body.itemIMG != null) {
        res.inventory.itemIMG = req.body.itemIMG
    }
    if (req.body.itemRarity != null) {
        res.inventory.itemRarity = req.body.itemRarity
    }
    if (req.body.itemIndex != null) {
        res.inventory.itemIndex = req.body.itemIndex
    }
    try{
        const updatedinventory = await res.inventory.save()
        res.json(updatedinventory)
    } catch (err) {
        res.status(400).json({message: err.message})
    }

})

//removes 1
router.delete('/:id', getinventory, async (req, res) => {
    try{
        await res.inventory.deleteOne()
        res.json({ message: "deleted inventory"})
    } catch  (err){
        res.status(500).json({message: err.message})
    }
})


async function getinventory(req, res, next) {//fix this
    let inventory
    try {
        inventory = await inventorySchema.findById(req.params.id)
        if (inventory == null) {
            return res.status(404).json({ message:"cannot find inventory"})
        }
    } catch(err) {
        res.status(500).json({message: err.message})
    }

    res.inventory = inventory
    next()
}

module.exports = router