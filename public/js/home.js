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
            const template = document.querySelector('template[data-template="filelist"]');
            const clone = template.content.cloneNode(true);
            clone.querySelector('.file-name').innerHTML = file.name;
            clone.querySelector('.file-size').innerHTML = convertToReadable(file.size);
            clone.querySelector('#filelink').href = `https://ipfs.io/ipfs/${file.cid}`;
            clone.querySelector('#downloadFile').addEventListener('click', () => {
                forceDown(`https://ipfs.io/ipfs/${file.cid}`, file.name);
            });
            document.querySelector('#aList').appendChild(clone);
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
    let fileObject = await fstore.sendFilesToWeb3Storage();
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

}