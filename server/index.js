const express=require('express');
const app = express();
const database = require("./config/databaseConfig");
const dotenv = require("dotenv");
const userRoutes=require("./routes/UserRoutes");
const folderRoutes=require("./routes/FolderRoutes");
const fileRoutes=require("./routes/FileRoutes");

dotenv.config()

const PORT=process.env.PORT || 5000;

database.connect();

app.use(express.json());

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/folder",folderRoutes);
app.use("/api/v1/file",fileRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})