const User = require('../models/User');

const loginSuccessService = (id) => new Promise(async (resolve, reject) => {
    try {
        let response = await User.findOne({ googleId: id });
        console.log(response);
        resolve(response);
    } catch (err) {
        reject({ msg: 'Fail at user service'});
    }
})

module.exports = {
    loginSuccessService
};