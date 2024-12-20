
const Firm = require('../models/Firm')
const Vendor  =  require('../models/Vendor')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the destination folder where the images will be stored
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Specify the filename of the uploaded image
        cb(null, Date.now() + path.extname( file.originalname));
    }
});
const upload = multer({ storage: storage })

const  addFirm = async (req,res)=>{
   try {
    
    const {firmname, area, category, region, offer} = req.body

    const image = req.file? req.file.filename: undefined

    const vendor = await Vendor.findById(req.vendorId)

        if(!vendor){
             res.status(404).json({message: "Vendor not found"})
        }
    const firm  = new Firm({
         firmname,
         area, 
         category,
         region,
         offer,
         image,
         vendor: vendor._id
    })
            
   const savedFirm =  await firm.save()

   const firmId = savedFirm._id

   vendor.firm.push(savedFirm)
   await vendor.save()

    return res.status(201).json({message: "Firm added successfully", firmId})
   } catch (error) {
        console.error(error)
        res.status(500).json("Internal server error")
   }

}

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId
        const deletedProduct = await Firm .findByIdAndDelete(firmId)

        if(!deletedProduct){ 
             return res.status(404).json({error:"No Product Found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = {addFirm:[upload.single('image'), addFirm], deleteFirmById}