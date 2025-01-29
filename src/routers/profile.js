const express = require('express');
const { model } = require('mongoose');
const profileRouter= express.Router();

profileRouter.get('/get',(req,res)=>{
    const userDeatils=req.user;
    res.status(201).json({userDeatils:userDeatils})

})

profileRouter.post('/edit',async (req,res)=>{
    try{
        const editUserDetails =req.body
        const userDeatils=req.user;
        if(editUserDetails.emailId){
            throw new Error ('you cont edit/change emailid')
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
         Object.entries(editUserDetails).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                userDeatils[key] = value;
            }
        });
        await userDeatils.save();
        res.status(201).json({data})
    }catch(err){
        res.status(400).json({error: err.message})
    }
    
})

module.exports={profileRouter}