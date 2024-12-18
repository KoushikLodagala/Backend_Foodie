const express = require("express")
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const vendorRoutes = require('./routes/vendorRoutes')
const bodyParser = require("body-parser")
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')
const path = require('path')

const app = express()
const port = 4200

dotEnv.config()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>
    console.log("Connected to MongoDB"))
.catch((error)=>console.log(error))


app.use(bodyParser.json())
app.use('/vendor',vendorRoutes)
app.use('/firm', firmRoutes)
app.use('/product', productRoutes)
app.use('/uploads', express.static('uploads'))

 
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


app.use('/home',(req,res)=>{
    res.send("<h1> welcome to TOMATO")
})