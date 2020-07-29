const express = require('express');
const {body, check} = require('express-validator');

const router = express();

const adminController = require('../controllers/admin');
const isauth = require('../middleware/is-auth');

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upload = multer({storage: fileStorage, fileFilter: fileFilter});

router.get('/account/:username', isauth, adminController.getAccount);

router.get('/edit-profile/:username', isauth, adminController.getEditProfile);

router.post('/edit-profile', 
[
    body('email', 'Please enter a valid email-address')
    .isEmail()
    .normalizeEmail(),
    body('firstName', 'First name should contain atmost 12 characters')
    .isLength({max: 12})
], isauth, adminController.postEditProfile);

router.get('/view-recipes/:username', isauth, adminController.getViewRecipes);

router.get('/new-recipe', isauth, adminController.getAddRecipe);

router.post('/new-recipe',
[
    body('prephrs')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Preparation time is not valid!");
        }
        return true;
    }),
    body('prepmin')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Preparation time is not valid!");
        }
        return true;
    }),
    body('cookhrs')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Cooking time is not valid!");
        }
        return true;
    }),
    body('cookmin')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Cooking time is not valid!");
        }
        return true;
    }),
    body('yields')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Yields field is not valid!");
        }
        return true;
    })
], upload.single('image'), isauth, adminController.postAddRecipe);

router.get('/edit-recipe/:recipeId', isauth ,adminController.getEditRecipe);

router.post('/edit-recipe',
[
    body('prephrs')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Preparation time is not valid!");
        }
        return true;
    }),
    body('prepmin')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Preparation time is not valid!");
        }
        return true;
    }),
    body('cookhrs')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Cooking time is not valid!");
        }
        return true;
    }),
    body('cookmin')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Cooking time is not valid!");
        }
        return true;
    }),
    body('yields')
    .custom((value, {req}) => {
        if(value < 0) {
            throw new Error("Yields field is not valid!");
        }
        return true;
    })
], upload.single('image'), isauth, adminController.postEditRecipe);

router.post('/delete-recipe', isauth, adminController.deleteRecipe);

module.exports = router;