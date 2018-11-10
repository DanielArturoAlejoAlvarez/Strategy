'use strict'

const mongoose=require('mongoose')
mongoose.set('useCreateIndex', true)
const bcrypt = require('bcryptjs')
const {Schema}=mongoose

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

module.exports.getUserByUsername=function(username,callback){
    let query={username: username}
    User.findOne(query, callback)
}

module.exports.getUserById=function(id,callback){
    User.findById(id, callback)
}

module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword, hash, function(err,isMatch){
        if(err) throw err 
        callback(null, isMatch)
    })
}

