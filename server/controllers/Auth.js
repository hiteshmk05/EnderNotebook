const User=require("../models/User");
const OTP=require("../models/OTP");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const otpGenerator=require("otp-generator");
const sendResponse=require("../utils/responseHandler");
require("dotenv").config();

//simple login signup shit

exports.sendOTP=async (req,res)=>{
    try {
        const {email,firstName,lastName,password,confirmPassword}=req.body;

        if(!email || !firstName || !lastName || !password || !confirmPassword){
            return sendResponse(res,400,false,"incomplete fields");
        }

        if(password!==confirmPassword){
            return sendResponse(res,400,false,"password doesnt match");
        }

        const checkUserPresent=await User.findOne({email:email});

        if(checkUserPresent){
            return sendResponse(res,400,false,"user already exist");
        }
        
        let otp =otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        
        const result=await OTP.findOne({otp:otp});

        while(result){
            otp =otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            result=await OTP.findOne({otp:otp});
        }

        const otpPayload={email,otp:String(otp)};

        const otpBody=await OTP.create(otpPayload);

        return sendResponse(res,200,true,"otp send successfully");

    } catch (error) {
        console.log(error);
        return sendResponse(res,500,false,"internal server error");
    }  
};

exports.signup= async (req,res) => {
    try {
        const {firstName,lastName,email,password,confirmPassword,otp}=req.body;
        
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return sendResponse(res,400,false,"missing fields");
        }

        if(confirmPassword!==password){
            return sendResponse(res,400,false,"password and confirm do not match");
        }
        
        const userExists = await User.findOne({email:email});
        
        if(userExists){
            return sendResponse(res,400,false,"user already exists");
        }

        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);

        if(recentOtp.length===0){
            return sendResponse(res,400,false,"otp not found idk get rekt");
        }
        if(recentOtp[0].otp!==otp){
            return sendResponse(res,400,false,"otp does not match ded");
        }

        const hashedPwd=await bcrypt.hash(password,10);

        const user=await User.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashedPwd,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        return sendResponse(res,200,true,"user created successfully");

    } catch (error) {
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"user could not be created - internal server error"
        });
    }
};

exports.login = async (req , res) => {
    try {
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill the highlighted fields"
            });
        }

        const userExists=await User.findOne({email:email})

        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"user does not exist sign up first"
            });
        }

        if(await bcrypt.compare(password,userExists.password)){
            const payload={
                email:userExists.email,
                id:userExists._id,
            }
            const token =jwt.sign(payload,process.env.JWT_SECRET , {expiresIn:"3h"});

            userExists.token=token;
            userExists.password=undefined;

            const options = {
                expires: new Date(Date.now() +2*60*60*1000),
                httpOnly:true
            };

            res.cookie("token",token,options).status(200).json({
                success:true,
                token:token,
                userExists,
                message:"logged in successfully"
            });
        }else{
            return res.status(400).json({
                success:false,
                message:"password does not match"
            });
        }


    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"server refused"
        });
    }
};