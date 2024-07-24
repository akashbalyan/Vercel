import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import {generate} from './utils'
import {getAllFiles} from './files'
import {uploadFile} from './aws'
import path from "path"
import { createClient } from "redis";
const publisher = createClient();
const subscriber = createClient();
publisher.connect();
subscriber.connect();

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json())

app.post("/deploy",async (req,res)=>{
    const repoUrl = req.body.repoUrl;
    const id = generate();
    await simpleGit().clone(repoUrl,path.join(__dirname,`./output/${id}`));

    const files = getAllFiles(path.join(__dirname,`./output/${id}`));
    files.forEach(async (file)=>{
        await uploadFile(file.slice(__dirname.length+1),file);
    })

    publisher.lPush("build-queue", id);
    publisher.hSet("status",id, "uploaded");
    
    res.json({
        id:id
    });
})

app.get('/status',async (req,res)=>{
    const id = req.query.id;
    const response = await subscriber.hGet("status",id as string);
    res.json({
        status:response
    })
})

app.listen(port,()=>{
    console.log("Application Running on Port - 3000");
});