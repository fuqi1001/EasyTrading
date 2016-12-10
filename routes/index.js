const apiRoutes = require("./api");
const apartmentRoutes = require("./apartments");
const itemRoutes = require("./items");
const data = require("../data");
const userData = data.users;

const express = require('express');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var isLogIn = function (req, res, next) {
    //console.log(req.session);
    if (req.isAuthenticated()) { //if user is authenticated in the session, carry on
        return next();
    }
    res.redirect('/login'); //if they aren't, redirect them to the login page
};

const constructorMethod = (app) => {


    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        //console.log(user.username + "  ====");
        userData.getUserById(id).then((myuser) => {
            done(null, myuser);
        }).catch((error) => {
            done(error);
        });
    });

    passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            userData.checkPassword(username, password).then((myuser) => {
                return done(null, myuser);
            }).catch((err) => {
                console.log("run in api:" + err);
                return done(null, false, {message: 'Invalid username or password.'});
            })
        }
    ));

    app.use("/api", apiRoutes);
    app.use("/items", itemRoutes);
    app.use("/apartments", apartmentRoutes);

    app.get("/", isLogIn, function (req, res, next) {
        //console.log("home page: ");

        if (req.isAuthenticated()) {
            res.render('home', {partial: "home-scripts"});
        } else {
            res.redirect('/login');
        }
    });

    app.get("/login", function (req, res) {
        res.render("login", {pageTitle: "Log in", partial: "login-scripts"});
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            //console.log(err);
            // console.log(user);
            //console.log(info);

            if (err) {
                return next(err)
            }
            if (!user) {
                // *** Display message without using flash option
                // re-render the login form with a message
                return res.json({
                    success: false,
                    message: "Wrong username or password"
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json({
                    success: true,
                    user: req.user,
                    pageurl: '/'
                })
            });
        })(req, res, next);
    });

    /*app.post("/login", passport.authenticate('local', {
     failureRedirect: '/login-fail', session: true
     }), function (req, res) {
     //console.log("run in this")
     res.json({
     success: true,
     pageurl: '/test2'
     });

     })*/

    app.get("/logout", function (req, res) {
        req.logout();
        return res.json({
            success: true,
            pageurl: '/'
        });
        //res.redirect('/');
    });

    app.get("/login-fail", function (req, res) {
        res.json({
            success: false,
            message: "Wrong username or password"
        })
    })

    app.get("/create-user", function (req, res) {
        res.render("create-user", {pageTitle: "Create new user", partial: "create-user-scripts"});
    })


    app.get("/test2", function (req, res) {
        res.json("login succ");
    })


    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;