const User = require('../db/user');
const auth = (req, res, next) => {
    let token = req.cookies.authToken;
    console.log(token);

    User.findByToken(token, (err, user) => {
        console.log(user);
        if (err) throw err;
        if (user) {
            req.token = token
            req.user = user;
            req.isAuth = true;
            next();

        } else {
            req.isAuth = false;
            next();
        }

    });
}

module.exports = { auth }