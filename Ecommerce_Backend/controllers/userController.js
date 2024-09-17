const User=require('../models/userModel')
const jwt = require('jsonwebtoken');


async function registeruser(req,res){
    console.log('Received request body:', req.body);
    // const { username, email, password, mobileNumber, role } = req.body;
newEmail=req.body.email;
try{
userExist=await User.findOne({email:newEmail});
if(userExist){
    res.status(200).send({message:"User already Exist"});
    console.log("User already Exist");
}else{
    
    const newuser=new User(req.body);
    
    const result= await newuser.save();
    res.status(200).send({message:"User register successfully",task:result})
}

//     const isMatch = await newuser.comparePassword('superSecretPass789');
// console.log(isMatch); // true or false

    } catch(error){
        res.status(500).send(error);
    }
}



async function loginuser(req,res){
    console.log('Received request body:', req.body);
    const {email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        
        // Generate a token with the user's ID
        const token = jwt.sign({user:{ id: user._id, username: user.username, role: user.role }}, 'prajal', { expiresIn: '1h' });


        res.status(200).send({
            message: 'Login Successful',
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            },
        });
    } catch (error) {
        res.status(500).send(error);
    }
}


async function userInformation (req, res) {
    // console.log('****',req.user);
    const id = req.user.id;
    try {
    const user = await User.findOne({_id:id});
    console.log(user);
    if(!user){
        res.status(404).send({ message: 'User does not found.',success:false });
    }else{
        res.status(200).send({user:user, success:true})
    }     
    } catch (error) {
        res.status(500).send({ error });
    }

}





module.exports={
    registeruser,
    loginuser,
    userInformation
   
    
};