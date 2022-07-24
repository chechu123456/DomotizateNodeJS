const express = require('express');
const router = express.Router();
var app = express();
const path = require("path");

const controlSesiones = require("../controllers/controlSesiones");

app.set("views", path.join(__dirname, '../views'));

app.get("/",function(req, res){
    res.render("index");
});

app.get("/contacto",function(req, res){
    res.render("landingPage/contacto");
});

app.get("/nosotros",function(req, res){
    res.render("landingPage/nosotros");
});

app.get("/login",function(req, res){
    res.render("landingPage/login");
});

app.get("/cookies",function(req, res){
    res.render("landingPage/cookies");
});

app.get("/privacidad",function(req, res){
    res.render("landingPage/privacidad");
});


app.get("/termsCond",function(req, res){
    res.render("landingPage/termsCond");
});

app.post("/procesoLogin", controlSesiones.controlarSesion);





/*
router.get("/",function(req, res){
    res.render("index");
});

router.get("/contacto",function(req, res){
    res.render("landingPage/contacto");
});

router.get("/nosotros",function(req, res){
    res.render("landingPage/nosotros");
});

router.get("/login",function(req, res){
    res.render("landingPage/login");
});

router.get("/cookies",function(req, res){
    res.render("landingPage/cookies");
});

router.get("/privacidad",function(req, res){
    res.render("landingPage/privacidad");
});


router.get("/termsCond",function(req, res){
    res.render("landingPage/termsCond");
});


router.get("/admin",function(req, res){
    res.render("index");
});
*/


//module.exports = router;
module.exports = app;