const mongoose= require('mongoose');

const UserSchema= new mongoose.Schema({
    username: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
        // required: true,c
    },
    notes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Notes' 
    }],

    // notes: [
    //     {title: String, subTitle: String}
    // ]
});

const User= mongoose.model('User', UserSchema);

module.exports= User;
