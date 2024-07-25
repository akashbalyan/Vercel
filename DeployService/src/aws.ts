import {S3}  from "aws-sdk"
import fs from "fs"
import path from "path"
import { config } from './config';

const s3 = new S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.endpoint,
});


export const downloadS3Folder = async (prefix : string) =>{

    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket:'vercelbucket',
        Prefix: prefix
    }).promise();
    //console.log(allFiles);

   
    const allPromises = allFiles.Contents?.map( ({Key})=>{
        return new Promise( (resolve)=>{
            if(!Key){
                resolve("")
                return;
            }
            const fileFullPath = path.join(__dirname,Key);
            const dirName = path.dirname(fileFullPath);
            //console.log("FileFullPath : " ,fileFullPath);
            //console.log("dirName : " ,dirName);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName,{recursive:true})
            }
            const outputFile = fs.createWriteStream(fileFullPath);
            s3.getObject({
                Bucket:"vercelbucket",
                Key:Key
            }).createReadStream().pipe(outputFile).on("finish", ()=> {
                resolve("");
            })

        })
    }) || []

    await Promise.all(allPromises);
    
}


export const uploadFile = async (filename : string, localfilePath :string) => {

    const fileContent = await fs.readFileSync(localfilePath);
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercelbucket",
        Key:filename
    }).promise();
    console.log(response)
}