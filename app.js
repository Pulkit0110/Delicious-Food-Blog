const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
// const flash = require('connect-flash');
// const multer = require('multer');

const User = require('./models/user');
const MONGODB_URI = 'mongodb+srv://Pulkit:Pulkit%40780@cluster0-ajkqa.mongodb.net/test?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'images/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, new Date().toISOString() + '-' + file.originalname);
//   }
// });

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const foodRoutes = require('./routes/food');
const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(multer({storage: fileStorage}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
    session({
      secret: 'aham brahmasmi', 
      resave: false, 
      saveUninitialized: false,
      store:  store
}));

// app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findOne({username : req.session.user.username})
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // console.log(res.locals.isAuthenticated);
    next();
})

app.use(authRoutes);
app.use(adminRoutes);
app.use(foodRoutes);
app.get('/500', errorController.get500);
app.use(errorController.get404);

mongoose
    .connect(
      MONGODB_URI,
      {useNewUrlParser: true}
    )
    .then(result => {
      app.listen(3001);
    })
    .catch(err => {
      console.log(err);
    });