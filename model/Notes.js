const mongoose= require('mongoose');

const NotesSchema= new mongoose.Schema({
    title:{
        type: String,
        // required: true
    },
    subTitle: {
        type: String,
        // required: true
    }
});

const Notes= mongoose.model('Notes', NotesSchema);

module.exports= Notes;
