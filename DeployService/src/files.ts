import fs from "fs"
import path from "path"
import { uploadFile } from "./aws";

export const copyFinalDist =  async (id:string) =>{

    const folderPath = path.join(__dirname,`output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    const allUploadPromises = allFiles.map( (file)=>{
         
        return new Promise(async (resolve)=>{
            await uploadFile(`dist/${id}/`+ file.slice(folderPath.length+1),file);
            resolve("");
        })
    })
    await Promise.all(allUploadPromises);
}




export const getAllFiles = (folderPath :string)  => {

    let response: string[] = [];
    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file=>{
        const fullFilePath = path.join(folderPath,file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response = response.concat(getAllFiles(fullFilePath));
        }else{
            response.push(fullFilePath);
        }
        
    })
    return response;
};