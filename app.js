require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const User = require('./models/user')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const mongoDb = process.env.DB_URL

main().catch((err) => console.log(err))

async function main(){
  await mongoose.connect(mongoDb)
  console.log('connection to database successful')
  
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({secret: "cats", resave: false, saveUninitialized: true}))

passport.use(
  new localStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({username: username})
      if (!user) {
        return done(null, false, {message: "Incorrect Username"})
      }
      if (user.password !== password){
        return done(null, false, {message: "Incorrect password"})
      }
      return done(null, user)
    } catch (error) {
      return done(error)     
    }
  })
)

passport.serializeUser(function(user, done){
  done(null, user.id)
});

passport.deserializeUser(async function(id, done){
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

app.use(passport.initialize())
app.use(passport.session())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
