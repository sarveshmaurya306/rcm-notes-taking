const jwt= require('jsonwebtoken');
const User= require('../model/Users')

async function authenticate(req, res, next) {
    const token= req.cookies['token'] //todo: use cookie
    if(!token) {
        return res.send({
            message: "user not authenticated"
        })
    }

    const decodedData= jwt.verify(token, "secret");
    const id= decodedData._id;

    const userData= await User.findById(id);

    if(!userData) {
        return res.send({message: "user doesn't exist"})
    }

    req.user= userData; // _id: -> user
    
    next();
}

module.exports = authenticate;