import mongoose from 'mongoose';

const connectToDb = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Datbase connect successfully");
    }catch(error){
        console.log("Data base error",error)
    }
}

export default connectToDb;