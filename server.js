const express= require('express');
const mongoose= require('mongoose');
const Notes = require('./model/Notes'); //modal
const User= require('./model/Users');
const authenticate= require('./middleware/auth');
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');

//defining port variable
const PORT = process.env.PORT || 6666;
 

const app= express();

app.use(express.json());
app.use(cookieParser());


async function connectToDb() {
    mongoose.connect("mongodb://localhost:27017/notes-db").then(r=>{
        console.log("connect to mongosdb--")
    }).catch(err=>{
        console.log(err, "---------------")
    })
}

connectToDb();

app.post('/add-notes', authenticate, async function(req, res, next) {
    const userData= req.user;
    const title= req.body.title;
    const subTitle= req.body.subTitle;


    const notesData= await Notes.create({
        title: title,
        subTitle: subTitle
    })

    await User.updateOne({_id: userData._id}, {$push: {notes: notesData._id}})

    res.send("notes added")
    // console.log(notesData)

})

app.get('/get-notes', authenticate, async function(req, res, next) {
    const userData= req.user;

    const notesIds= userData.notes;

    const user= await User.findById(userData._id).populate('notes').exec();
    res.send(user)
})

app.delete('/delete-note', authenticate, async function(req, res) {
    const userData= req.user;
    const noteId= req.body.noteId;

    await User.updateOne(
        {
            _id: userData._id
        }, 
        {
            $pull: {notes: noteId}
        }
    );

    await Notes.findOneAndDelete({_id: noteId});

    res.send("note deleted")

})

app.put("/update-note", authenticate, async function(req, res, next) {
    const userData= req.user;
    const noteId= req.body.noteId;
    const title= req.body.title;
    const subTitle= req.body.subTitle;

    await Notes.findOneAndUpdate({_id: noteId}, {$set: {title: title, subTitle: subTitle}});

    res.send("note updated")

})


app.post('/signup', async function(req, res, next) {
    const username= req.body.username;
    const password= req.body.password;
    
    await User.create({
        username: username,
        password: password
    });

    res.send("user created")
});

app.post('/login', async function(req, res, next) {
    const username= req.body.username;
    const password= req.body.password;

    const userData= await User.findOne({username: username});

    if(userData.password != password) {
        return res.send("Something went wrong")
    }

    const token= jwt.sign({_id: userData._id}, "secret");

    res.cookie('token', token);
    res.send("user logged in")
})

//routes definitions


app.listen(PORT, ()=> console.log(`running on port ${PORT}`))