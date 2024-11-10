const mongoose=require('mongoose')
const URI="mongodb://127.0.0.1:27017/plants"
const dbConnection=async()=>{
    try{
        await mongoose.connect(URI)
        console.log("Database connection successful")
    }
    catch(err){
        console.log(err)
    }
}

module.exports=dbConnection;