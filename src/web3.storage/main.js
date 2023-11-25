import { Web3Storage, getFilesFromPath, File } from 'web3.storage';
import { SingleEntryPlugin } from 'webpack';

// import dotenv 
// import dotenv from 'dotenv';
// dotenv.config();

// import path from 'path';


function getAccessToken() {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU0NTI3OEI0REY2ZGFiMzgyNkMwODI4NEM5NDM1ZkVmNjFCYjY0ODAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODg4MTkxODg1NTgsIm5hbWUiOiJmeWJyclN0b3JlLWFkbWluIn0.uJXSWaKvZIyEsnwZ8-V-VABNghTRqCvZ_-9r8T2Um-I"
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() }) // makes a client instance of web3 storage using token
}


async function getFiles(path) {
    const fileInput = document.querySelector('input[type="file"]')
    if (!fileInput) {
        alert('Select a file to upload!');
    }
    console.log(fileInput.files);
    return fileInput.files
}

// function makeFileObjects () {
//   // You can create File objects from a Buffer of binary data
//   // see: https://nodejs.org/api/buffer.html
//   // Here we're just storing a JSON object, but you can store images,
//   // audio, or whatever you want!
//   const obj = { hello: 'world' }
//   const buffer = Buffer.from(JSON.stringify(obj))

//   const files = [
//     new File(['contents-of-file-1'], 'plain-utf8.txt'),
//     new File([buffer], 'hello.json')
//   ]
//   return files
// }
export async function sendFilesToWeb3Storage() {
    // const p = path.join(__dirname, 'view.pdf');
    const file = document.querySelector('#file').files[0].mozFullPath;
    const files = await getFiles(file);
    console.log(files);
    const cid = await storeFiles(files);
    // console.log(cid);
    let fileObject = {}
    fileObject.cid = cid + '/' + files[0].name;
    fileObject.name = files[0].name;
    fileObject.size = files[0].size;
    fileObject.type = files[0].type;
    fileObject.folder =
        fileObject.lastModified = files[0].lastModified;
    return fileObject;
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log('stored files with cid:', cid)
    return cid
}


async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = cid => {
        console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = size => {
        uploaded += size
        const pct = 100 * (uploaded / totalSize)
        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    // makeStorageClient returns an authorized web3.storage client instance
    const client = makeStorageClient()

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
}