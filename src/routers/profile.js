const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt')
const { validatePassword } = require('../utils/ValidateAPI')

profileRouter.get('/getProfile', (req, res) => {
    const userDetails = req.user;
    res.status(201).json({ status: "success", data: { userDetails } })

})

profileRouter.patch('/updateProfile', async (req, res) => {
    try {
        const editUserDetails = req.body
        const userDetails = req.user;

        const allowedFields = ['firstName', 'lastName', 'age', 'address', 'city', 'about', 'skills', 'phoneNumber'];

        // Ensure the provided fields are part of the allowed schema fields
        const invalidFields = Object.keys(editUserDetails).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
        }
        // Update user details
        // userDetails.firstName = editUserDetails.firstName;
        // userDetails.lastName = editUserDetails.lastName;
        // userDetails.phoneNumber = editUserDetails.phoneNumber;
        // userDetails.city = editUserDetails.city;
        // userDetails.age = editUserDetails.age;
        // userDetails.gender = editUserDetails.gender;
        // userDetails.about = editUserDetails.about;
        // userDetails.skills = editUserDetails.skills;


        // Iterate over the keys of editUserDetails and update userDetails if the field exists
        // Object.keys(editUserDetails).forEach((key)=>{
        //     if(editUserDetails[key]!=null || editUserDetails[key]!=undefined){
        //         userDetails[key]=editUserDetails[key]
        //     }
        //  })
        //Direct Assignment can overwrite fields with undefined if they are not provided.
        //Looping over the payload ensures only fields that are present get updated, preserving all other fields.
        //so
        // Loop through the keys of editUserDetails and update userDetails only if the field exists in the request
        if (!editUserDetails || Object.keys(editUserDetails).length === 0) {
            throw new Error("No data provided in the request body.");
        }
        Object.entries(editUserDetails).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                userDetails[key] = value;
            }
        });
        await userDetails.save();
        res.status(201).json({ status: "success", message: "User Profile updated successfuly", data: { userDetails } })
    } catch (err) {
        res.status(400).json({ status: "Error", message: err.message, data: { type: err.name || 'Unknown Error' } })
    }

})

profileRouter.patch('/updatePassword', async (req, res) => {
    try {
        const userDetails = req.user
        const updatePassword = req.body

        const allowedFields = ['existingPassword', 'newPassword']
        const invaildFields = Object.keys(updatePassword).filter(filed => !allowedFields.includes(filed))
        if (invaildFields.length > 0) {
            return res.status(400).json({ status: "Error", message: `Invalid fields: ${invalidFields.join(', ')}`, data: { type: "ValidationError" } });
        }
        const { existingPassword, newPassword } = updatePassword
        if (!existingPassword && !newPassword) {
            return res.status(400).json({ status: "Error", message: "Both existing and new passwords are required.", data: { type: "ValidationError" } });
        }
        if (existingPassword === newPassword) {
            return res.status(400).json({ status: "Error", message: "Existing password and new password cannot be the same.", data: { type: "ValidationError" } });
        }
        const existingDbValidPassword = await userDetails.validatePassword(existingPassword);
        if (!existingDbValidPassword) {
            return res.status(401).json({ status: 'Eroor', message: 'entered curent password is incorrect', data: { type: 'AuthenticationError' } })
        }
        const isvaildpassword = validatePassword(newPassword);
        if (isvaildpassword) {
            userDetails.password = await bcrypt.hash(newPassword, 10);
            await userDetails.save();
            res.status(201).json({ status: "success", message: "password updated successfuly" })
        }
        else {
            res.status(400).json({ status: "Error", message: "Password must be strong (at least 8 characters, including letters, numbers, and special characters)." })
        }
    } catch (err) {
        res.status(500).json({ status: "Error", message: err.message, data: { type: err.name || "InternalError" } })
    }
})
module.exports = { profileRouter }