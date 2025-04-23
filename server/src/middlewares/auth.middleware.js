import jwt from "jsonwebtoken"
import { db } from "../libs/db.js"

export const authMiddleware=async(req,res,next)=>{
    const token=req.cookies.leet
    console.log(token,'value in token--------')
if(!token){
    return res.status(401).json({
        message:"Unauthorized - No token provided"
    })
}
    try{
        let decoded=jwt.verify(token,process.env.JWT_SECRET)

const user=await db.user.findUnique({
    where:{
        id:decoded.id
    },
    select:{
        id:true,
        name:true,
        image:true,
        email:true,
        role:true
    }
   
})
if(!user){
    return res.status(401).json({
        message:"User not found"
    })
}
req.user=user
next()
    }
    catch(error){
return res.status(500).json({message:"Error authenticating user",error})
    }
}