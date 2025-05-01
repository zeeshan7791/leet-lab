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

export const checkAdmin=async(req,res,next)=>{
    try {
        const userId=req.user.id
        const user=await  db.user.findUnique({
            where:{
                id:userId
            },
            select:{
                role:true
            }
        })
        if(!user||user.role!=="ADMIN"){
            return res.status(403).json({
                message:"access denied -Admin only"
            })
        }
        next()
    } catch (error) {
        console.log("Error checking admin role",error)
        res.status(500).json({
            error:"error checking admin role",
            success:false
        })
    }
}