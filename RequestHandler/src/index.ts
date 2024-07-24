import express from "express"
import {S3}  from "aws-sdk"


const s3 = new S3({
    accessKeyId:"5a6d5a540d21e299fb29b091db9096bd",
    secretAccessKey:"94f8472598a812027bb466ead57869235b053a88cb6af6684497fb9a85748bf8",
    endpoint:"https://72a32b5f2dc754984ef90cd5a9052ddb.r2.cloudflarestorage.com"
})

const app = express();

app.use('/*',async (req,res)=>{
    const host = req.hostname;
    const id = host.split(".")[0];
    //@ts-ignore
    const filePath = req.params[0] || '/';

    console.log( `dist/${id}${filePath}`);
    const contents = await s3.getObject({
        Bucket: "vercelbucket",
        Key: `dist/${id}/${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})
app.listen(3001);