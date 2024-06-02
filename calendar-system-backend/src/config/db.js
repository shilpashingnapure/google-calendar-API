import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connect('mongodb+srv://shingnapureshilpa2:Gold_123@cluster0.zeevvvd.mongodb.net/db')

    }catch (err){
        console.log(err);
    }
}
