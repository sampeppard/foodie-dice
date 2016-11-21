/*======DEFINE MONGOOSE SCHEMAS==============================================*/
var mongoose = require('mongoose');

var ingredientSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
    },
    ingredientName: {
        type: String,
        required: true,
        default: "(No name specified)"
    }
});

ingredientSchema.pre('save', function(next) {
    // Make sure that updated holds the current date/time
    this.updated = new Date();
    next();
});

module.exports = ingredientSchema;
