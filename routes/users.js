'use strict'

const express=require('express')

const router=express.Router()

const User=require('../models/User')

const passport=require('passport')

const localStrategy=require('passport-local').Strategy 

const bcrypt=require('bcryptjs')

//API
router.get('/api', async (req,res)=>{
    await User.find({}, (err,users)=>{
        res.json({users})
    })      
})

router.get('/api/:id', async (req,res)=>{
    const user=await User.findById(req.params.id)
    res.json({user})
})

router.delete('/api/:id', async (req,res)=>{
    const user=await User.findByIdAndRemove(req.params.id)
    res.json({
        status: 'User deleted!',
        user
    })
}) 

function hashPass(password) {
    const salt=bcrypt.genSaltSync(10)
    const hashed=bcrypt.hashSync(password, salt, (err,hash)=>{
        if(err) return err
        user.password=hash
    })
    console.log('Password is ' + password);
    console.log('Password hashed is ' + hashed);
    return hashed;
}

router.put('/api/:id', async (req,res)=>{
    
    let {name,email,username,avatar,role,age,state}=req.body   
    
    let pass=req.body.password
    let password=hashPass(pass)
    
    let newUser={name,email,username,password,avatar,role,age,state}

    await User.findByIdAndUpdate(req.params.id, newUser, (err,user)=>{
        if(err) throw err
        console.log(user)
        res.json({
            status: 'User updated!'
        })
    })

})
 
router.post('/api/', async (req,res)=>{  
    
    const user=new User()
    user.name=req.body.name
    user.email=req.body.email
    user.username=req.body.username
    user.password=hashPass(req.body.password)
    user.avatar=req.body.avatar
    user.role=req.body.role
    user.age=req.body.age
    user.state=req.body.state

    await user.save((err,newUser)=>{
        if(err) throw err
        console.log(newUser)
        res.json({
            status: 'User created!'
        })
    })
})


//ROUTES
router.get('/profile', (req,res)=>{
    res.render('profile')    
})

router.get('/register', (req,res)=>{
    res.render('register')
})

router.get('/login', (req,res)=>{
    res.render('login')
})

router.post('/register', (req,res)=>{
    let {name,email,username,password,password2,avatar,role,age,state}=req.body

    //Validations
    req.checkBody('name', 'Name is required').notEmpty()
    req.checkBody('email', 'Email is not valid').isEmail()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()
    req.checkBody('password2', 'Password do not match').equals(req.body.password)
    req.checkBody('avatar', 'Avatar is required').notEmpty()
    req.checkBody('role', 'Role is required').isNumeric()
    req.checkBody('age', 'Age is required').isNumeric()
    req.checkBody('state', 'State is required').isBoolean()

    let errors=req.validationErrors()
    if(errors){
        //console.log('YES')
        res.render('register', {
            errors: errors
        })
    }else{
        //console.log('PASS')
        let newUser=new User({
            name: name,
            email: email,
            username: username,
            password: password,
            avatar: avatar,
            role: role,
            age: age,
            state: state

        })

        User.createUser(newUser, (err,user)=>{
            if(err) throw err
            console.log(user)
        })

        req.flash('success_msg', 'You are registered and can now login.')
        res.redirect('/users/login')
    }
})

passport.use(new localStrategy(function(username,password,done){
   User.getUserByUsername(username, function(err,user){
       if(err) throw err
       if(!user){
           return done(null, false, {message: 'Unknow User!'})
       }
       User.comparePassword(password, user.password, function(err, isMatch){
            if(err) throw err
            if(isMatch){
               return done(null, user) 
            }else{
                return done(null, false, {message: 'Invalid password!'})
            }
       })
   })
}))

passport.serializeUser(function(user,done){
    done(null, user.id)
})

passport.deserializeUser(function(id,done){
    User.getUserById(id, function(err,user){
        done(err, user)
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}),function(req,res){    
    res.redirect('/')
})

router.get('/logout', (req,res)=>{
    req.logout()
    req.flash('success_msg', 'Your are logged out!')
    res.redirect('/users/login')
})



module.exports=router