import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/db')
    }catch (err){
        console.log(err);
    }
}
