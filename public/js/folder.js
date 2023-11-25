const foldername = window.location.pathname.substring(8);
document.querySelector('.addfile').dataset.folderbtn = foldername;

window.onload = function() {
    axios({
        method: 'get',
        url: location.protocol + '//' + location.host + '/api/user/data',
    }).then((res) => {
        console.log(res.data);
        document.querySelector('.folder-name').innerHTML = foldername;
        files = res.data.files;
        // sort in descending order of last modified
        files.sort((a, b) => {
            return b.lastModified - a.lastModified;
        });
        files.forEach(file => {

            if (file.Fname === foldername) {
                const fileArr = file.Ffiles;
                console.log("came to folder subtree" + fileArr)
                fileArr.forEach(file => {
                    const template = document.querySelector('template[data-template="filelist"]');
                    const clone = template.content.cloneNode(true);
                    clone.querySelector('.file-name').innerHTML = file.name;
                    clone.querySelector('.file-size').innerHTML = convertToReadable(file.size);
                    clone.querySelector('#filelink').href = `https://dweb.link/ipfs/${file.cid}`;
                    clone.querySelector('#downloadFile').addEventListener('click', () => {
                        forceDown(`https://dweb.link/ipfs/${file.cid}`, file.name);
                    });
                    document.querySelector('#aList').appendChild(clone);
                })
            }
        });
        const addbtn = document.querySelector('.addfile');
        addbtn.addEventListener('click', (add) => {
            const name = addbtn.dataset.folderbtn;
            console.log(addbtn.dataset.folderbtn);
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