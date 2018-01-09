const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2
    },
    password:{
        required:true,
        minlength:8,
        type:String
    },
    email:{
        type:String,
        required:true,
        minlength:5,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`given string is not a valid email address!`

        }
    },
    age:{
        type:Number,
        minlength:10
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]

});

let TaskSchema=new mongoose.Schema({
    Task:{
        required:true,
        type:String
    },
    status:{
        type:Boolean,
        default:false,
    },
    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
});


UserSchema.methods.genAuth = function(){
    console.log(this);
    let access = `auth`;
    let data = {_id:this._id.toHexString()};
    let token=jwt.sign(data,`shashvat`);
    console.log(`token:`)
    console.log(typeof(token));
    this.tokens.push({access,token});
    this.save().then((user)=>{
        return user;
    }).catch((err)=>{console.log(err.message);return null;});
    return token;
};


UserSchema.statics.findByToken=function(token){
    return decoded = jwt.verify(token,`shashvat`);
};

let UserModel_hbs=mongoose.model('hbs_Users_coll',UserSchema);
let TaskModel_hbs=mongoose.model('hbs_Tasks_coll',TaskSchema);

UserSchema.pre('save',function(next){
    if(this.password.length!=60) {
    hbs_Users_coll=this;
    console.log(`this object is: `);
    console.log(this);

        bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(this.password, salt);
        })
            .then((hash) => {
                this.password = hash;
                next();
            }).catch((err) => {
            console.log(err.message);
        });

    }
});


module.exports={
    UserModel_hbs,
    TaskModel_hbs
};