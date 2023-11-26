const { Queue } = require('@datastructures-js/queue');
const queue = new Queue();
let folderobj;
const bfs = (uuid, files) => {
    files.forEach(file => {
        queue.enqueue(file);
    });
    while(!queue.isEmpty()){
        const obj = queue.front();
        if(obj.type === 'folder'){
            if(obj.Fuuid === uuid){
                folderobj = obj;
                queue.clear();
                return folderobj;
            }
            obj.Ffiles.forEach(ele => {
                queue.enqueue(ele);
            });
        }
        queue.dequeue(queue.front());
    }

}

module.exports = {bfs}