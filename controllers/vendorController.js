const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv')

dotEnv.config()

const secretKey = process.env.whatIsYourName

const vendorRegistor = async(req,res)=>{
        const {username,email,password} = req.body

        try {
            
            const vendorEmail = await Vendor.findOne({email})
            if(vendorEmail){
                return res.status(400).json("Email is already in use")
            }
            const hashedPassword = await bcrypt.hash(password,10)

            const newVendor = new Vendor({
                username,
                email,
                password:hashedPassword
            })

            await newVendor.save()
            res.status(201).json({message: "Vendor registerd succefully"})
            console.log("registrrd")
        } catch (error) {
            console.error(error)
            res.status(500).json({error: "Internal server Error"})
           
        }
}

//vendor Login
const vendorLogin = async (req,res)=>{
    const {email,password} = req.body
    try {
        const vendor  = await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(400).json({error:"Invalid email or password"})
        }

            const token = jwt.sign({vendorId: vendor._id}, secretKey, {expiresIn: "1h"})

                const vendorId = vendor._id;

        res.status(200).json({success:"Login Successfull" , token, vendorId})
        console.log(`You have logged with the ${email} and the token is ${token}`)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
    }
}

const getAllVendors = async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Internal server error"})

    }
}

const getVendorById = async (req,res)=>{
     const vendorId = req.params.id;

     try {
        const vendor = await Vendor.findById(vendorId).populate('firm')
        if(!vendor){
            return res.status(404).json({error: "Vendor not found"})
        }
        const vendorFirmId = vendor.firm[0]._id

        res.status(200).json({vendorId, vendorFirmId})
        console.log( vendorFirmId)
     } catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal server error"})
     }
}
module.exports = {vendorRegistor , vendorLogin, getAllVendors, getVendorById}