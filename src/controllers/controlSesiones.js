const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const { promisify } = require("util");
const express = require('express');
const path = require("path");
const { userInfo } = require("os");

const controller = {};

controller.controlarSesion = async (req, res)=>{
    console.log(req.body);
    console.log(req.session.usuarioNickname);

    let data = req.body;
    
    //8 saltos de iteraccion
    let passHash = await bcryptjs.hash(data.password, 8);
    console.log(passHash);

    req.getConnection((err, conn) =>{
        conn.query("SELECT * FROM usuario WHERE nickname = ? AND password = ?", [data.nickname, data.password], (err, usuario) => {
            if(err){
                res.json(err);
                //Recomendable manejar errores con next()
            }
                        
            console.log("----------------------------");
            console.log(usuario);
            console.log("----------------------------");
            //console.log(usuario[0].nickname);
            if(JSON.stringify(usuario)!='[]'){
                console.log("Tiene datos");
                req.session.usuarioNickname = usuario[0].nickname;
                console.log("Sesion: "+ req.session.usuarioNickname);
                res.send("Usuario y contraseña OK");
            }else{
                console.log("No tiene datos");
                res.send("");
            }
      
        });
    
    });
    
}; 


controller.list = (req, res)=>{
    req.getConnection((err, conn) =>{
        conn.query("SELECT * FROM customer", (err, customers) => {
            if(err){
                res.json(err);
                //Recomendable manejar errores con next()
            }
                        
            console.log("----------------------------");
            console.log(typeof(customers));
            
            res.render("customers", {
                data: customers
            });
            
            //res.render("customers", {customers});
        });
    });
};

controller.save = (req, res) =>{
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query("INSERT INTO customer SET ?", [data], (err, customer) => {
            console.log(customer);
            res.redirect("/");
            //res.send("works");
        });
    });
    
    //res.send("works");
};

controller.edit = (req, res) =>{
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM customer WHERE id = ?", [id], (err, customer) => {
            console.log(customer);
            res.render('customer_edit',{
                data: customer[0]
            });
            //res.send("works");
        });
    });
    
    //res.send("works");
};

controller.update = (req, res) =>{
    const { id } = req.params;
    const newCustomer = req.body;
    req.getConnection((err, conn) => {
        conn.query("UPDATE customer SET ? WHERE id = ?", [newCustomer, id], (err, rows) => {
            res.redirect('/');
        })
    })

    req.getConnection((err, conn) => {
        conn.query("SELECT * FROM customer WHERE id = ?", [id], (err, customer) => {
            console.log(customer);
            res.render('customer_edit',{
                data: customer[0]
            });
            //res.send("works");
        });
    });
    
    //res.send("works");
};

controller.delete = (req, res) =>{
    //Para recibir parametros de la url
    // const id = req.params.id;
    //Significa lo mismo que el de arriba
    const { id } = req.params;

    req.getConnection((err, conn) => {
        conn.query("DELETE FROM customer WHERE id = ?", [id], (err, rows) => {
            res.redirect("/");
            //res.send("works");
        });
    });
    
    //res.send("works");
};


module.exports = controller;