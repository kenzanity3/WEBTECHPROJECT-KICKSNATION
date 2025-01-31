import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const adminFilePath = path.join(__dirname, 'admin.json'); // Path to the Merchant JSON file
const userFilePath = path.join(__dirname, 'user.json'); // Path to the User JSON file
const itemFilePath = path.join(__dirname, 'itemdescription.json'); // Path to the items JSON file



async function readData(filePath){

    try{
        const data = await fs.promises.readFile(filePath,'utf8');
        return JSON.parse(data);
    }
    catch(error){
        if(error.code == 'ENOENT') return [];
        throw error;
    }
};

async function writeData(filePath, data){
    await fs.promises.writeFile(filePath,JSON.stringify(data, null ,2));
};

export async function getUsers(){
    return await readData(userFilePath);
};
export async function writeUsers(data){
    await writeData(userFilePath,data);
};

export async function getAdmins(){
    return await readData(adminFilePath);
};
export async function writeAdmins(data){
    await writeData(adminFilePath,data);
};

export async function getItems(){
    return await readData(itemFilePath);
};
export async function writeItems(data){
    await writeData(itemFilePath,data)
};



 




