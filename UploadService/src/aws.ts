import {S3}  from "aws-sdk"
import fs from "fs"


//id - 5a6d5a540d21e299fb29b091db9096bd
// secret - 94f8472598a812027bb466ead57869235b053a88cb6af6684497fb9a85748bf8
//endpoint - https://72a32b5f2dc754984ef90cd5a9052ddb.r2.cloudflarestorage.com

const s3 = new S3({
    accessKeyId:"5a6d5a540d21e299fb29b091db9096bd",
    secretAccessKey:"94f8472598a812027bb466ead57869235b053a88cb6af6684497fb9a85748bf8",
    endpoint:"https://72a32b5f2dc754984ef90cd5a9052ddb.r2.cloudflarestorage.com"
})

export const uploadFile = async (filename : string, localfilePath :string) => {

    const fileContent = await fs.readFileSync(localfilePath);
    const response = await s3.upload({
        Body:fileContent,
        Bucket:"vercelbucket",
        Key:filename
    }).promise();
    //console.log(response)
}