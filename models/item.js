const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Gear', 'Treasure', 'Potions', 'Books'],
        },
        isMagical: {
            type: Boolean,
        },
        description: {
            type: String,
            required: true,
        },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;