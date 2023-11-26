const folderuuid = window.location.pathname.substring(8);
document.querySelector('.addfile').dataset.folderbtn = folderuuid;
const queue = new Queue();
let folderobj;

window.onload = function() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/data',
    }).then((res) => {
        console.log(res.data);
        // document.querySelector('.folder-name').innerHTML = folderuuid;
        files = res.data.files;
        // sort in descending order of last modified
        files.sort((a, b) => {
            return b.lastModified - a.lastModified;
        });
        files.forEach(file => {
            queue.enqueue(file);
        });


        while(queue.size() != 0){
            const obj = queue.peek();
            if(obj.type === 'folder'){
                if(obj.Fuuid === folderuuid){
                    folderobj = obj;
                    queue.clear();
                    break;
                }
                obj.Ffiles.forEach(ele => {
                    queue.enqueue(ele);
                });
            }
            queue.dequeue(queue.peek());
        }
        document.querySelector('.folder-name').innerHTML = folderobj.Fname;

        folderobj.Ffiles.forEach(file => {

            if (!file.Fname) {
                const template = document.querySelector('template[data-template="filelist"]');
                const clone = template.content.cloneNode(true);
                clone.querySelector('.file-name').innerHTML = file.name;
                clone.querySelector('.file-size').innerHTML = convertToReadable(file.size);
                clone.querySelector('#filelink').href = `https://dweb.link/ipfs/${file.cid}`;
                clone.querySelector('#downloadFile').addEventListener('click', () => {
                    forceDown(`https://dweb.link/ipfs/${file.cid}`, file.name);
                });
                document.querySelector('#aList').appendChild(clone);
            } else {
                const template = document.querySelector('template[data-template="folderlist"]');
                const clone = template.content.cloneNode(true);
                clone.querySelector('.fold-name').innerHTML = file.Fname;
                clone.querySelector('.fold-link').dataset.folder = file.Fuuid;
                // clone.querySelector('fold-size').innerHTML = 0;
                document.querySelector('#aList').appendChild(clone);
            }
        });



        const fold = document.querySelectorAll('.fold-link');
        fold.forEach(eachfolder => {
            eachfolder.addEventListener('click', (arrow) => {
                const uuid = eachfolder.dataset.folder;
                console.log('folder ' + uuid);
                
                // api to open folder
                window.location = location.protocol + '//' + location.host + '/folder/' + uuid;
                // axios({
                //     method: 'get',
                //     // params: { 'name': name },
                //     url: location.protocol + '//' + location.host + '/folder' + name,
                // }).then((res) => {
                //     console.log('Folder opened');
                // })
            })
        });

        const addbtn = document.querySelector('.addfile');
        addbtn.addEventListener('click', (add) => {
            const uuid = addbtn.dataset.folderbtn;
            console.log('folder ' + uuid);
            console.log(folderobj);


            // api to open folder
            // window.location = location.protocol + '//' + location.host + '/folder/' + name;
            // axios({
            //     method: 'get',
            //     // params: { 'name': name },
            //     url: location.protocol + '//' + location.host + '/folder' + name,
            // }).then((res) => {
            //     console.log('Folder opened');
            // })
        })

    })
}

async function upload() {
    document.querySelector('.spinner').style.display = 'inline-block';
    let fileObject = await fstore.sendFilesToWeb3Storage(); // fileObject = {cid: "", name: ""...}
    const uuid = folderobj.Fuuid;

    console.log(fileObject);
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/addtoFolder',
        data: { file: fileObject, uuid: uuid }
    }).then((res) => {
        console.log(res);
        console.log("uploaded successfully");
        document.querySelector('.spinner').style.display = 'none';
        // close modal
        document.querySelector('.btn-close').click();
        // reload page
        // window.location.reload();
    });
}