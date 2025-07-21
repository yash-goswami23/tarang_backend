import dotenv from "dotenv";
import { app } from "./app.js";
import connetDB from "./db/index.js";


dotenv.config({
    path: './.env'
});

connetDB().then(()=>{
    app.on('error',(error)=>{console.log(`ERROR: ${error}`);
    throw error;
    });
    app.listen(process.env.PORT || 8000, ()=>{
    console.info(`Server is running at port ${process.env.PORT}`);
});
}).catch((e)=>{
    console.error("Mongo db connection failed !!! ", e);
});