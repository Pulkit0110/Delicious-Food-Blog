const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipes = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    ingredients: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: String,
            required: true
        }
    }],
    description: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    prepTime: {
        type: String
    },
    cookingTime: {
        type: String
    },
    yields: {
        type: Number
    },
    people: [{
        username: {
            type: String,
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }],
    totalRating: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Recipe', recipes);