const Recipe = require('../models/recipe');

const ITEMS_PER_PAGE = 6;

exports.getIndex = (req, res, next) => {
    let firstName = null;
    let username = null;
    if(req.session.user) {
        firstName = req.session.user.firstName;
        username = req.session.user.username;
    } 
    res.render('food/index', {
        path: '/',
        firstName : firstName,
        username: username,
    });
}

exports.getRecipes = (req, res, next) => {
    var firstName = null;
    var username = null;
    if(req.session.user) {
        firstName = req.session.user.firstName;
        username = req.session.user.username;
    } 
    const page = parseInt(req.query.page) || 1;
    let totalItems;

    Recipe.find()
    .countDocuments()
    .then(numRecipes => {
        totalItems = numRecipes;
        if(totalItems < (page-1)*ITEMS_PER_PAGE ) {
            return res.render('error/404', {
                path: '/404',
                firstName : firstName,
                username: username,
            });
        }
        let skipped = totalItems - (page) * ITEMS_PER_PAGE;
        let show = ITEMS_PER_PAGE;
        if(skipped < 0) {
            skipped = 0;
            show = totalItems%ITEMS_PER_PAGE;
        }
        return Recipe.find()
        .skip(skipped)
        .limit(show)
        .then(recipes => {
            // console.log(recipes);
            res.render('food/recipes', {
                path: '/recipes',
                recipes: recipes,
                firstName: firstName,
                username: username,
                currentPage : page,
                hasNextPage : ITEMS_PER_PAGE * page < totalItems,
                hasPrevPage : page > 1,
                nextPage : page + 1,
                prevPage : page - 1,
                lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
    })
    .catch(err => {
        res.redirect('/500');
    })
}



exports.getRecipe = (req, res, next) => {
    const recipeId = req.params.recipeId;
    Recipe.findById(recipeId)
    .then(recipe => {
        if(!recipe) {
            return res.render('error/404', {
                path: '/404',
                firstName: req.user.firstname,
                username: req.user.username
            });
        }
        return res.render('food/recipe-detail', {
            path: '/recipes',
            firstName: req.user.firstName,
            username: req.user.username,
            recipe: recipe
        });
    })
    .catch(err => {
        // console.log(err);
        return res.render('error/404', {
            path: '/404',
            firstName: req.user.firstname,
            username: req.user.username
        });
        
    })
}