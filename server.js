const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const bcrypt = require(`bcryptjs`);

const config = require('./config');
const models = require('./models');
//middleware
let getId = function(req,res,next){
    console.log(req.header);
};

let app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','hbs');
mongoose.connect(`mongodb://localhost:27017/shashvat_db`);

app.get(`/`,(req,res)=>{
    res.render('home.hbs');
});
app.get('/reg',(req,res)=>{
    res.render(`reg.hbs`);
});
app.post('/registration',(req,res)=>{
    let newEntry = new models.UserModel_hbs(req.body);
    newEntry.save().then((res)=>{
        //console.log(res);
    }).catch((err)=>{res.send(`<h4>${err.message}</h4>`);});
    //console.log(req.body);
    //res.send(req.body);
});
app.get(`/login`,(req,res)=> {
    res.render(`login.hbs`);
});
app.post('/logincheck',(req,res)=>{
    console.log(`login check`);
    let givenpass=req.body.password;
    console.log(`givenpass`);
    console.log(givenpass);
    console.log(req.body.email);

    models.UserModel_hbs.findOne({email:req.body.email}).then((user)=>{
        if(user){
            console.log(`check pass`);
            bcrypt.compare(givenpass,user.password).then((res1)=>{
                console.log(res1);
                if(res1){
                    let gg = new models.UserModel_hbs(user);
                    let token = gg.genAuth();
                    console.log(`============token===========`);
                    console.log(token);
                    res.header(`x-auth`,token);
                    res.render(`main.hbs`);
                }else{
                    res.send(`wrong email or password`);
                }
            }).catch((err)=>{console.log(err.message)});
        }else{res.send(`wrong email or password`);}
    }).catch((err)=>{console.log(err.message)});



});
app.listen(config.port,()=>{console.log(`listening on ${config.port}`);});