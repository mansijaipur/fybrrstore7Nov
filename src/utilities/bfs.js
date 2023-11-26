const { Queue } = require('@datastructures-js/queue');
const queue = new Queue();
let folderobj;
const addFile = (uuid, files, newFile) => {
    files.forEach(file => {
        queue.enqueue(file);
    });
    while(!queue.isEmpty()){
        let obj = queue.front();
        if(obj.type === 'folder'){
            if(obj.Fuuid === uuid){
                // obj.Fname += " Changed";
                obj.Ffiles.push(newFile);
                folderobj = obj;
                queue.clear();
                // break;
                return files;
            }
            obj.Ffiles.forEach(ele => {
                queue.enqueue(ele);
            });
        }
        queue.dequeue(queue.front());
    }

}
const addFolder = (name, uuid, files, rootF) => {
    files.forEach(file => {
        queue.enqueue(file);
    });
    while(!queue.isEmpty()){
        let obj = queue.front();
        if(obj.type === 'folder'){
            if(obj.Fuuid === rootF){
                // obj.Fname += " Changed";
                const newobj = {
                    Fname : name,
                    Fuuid : uuid,
                    Ffiles : [],
                    type : "folder"
                }
                obj.Ffiles.push(newobj);
                // folderobj = obj;
                queue.clear();
                // break;
                return files;
            }
            obj.Ffiles.forEach(ele => {
                queue.enqueue(ele);
            });
        }
        queue.dequeue(queue.front());
    }

}

module.exports = {addFile, addFolder}