'use strict'

const express=require('express'),
      path=require('path'),
      morgan=require('morgan'),
      cookieParser=require('cookie-parser'),
      hbs=require('express-handlebars'),
      //ejs=require('ejs-mate'),
      expressValidator=require('express-validator'),
      flash=require('connect-flash'),
      session=require('express-session'),
      passport=require('passport'),
      localStrategy=require('passport-local').Strategy,
      mongo=require('mongodb'),
      mongoose=require('mongoose')

//DB connect
mongoose.connect('mongodb://127.0.0.1/strategydb', {useNewUrlParser: true})
const db=mongoose.connection

const routes=require('./routes')
const users=require('./routes/users')

const app=express()

app.set('views', path.join(__dirname, 'views'))

//Templates
app.engine('hbs', hbs({
    defaultLayout: 'default',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts/'
}))
app.set('view engine', '.hbs')


//app.engine('ejs', ejs)
//app.set('view engine', 'ejs')

//Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.use(cookieParser())


//Static files
app.use(express.static(path.join(__dirname, 'public')))

//Session
app.use(session({
    secret: 'OmfXwXO4fbw1DSthuiqDk78X85C3TmQHyUDIR3',
    saveUninitialized: true,
    resave: true
}))

//Passport init
app.use(passport.initialize())
app.use(passport.session())

//Validator
app.use(expressValidator({
    errorFormatter: function(param,msg,value){
        var namespace=param.split('.'),
            root=namespace.shift(),
            formParam=root

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }

        return{
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

//Flash data
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    res.locals.user=req.user || null
    next()
})

//Routes
app.use('/', routes)
app.use('/users', users)

app.set('port', (process.env.PORT || 3000))

//Server
app.listen(app.get('port'), ()=>{
    console.log(`Servern running in port: ${app.get('port')}`)
})