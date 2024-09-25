const express=require('express');
const dotenv=require('dotenv');
const path=require('path');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken')
const db=require('./config/config');
const User=require('./models/User');
const Detail=require('./models/UserDetails')
const brcypt=require('bcrypt');
const app=express();

dotenv.config({path:path.join(__dirname,'config','config.env')});

const salt=brcypt.genSaltSync(10);
const secret='ragel2352f245';
const options={
    expiresIn:'1h'
}

app.use(cors({credentials:true,origin:'http://localhost:3001'}));
app.use(express.json());
app.use(cookieParser());
db();

function extractUsername(req, res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        console.log(user.id)
        req.user= user; 
        next();
    });
}

app.post('/signup',async(req,res)=>{

    const {userName,email,password}=req.body;

    try{
        const user=new User({
            userName,
            email,
            password:brcypt.hashSync(password,salt),
        });
        await user.save();
        res.status(201).json({messagge:'User registered Successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({error:'Failed to register user'})
    }
    
});


app.post('/login',async(req,res)=>{

    const {email,password}=req.body;

    
    const user=await User.findOne({email});
    console.log(user)
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk=brcypt.compareSync(password,user.password);
    if(passOk){
        const payload = {
            id:user._id
        }
        const token = jwt.sign(payload, secret, options);

            res.cookie('token',token).json({
                id:user._id,
                email:user.email,
                userName:user.userName,
                token:token,
            });
    }else{
        res.status(400).json('Wrong credentials')
    }
   
});

app.post('/formpost',extractUsername,async(req,res)=>{
    const {name,address}=req.body;
    console.log(req.body)

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const {name,address}=req.body;
        console.log(req.body)
        const postDoc=await Detail.create({
            name,
            address,
        })
        res.json(postDoc);
        
        
    });
});

app.get('/employee',extractUsername,async(req,res)=>{
    const user_id=req.user.id;
    console.log(user_id);
    try{
        const employees=await Detail.find({})
        res.json(employees);
        console.log('Data not fetched')
    }catch(err){
        res.status(500).json({message:'Error Fetching tasks',err})
    }
})

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
});

app.listen(process.env.PORT,()=>{
    console.log(`Server Listening on port ${process.env.PORT}`);
    
})