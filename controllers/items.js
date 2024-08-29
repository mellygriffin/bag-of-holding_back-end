const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Item = require('../models/item.js');
const router = express.Router();

// ========== Public Routes ===========

//GET - Read, return all items
router.get('/landing', async (req, res) => {
    try {
        const items = await Item.find({})
        .populate('owner')
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json(error);
    }
});

// ========= Protected Routes =========

router.use(verifyToken);

//GET - Read, return all items of user
router.get('/', async (req, res) => {
    console.log(req.user._id)
    try {
        const items = await Item.find({owner: req.user._id})
        .populate('owner')
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json(error);
    }
});

//POST - Create an item route
router.post('/', async (req, res) => {
    try {
        req.body.owner = req.user._id;
        const item = await Item.create(req.body);
        item._doc.owner = req.user;
        res.status(201).json(item);
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
});


//GET - Show item details
router.get('/:itemId', async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId).populate('owner');
        res.status(200).json(item);
    } catch(error) {
        res.status(500).json(error);
    }
});

//PUT - Update item 
router.put('/:itemId', async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if(!item.owner.equals(req.user._id)) {
            return res.status(403).send("You don't have permission for that!");
        }
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.itemId,
            req.body,
            { new: true }
        );
        updatedItem._doc.owner = req.user;
        res.status(200).json(updatedItem);
    } catch(error) {
        res.status(500).json(error);
        console.log(error)
    }
});

//DELETE - delete item
router.delete('/:itemId', async (req, res) => {
    try {
        const item = await Item.findById(req.params.itemId);
        if(!item.owner.equals(req.user._id)) {
            return res.status(403).send("You don't have permission for that!");
        }
        const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
        res.status(200).json(deletedItem);
        console.log(deletedItem)
    } catch(error) {
        res.status(500).json(error);
    }
});


module.exports = router;