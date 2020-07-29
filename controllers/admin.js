const Recipe = require('../models/recipe');
const User = require('../models/user');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator/check');

exports.getAccount = (req, res, next) => {
    const username = req.params.username;
    const firstName = req.user.firstName;
    const requser = req.user.username;
    // if(req.user) {
    //     firstName = req.user.firstName;
    //     requser = req.user.username;
    // }
    User.findOne({username: username})
    .then(user => {
        if(!user) {
            return res.render('error/404', {
                path: '/404',
                firstName: firstName,
                username: requser
            });
        }
        let editing = true;
        if(req.user.username !== user.username) {
            editing = false;
        }
        return res.render("admin/your-account", {
            path: '/your-account',
            firstName: firstName,
            username: requser,
            user: user,
            editing: editing
        });
    })
    .catch(err => {
        res.redirect('/500');
    })
}

exports.getEditProfile = (req, res, next) => {
    const username = req.params.username;
    const firstName = req.user.firstName;
    const requser = req.user.username;
    // if(req.user) {
    //     firstName = req.user.firstName;
    //     requser = req.user.username;
    // }
    if(requser !== username) {
        return res.render('admin/edit-profile', {
            path: '/edit-profile',
            firstName: firstName,
            username: requser,
            user: undefined
        });
    }
    return res.render('admin/edit-profile', {
        path: '/edit-profile',
        firstName: req.user.firstName,
        username: req.user.username,
        user: req.user,
        errorMessage: ''
    });
}

exports.postEditProfile = (req, res, next) => {
    const username = req.user.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.render('admin/edit-profile', {
            path: '/edit-profile',
            firstName: req.user.firstName,
            username: req.user.username,
            user: req.user,
            errorMessage: errors.array()[0].msg
        });
    }
    let flag = 0;
    if(email !== req.user.email) {
        User.findOne({email: email})
        .then(user => {
            if(user) {
                return res.render('admin/edit-profile', {
                    path: '/edit-profile',
                    firstName: req.user.firstName,
                    username: req.user.username,
                    user: req.user,
                    errorMessage: 'Email already exists. Please pick a different one.'
                });
            } else {
                User.findOne({username: username})
                .then(user => {
                    user.firstName = firstName;
                    user.lastName = lastName;
                    user.email = email;
                    user.save()
                    .then(result => {
                        console.log("Updated Profile");
                        res.redirect('/account/' + username);
                    })
                    .catch(err => {
                        res.redirect('/500');
                    });
                })
                .catch(err => {
                    res.redirect('/500');
                });
            }
        })
        .catch(err => {
            res.redirect('/500');
        });
    }
    else {
        User.findOne({username: username})
        .then(user => {
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.save()
            .then(result => {
                console.log("Updated Profile");
                res.redirect('/account/' + username);
            })
            .catch(err => {
                res.redirect('/500');
            });
        })
        .catch(err => {
            res.redirect('/500');
        });
    }
}

exports.getViewRecipes = (req, res, next) => {
    const username = req.params.username;
    User.findOne({username: username})
    .then(user => {
        if(!user) {
            return res.render('error/404', {
                path: '/404',
                firstName: req.user.firstName,
                username: req.user.username
            });
        }
        let editing = true;
        if(username !== req.user.username) {
            editing = false;
        }
        Recipe.find({username: username})
        .then(recipes => {
            return res.render('admin/your-recipes', {
                path: '/your-recipes',
                firstName: req.user.firstName,
                username: req.user.username,
                editing: editing,
                recipes: recipes
            });
        })
        .catch(err => {
            res.redirect('/500');
        });
    })
    .catch(err => {
        res.redirect('/500');
    });
}

exports.getAddRecipe = (req, res, next) => {
    const firstName = req.user.firstName;
    const username = req.user.username;
    return res.render('admin/add-recipe', {
        path: '/new-recipe',
        firstName: firstName,
        username: username,
        oldInput: {
            name: null,
            // imageUrl: null,
            prephrs: null,
            prepmin: null,
            cookhrs: null,
            cookmin: null,
            description: null,
            yields: null,
            ingQuantity: [],
            ingName: []
        },
        errorMessage: null,
        editing: false
    });
}

exports.postAddRecipe = (req, res, next) => {
    const name = req.body.name;
    const image = req.file;
    const prephrs = req.body.prephrs;
    const prepmin = req.body.prepmin;
    const cookhrs = req.body.cookhrs;
    const cookmin = req.body.cookmin;
    const yields = req.body.yields;
    const ingredientName = req.body.ingName;
    const ingredientQuantity = req.body.ingQuantity;
    const description = req.body.description;
    const username = req.user.username;
    console.log(image);
    // console.log(ingredientName);
    
    if(!image) {
        return res.render('admin/add-recipe', {
            path: '/new-recipe',
            firstName: req.user.firstName,
            username: username,
            oldInput: {
                name: name,
                prephrs: prephrs,
                prepmin: prepmin,
                cookhrs: cookhrs,
                cookmin: cookmin,
                description: description,
                yields: yields,
                ingQuantity: ingredientQuantity,
                ingName: ingredientName
            },
            errorMessage: "The attached file is not an image",
            editing: false
        });
    }

    const ingredients = []
    for(let i=0; i<100; i++) {
        if(ingredientName[i] && ingredientQuantity[i])
            ingredients.push({name:ingredientName[i], quantity: ingredientQuantity[i]});
        else if(ingredientName[i])
            ingredients.push({name: ingredientName[i], quantity: ' '});
        else if(ingredientQuantity[i])
            ingredients.push({name: ' ', quantity: ingredientQuantity[i]});
    }

    const errors = validationResult(req);
    // console.log(errors.array());
    if(!errors.isEmpty()) {
        return res.render('admin/add-recipe', {
            path: '/new-recipe',
            firstName: req.user.firstName,
            username: username,
            oldInput: {
                name: name,
                prephrs: prephrs,
                prepmin: prepmin,
                cookhrs: cookhrs,
                cookmin: cookmin,
                description: description,
                yields: yields,
                ingQuantity: ingredientQuantity,
                ingName: ingredientName
            },
            errorMessage: errors.array()[0].msg,
            editing: false
        });
    }

    const imageUrl = '/' + image.path;

    const newRecipe = new Recipe({
        name: name,
        imageUrl: imageUrl,
        ingredients: ingredients,
        description: description,
        username: username,
        dateCreated: Date.now(),
        yields: yields,
        prepTime: "" + prephrs + " hrs  :  " + prepmin + " min",
        cookingTime: "" + cookhrs + " hrs  :  " + cookmin + " min",
        people: [],
        totalRating: 0
    });

    newRecipe.save()
    .then(result => {
        res.redirect('/recipes');
    })
    .catch(err => {
        res.redirect('/500');
    });
}

exports.getEditRecipe = (req, res, next) => {
    const recipeId = req.params.recipeId;
    Recipe.findById(recipeId)
    .then(recipe => {
        if(!recipe) {
            return res.redirect('/');
        }
        if(recipe.username !== req.user.username) {
            return res.redirect('/');
        }
        const prep = recipe.prepTime.split(' ');
        const prephrs = parseInt(prep[0]);
        const prepmin = parseInt(prep[5]);
        const cook = recipe.cookingTime.split(' ');
        const cookhrs = parseInt(cook[0]);
        const cookmin = parseInt(cook[5]);
        // console.log(recipe.ingredients);
        res.render("admin/edit-recipe", {
            path: '/edit-recipe',
            firstName: req.user.firstName,
            username: req.user.username,
            recipeId: recipe._id,
            name: recipe.name,
            prephrs: prephrs,
            prepmin: prepmin,
            cookhrs: cookhrs,
            cookmin: cookmin,
            description: recipe.description,
            yields: recipe.yields,
            ingredients: recipe.ingredients,
            errorMessage: null
        });
    })
    .catch(err => {
        res.redirect('/500');
    })
}

exports.postEditRecipe = (req, res, next) => {
    const recipeId = req.body.recipeId;
    const name = req.body.name;
    const image = req.file;
    const prephrs = req.body.prephrs;
    const prepmin = req.body.prepmin;
    const cookhrs = req.body.cookhrs;
    const cookmin = req.body.cookmin;
    const yields = req.body.yields;
    const ingredientName = req.body.ingName;
    const ingredientQuantity = req.body.ingQuantity;
    const description = req.body.description;
    const username = req.user.username;

    const ingredients = []
    for(let i=0; i<100; i++) {
        // if((ingredientName[i] && !ingredientQuantity[i]) || (ingredientQuantity[i] && !ingredientName[i])) {
        //     return res.render('admin/edit-recipe', {
        //         path: '/edit-recipe',
        //         firstName: req.user.firstName,
        //         username: username,
        //         recipeId: recipeId,
        //         name: name,
        //         imageUrl: imageUrl,
        //         prephrs: prephrs,
        //         prepmin: prepmin,
        //         cookhrs: cookhrs,
        //         cookmin: cookmin,
        //         description: description,
        //         yields: yields,
        //         ingredients: ingredients,
        //         errorMessage: "Either Quantity or Name of ingredient is missing for ingredient #" + (i+1)
        //     });
        // }
        if(ingredientName[i] && ingredientQuantity[i])
            ingredients.push({name:ingredientName[i], quantity: ingredientQuantity[i]});
        else if(ingredientName[i])
            ingredients.push({name: ingredientName[i], quantity: ' '});
        else if(ingredientQuantity[i])
            ingredients.push({name: ' ', quantity: ingredientQuantity[i]});
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.render('admin/edit-recipe', {
            path: '/edit-recipe',
            firstName: req.user.firstName,
            username: username,
            recipeId: recipeId,
            name: name,
            // imageUrl: imageUrl,
            prephrs: prephrs,
            prepmin: prepmin,
            cookhrs: cookhrs,
            cookmin: cookmin,
            description: description,
            yields: yields,
            ingredients: ingredients,
            errorMessage: errors.array()[0].msg,
        });
    }

    Recipe.findById(recipeId)
    .then(recipe => {
        if(recipe.username !== username) {
            return res.redirect('/');
        }
        recipe.name = name;
        if(image) {

            fileHelper.deleteFile(recipe.imageUrl.substr(1));
            recipe.imageUrl = '/' + image.path;
        }
        
        recipe.description = description;
        recipe.ingredients = ingredients;
        recipe.yields = yields;
        recipe.prepTime = "" + prephrs + " hrs  :  " + prepmin + " min";
        recipe.cookingTime = "" + cookhrs + " hrs  :  " + cookmin + " min";
        return recipe.save();
    })
    .then(result => {
        console.log("edited");
        res.redirect('/view-recipes/' + username);
    })
    .catch(err => {
        res.redirect('/500');
    });
}

exports.deleteRecipe = (req, res, next) => {
    const recipeId = req.body.recipeId;
    Recipe.findById(recipeId)
    .then(recipe => {
        fileHelper.deleteFile(recipe.imageUrl.substr(1));
        return Recipe.deleteOne({_id: recipeId, username: req.user.username});
    })
    
    .then(result => {
        console.log("Deleted");
        // res.status(200).json({ message : 'Success!'});
        res.redirect('/view-recipes/' + req.user.username);
    })
    .catch(err => {
        // res.status(500).json({message : 'Deleting product failed.'});
        res.redirect('/500');
    });
}