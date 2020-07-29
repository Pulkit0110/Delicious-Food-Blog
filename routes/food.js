const express = require('express');
const {body, check} = require('express-validator');

const router = express();

const foodController = require('../controllers/food');
const isauth = require('../middleware/is-auth');

router.get('/', foodController.getIndex);

router.get('/recipes', foodController.getRecipes);

router.get('/recipes/:recipeId', isauth, foodController.getRecipe);

module.exports = router;