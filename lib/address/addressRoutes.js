const adrsRoute = require("express").Router();
const resHndlr = require("../global/Responder");
//const middleware = require("../middleware");
const constants = require("../constants");
//const jwtHandler = require("../jwtHandler");
const addressServices = require("../address/addressServices")



adrsRoute.route("/genAddress")
    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
          // let { address } = req;
        addressServices.genAddress(req,res)
    });


    adrsRoute.route("/changePassword")
        .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
              // let { address } = req;
            addressServices.changePassword(req,res)
        });
        adrsRoute.route("/genBalance")
            .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                  // let { address } = req;
                addressServices.genBalance(req,res)
            });
            adrsRoute.route("/getAllCurrency")
                .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                      // let { address } = req;
                    addressServices.getAllCurrency(req,res)
                });
                adrsRoute.route("/getBalancebyAddress")
                    .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                          // let { address } = req;
                        addressServices.getBalancebyAddress(req,res)
                    });

                    adrsRoute.route("/getBalance")
                        .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                              // let { address } = req;
                            addressServices.getBalance(req,res)
                    });

                    adrsRoute.route("/getTransactionsBit")
                        .post([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                              // let { address } = req;
                            addressServices.getTransactionsBit(req,res)
                    });
                    adrsRoute.route("/userCurrencyBalance")
                        .get([/*middleware.authenticate.autntctTkn*/], function (req, res) {
                              // let { address } = req;
                            addressServices.userCurrencyBalance(req,res)
                    });





module.exports = adrsRoute;
