const express = require('express');
const { model } = require('mongoose');
const profileRouter= express.Router();

profileRouter.get('/getProfile',(req,res)=>{
    const userDeatils=req.user;
    res.status(201).json({status:"success",data:{userDeatils}})

})

profileRouter.post('/updateProfile',async (req,res)=>{
    try{
        const editUserDetails =req.body
        const userDeatils=req.user;
       
        // Define the allowed fields (the ones defined in the schema)
        const allowedFields = ['name', 'age', 'address']; // Replace this with your actual schema fields

        // Ensure the provided fields are part of the allowed schema fields
        const invalidFields = Object.keys(editUserDetails).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        // Update user details
        // userDeatils.firstName = editUserDetails.firstName;
        // userDeatils.lastName = editUserDetails.lastName;
        // userDeatils.phoneNumber = editUserDetails.phoneNumber;
        // userDeatils.city = editUserDetails.city;
        // userDeatils.age = editUserDetails.age;
        // userDeatils.gender = editUserDetails.gender;
        // userDeatils.about = editUserDetails.about;
        // userDeatils.skills = editUserDetails.skills;


        // Iterate over the keys of editUserDetails and update userDeatils if the field exists
        // Object.keys(editUserDetails).forEach((key)=>{
        //     if(editUserDetails[key]!=null || editUserDetails[key]!=undefined){
        //         userDeatils[key]=editUserDetails[key]
        //     }
        //  })
        //Direct Assignment can overwrite fields with undefined if they are not provided.
        //Looping over the payload ensures only fields that are present get updated, preserving all other fields.
        //so
        // Loop through the keys of editUserDetails and update userDeatils only if the field exists in the request
        if (!editUserDetails || Object.keys(editUserDetails).length === 0) {
            throw new Error("No data provided in the request body.");
        }
         Object.entries(editUserDetails).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                userDeatils[key] = value;
            }
        });
        await userDeatils.save();
        res.status(201).json({status:"success",message:"User Profile updated successfuly",data:{userDeatils}})
    }catch(err){
        res.status(400).json({status:"Error",message:err.message,data:{type:err.name || 'Unknown Error' }})
    }
    
})

module.exports={profileRouter}