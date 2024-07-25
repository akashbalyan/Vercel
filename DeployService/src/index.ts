import {createClient, commandOptions} from "redis";
import { downloadS3Folder } from "./aws";
import { buildProject } from "./build";
import {copyFinalDist} from "./files"

const subscriber = createClient();
const publisher = createClient()
publisher.connect();
subscriber.connect(); 

async function main(){
    while(1){
        const response = await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        )
        //@ts-ignore
        const id = response.element;
        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        await copyFinalDist(id);
       
        publisher.hSet("status", id, "deployed")

        
    }
}

main();