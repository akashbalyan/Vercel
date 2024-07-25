import express from "express"
import {S3}  from "aws-sdk"
import { config } from './config';

const s3 = new S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.endpoint,
});

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


    //TODO - static content
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})
app.listen(3001);