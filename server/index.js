const express=require('express');
const app = express();
const database = require("./config/database");
const dotenv = require("dotenv");
dotenv.config()

const PORT=5000;

database.connect();

app.use(express.json());


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})