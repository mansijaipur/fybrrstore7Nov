const util = nacl.util;

function log() {
    const name = document.querySelector(".name").value;
    const password = document.querySelector(".password").value;

    const obj = { 'name': name, 'password': password };

    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/register',
        data: obj
    }).then((res) => {
        console.log(res);
        window.location = '../login';
    })
}

function login() {
    const name = document.querySelector(".name").value;
    const password = document.querySelector(".password").value;

    const obj = { 'name': name, 'password': password };

    axios({
        method: 'post',
        url: location.protocol + '//' + location.host + '/api/user/login',
        data: obj
    }).then((res) => {
        console.log(res.data);


        window.location = '../' + name;

    })
}