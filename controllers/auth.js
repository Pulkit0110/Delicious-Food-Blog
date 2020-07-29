const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path : '/login',
        firstName: '',
        username: '',
        errorMessage: null
    });
}

exports.getSignup = (req,res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        oldInput: {
            username: '',
            firstName: '',
            lastName: '',
            email: ''
        },
        firstName: '',
        username: '',
        errorMessage: null
    });
}

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let user;
    User.findOne({username: username})
    .then(userDoc => {
        if(!userDoc) {
            User.findOne({email: username})
            .then(emailuser => {
                if(!emailuser) {
                    return res.render('auth/login', {
                        path : '/login',
                        username : username,
                        errorMessage: "Invalid username or password "
                    });
                }
                let user = emailuser;
                bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(!doMatch) {
                        return res.render('auth/login', {
                            path : '/login',
                            username : username,
                            errorMessage: "Invalid username or password "
                        });
                    }
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect('/');
                    });
                    
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/500');
                });
            })
            .catch(err => {
                res.redirect('/500');
            })
        } 
        else {
            user = userDoc;
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(!doMatch) {
                    return res.render('auth/login', {
                        path : '/login',
                        username : username,
                        errorMessage: "Invalid username or password "
                    });
                }
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save((err) => {
                    console.log(err);
                    res.redirect('/');
                });
                
            })
            .catch(err => {
                console.log(err);
                res.redirect('/500');
            });
        }
    })
    .catch(err => {
        res.redirect('/500');
    });
}

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    console.log(errors.array());
    if(!errors.isEmpty()) {
        return res.render('auth/signup', {
            path: '/signup',
            oldInput: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email
            },
            firstName: '',
            username: '',
            errorMessage: errors.array()[0].msg
        });
    }

    if(password != confirmPassword) {
        return res.render('auth/signup', {
            path: '/signup',
            oldInput: {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email
            },
            firstName: '',
            username: '',
            errorMessage: "Passwords have to match"
        });
    }


    User.findOne({email: email})
    .then(emailuser => {
        if(emailuser) {
            return res.render('auth/signup', {
                path: '/signup',
                oldInput: {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                },
                firstName: '',
            username: '',
                errorMessage: "Email already taken. Please pick a  different one."
            });
        }
        User.findOne({username: username})
        .then(user => {
            if(user) {
                return res.render('auth/signup', {
                    path: '/signup',
                    oldInput: {
                        username: username,
                        firstName: firstName,
                        lastName: lastName,
                        email: email
                    },
                    firstName: '',
                    username: '',
                    errorMessage: "Username already taken. Please pick a  different one."
                });
            }
            bcrypt.hash(password, 12)
            .then(hashedPassword => {
                const newUser = new User({
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword
                });
                return newUser.save()
                
            })
            .then(result => {
                res.redirect('/login');
            })
            .catch(err => {
                res.redirect('/500');
            });
        })
    })
    .catch(err => {
        res.redirect('/500');
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    })
}