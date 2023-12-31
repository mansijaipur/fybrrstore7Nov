window.onload = function() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/data',
    }).then((res) => {
        console.log(res.data);
        document.querySelector('.name-header').innerHTML = res.data.name + "'s fybrrStore";
        files = res.data.files;
        // sort in descending order of last modified
        files.sort((a, b) => {
            return b.lastModified - a.lastModified;
        });
        files.forEach(file => {

            if (!file.Fname) {
                const template = document.querySelector('template[data-template="filelist"]');
                const clone = template.content.cloneNode(true);
                clone.querySelector('.file-name').innerHTML = file.name;
                clone.querySelector('.file-size').innerHTML = convertToReadable(file.size);
                clone.querySelector('#filelink').href = `https://ipfs.io/ipfs/${file.cid}`;
                clone.querySelector('#downloadFile').addEventListener('click', () => {
                    forceDown(`https://ipfs.io/ipfs/${file.cid}`, file.name);
                });
                // clone.querySelector('#deleteFile').addEventListener('click', () => {
                //     deletefile(file.cid);
                // })
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
    })
}

function forceDown(url, filename) {
    fetch(url).then(function(t) {
        return t.blob().then((b) => {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(b);
            a.setAttribute("download", filename);
            a.click();
        });
    });
}

// function deletefile(filecid) {
//     axios({
//         method: 'post',
//         url: location.protocol + '//' + location.host + '/api/user/deletefile/' + filecid
//     }).then(() => {
//         console.log("file deleted");
//     })
// }

function convertToReadable(size) {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(0) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
        return (size / (1024 * 1024)).toFixed(0) + ' MB';
    } else {
        return (size / (1024 * 1024 * 1024)).toFixed(0) + ' GB';
    }
}

async function upload() {
    document.querySelector('.spinner').style.display = 'inline-block';
    let fileObject = await fstore.sendFilesToWeb3Storage(); // fileObject = {cid: "", name: ""...}


    console.log(fileObject);
    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/newfile',
        data: { file: fileObject }
    }).then((res) => {
        console.log(res);
        document.querySelector('.spinner').style.display = 'none';
        // close modal
        document.querySelector('.btn-close').click();
        // reload page
        window.location.reload();
    });
}

function createFolder() {
    console.log("Creating folder")
    const folderName = document.querySelector('.folder-name').value;

    if (!folderName.trim()) {
        // If folderName is empty or contains only whitespace
        alert('Folder name cannot be empty. Please enter a valid folder name.');
    } else {
        // Folder name is not empty, you can proceed with your logic here
        // For example, you might want to perform some actions with the non-empty folderName
        console.log('Folder name:', folderName);
    }

    // create uuid for folder
    if (!folderName.trim()) {
        // If folderName is empty or contains only whitespace
        alert('Folder name cannot be empty. Please enter a valid folder name.');
    } else {
        // Folder name is not empty, you can proceed with your logic here
        // For example, you might want to perform some actions with the non-empty folderName
        console.log('Folder name:', folderName);
    }

    const uuid = uuidv4();
    console.log(uuid, folderName);

    axios({
        method: "post",
        url: location.protocol + '//' + location.host + '/api/user/newfolder',
        data: { folderName, uuid, type: "root" }
    }).then(() => {
        document.querySelector('.btn-close').click();
        // reload page
        window.location.reload();
    })
}

// function openFolder() {
//     const template = document.querySelector('template[data-template="folderlist"]');
//     const clone = template.content.cloneNode(true);
//     // const datafolder = clone.querySelector('.fold-link');
//     // console.log(datafolder.dataset);

// }