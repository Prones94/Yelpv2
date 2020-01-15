const express = require('express'),
    app = express(),
    port = 3000,
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require("mongoose"),
    Campground = require("./models/campground")

mongoose.connect("mongodb://localhost:27017/yelp", {
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// Campground.create(
//     {
//         name: 'Granite Hill',
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//         description: 'This is a huge granite hill campground, with zero bathrooms but beautiful landscapes'
//     }, 
//     function(err,campground){
//         if(err){
//             console.log('Error!', err)
//         } else {
//             console.log('Campground Created!')
//             console.log(campground)
//         }
//     })

app.get('/', (req,res) => {
    res.render("home");
});
// INDEX ROUTE - show all campgrounds
app.get('/campgrounds', (req,res) => {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("index", {campgrounds: allCampgrounds})
        }
    });
    // res.render('campgrounds',{campgrounds:campgrounds});
});

// CREATE ROUTE - add new campground to DB
app.post('/campgrounds', (req,res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampGround = {name:name,image:image, description: desc};
    // Create a new campground and save to DB
    Campground.create(newCampGround, function(err, newlyCreated){
        if(err){
            console.log('Error!', err)
        } else {
            res.redirect('/campgrounds')
        }
    })
});

// NEW - show form to create new campground
app.get('/campgrounds/new', (req,res) => {
    res.render('new.ejs')
})
// SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req,res) => {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log('Error!', err)
        } else {
            res.render('show', {campground: foundCampground})
        }
    });
})


app.listen(port, () => {
    console.log(`YelpCamp V2 is now runnning on http://localhost:${port}/`)
})