# STRATEGY
## Description

This repository is a Application software with Nodejs, Express, MongoDB and Ajax, this application contains an API created with Express and an authentication using Passport.

## Installation
Using Nodejs v10.3, Express, Mongoose, Passport, Bcrypt, Express-Validator, Connect-Flash, Express-Handlebars, etc preferably.

## DataBase
Using MongoDB preferably.

## Apps
Using Postman or RestEasy to feed the api.

## Usage
```html
$ git clone https://github.com/DanielArturoAlejoAlvarez/Strategy.git [NAME APP] 

$ npm install

$ npm start
```
Follow the following steps and you're good to go! Important:


![alt text](https://camo.githubusercontent.com/a0bfb0b779d1b5403270806adfac6b31c647c168/68747470733a2f2f6f6f6f2e306f302e6f6f6f2f323031352f31322f32302f353637373638663430616339312e676966)


## Coding

### Urls

```javascript
...
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
        
        res.render('register', {
            errors: errors
        })
    }else{
        
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
...
```




### Model

```javascript
...
const UserSchema=new Schema({    
    username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
    },
    avatar: {
        type: String
    },
    role: {
        type: Number
    },
    age: {
        type: Number
    },
    state: {
        type: Boolean
    } 
})

const User=module.exports=mongoose.model('User', UserSchema)

module.exports.createUser=function(newUser,callback){    
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password, salt, function(err,hash){
            newUser.password=hash
            newUser.save(callback)
        })
    })
}
...
```

### Config
```javascript
...
//Session
app.use(session({
    secret: 'mysecretkey',
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
...
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/DanielArturoAlejoAlvarez/Strategy. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).