/*======DEFINE MONGOOSE SCHEMAS==============================================*/
var mongoose = require('mongoose');
var ingredientSchema = require('./ingredient.schema.js');

var listSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    listName: {
        type: String,
        required: true,
        default: "(No name specified)"
    },
    ingredients: {
        type: [ingredientSchema],
        required: true,
        default: [
            {
                "ingredientName": "(No ingredients specified)"
            }
        ]
    }
});

listSchema.pre('save', function(next) {
    this.updated = new Date();
    next();
});

module.exports = listSchema;
