import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try{
        if(!process.env.DB_CONNECTION){
            console.log(`DB URL is not configurated.`)
            process.exit(1);
        }
        console.log('Connecting ...');
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log(`DB connected.`)
    }
    catch(error){
        console.log(`DB connection failed.`, error);
        process.exit(1);
    }
};

export default connectToDatabase;