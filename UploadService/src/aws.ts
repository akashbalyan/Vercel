import {S3}  from "aws-sdk"
import fs from "fs"
import { config } from './config';

const s3 = new S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  endpoint: config.aws.endpoint,
});

export const uploadFile = async (filename : string, localfilePath :string) => {

    const fileContent = await fs.readFileSync(localfilePath);
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercelbucket",
        Key:filename
    }).promise();
    //console.log(response)
}