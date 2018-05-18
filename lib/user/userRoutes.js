
const usrRoutr = require("express").Router();
// const express = require("express");
// const app = express();
console.log('this is my active')
const resHndlr = require("../global/Responder");


//const middleware = require("../middleware");
const userServices = require("./userServices");
//const constants = require("../constants");
const userConstants = require("./userConstant");

console.log('this is my beautiful way' )
usrRoutr.route("/registration")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
        userServices.registration(req, res);
    });
    usrRoutr.route("/verifyOtp")
    .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
         // if(req.user._id == req.body.user_id)
        userServices.verifyOtp(req, res);
        console.log('there are te')
         // else
    //     resHndlr.apiResponder(req, res, "Unathorized access", 403)
    });
    usrRoutr.route("/login")
        .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
            userServices.login(req, res);
        });
        usrRoutr.route("/forgotPassword")
        .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
            userServices.forgotPassword(req, res);
        });
        usrRoutr.route("/getAllInfoById")
        .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
            userServices.getAllInfoById(req, res);
        });

        usrRoutr.route("/resetPassword")
        .post([ /*middleware.authenticate.autntctTkn*/ ], function(req, res) {
            userServices.resetPassword(req, res);
        });
console.log('all is well');
  module.exports = usrRoutr;
