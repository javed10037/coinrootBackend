const bitcoin = require('bitcoin');
const client = new bitcoin.Client({
  host: '162.213.252.66',
 port: 18336,
 user: 'test',
 pass: 'test123'
});

var litecoin = require('litecoin');
var client1 = new litecoin.Client({
  host: '162.213.252.66',
 port: 18336,
 user: 'test',
 pass: 'test123'
});
var dogecoin = require('bitcoin');
var client2 = new bitcoin.Client({
  host: '162.213.252.66',
 port: 18336,
 user: 'test',
 pass: 'test123'
});
var Bitcoincash = require('bitcoin');
var client3 = new bitcoin.Client({
  host: '162.213.252.66',
 port: 18336,
 user: 'test',
 pass: 'test123'
});
const bcrypt = require('bcrypt');
const User = require('../user/user');
const Constants = require('./addressConstants');
const Currencies = require('../currency/currencies');
const globalFunction = require('../global/globalFunctions');
const resHndlr = require('../global/Responder');
const currencyData = require('./currencyData');
//****************************required functions************************


//*******************************API's********************************

function errorOnSever(req, res, err) {
    if (err.code && err.code == "ECONNREFUSED")
        return resHndlr.apiResponder(req, res, "Server Refuse to connect app, please try again in some time.", 500, err)
    else if (err.code && err.code == -5)
        return resHndlr.apiResponder(req, res, "Invalid address.", 500, err)
    else if (err.code && err.code == -6)
        return resHndlr.apiResponder(req, res, "Account has Insufficient funds.", 500, err)
    else if (err.code && err.code < 0)
        return resHndlr.apiResponder(req, res, "Problem in server in getting your balance, please try after some time.", 500, err)
    else
        return resHndlr.apiResponder(req, res, "Something went wrong, please try after some time.", 500, err)

}
module.exports = {
	'genAddress':(req,res)=>
	{
		let currencyValue = currencyData.currencyData[req.body.currency]
		console.log("currencyValue: ",currencyValue,req.body.user_id)
		 globalFunction.isUserExsist(req.body.user_id,function(err,response){
			if(err)
				return resHndlr.apiResponder(req,res,"Something went wrong",500,err)
			else
      console.log('there are the user are exist',response)
				globalFunction.isAddressExsist(response._id,currencyValue.currency,function(err,result){
					if(err)
						return resHndlr.apiResponder(req,res,err,500,err)
					else if(result)

						return resHndlr.apiResponder(req,res,"Address already exsist",500,result)
					else if(!err && !result)
					{
              console.log('if there address is exist then',result)
					var labelWithPrefix = 'LABELPREFIX' + req.body.user_id;
          if(req.body.currency === 'BTC'){
				      client.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
				      	if(err)
				      	{
				      		console.log("in get new address")
				      		return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
				      	}
				      	else
				      	{
				      		var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
				      		Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
				      		.then((success)=>{
				      			var found = success.currencies.find(function(element) {
									  return element.currency == currencyValue.currency;
									});
				      			return resHndlr.apiResponder(req,res,"Address generated successfully",200,found)
				      		})
				      		.catch((unsuccess)=>{
				      			return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
				      		})
				      	}
				      })
            }else if(req.body.currency === 'LTC'){
              client1.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
              if(err)
              {
                console.log("in get new address")
                return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
              }
              else
              {
                var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
                Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
                .then((success)=>{
                  var found = success.currencies.find(function(element) {
                  return element.currency == currencyValue.currency;
                });
                  return resHndlr.apiResponder(req,res,"LTC Address generated successfully",200,found)
                })
                .catch((unsuccess)=>{
                  return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
                })
              }
            })
          }else if(req.body.currency === 'DGC'){
            client1.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
            if(err)
            {
              console.log("in get new address")
              return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
            }
            else
            {
              var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
              Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
              .then((success)=>{
                var found = success.currencies.find(function(element) {
                return element.currency == currencyValue.currency;
              });
                return resHndlr.apiResponder(req,res,"DGC Address generated successfully",200,found)
              })
              .catch((unsuccess)=>{
                return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
              })
            }
          })
        }else if(req.body.currency === 'BCH'){
          client1.cmd('getnewaddress', labelWithPrefix, (err, address)=> {
          if(err)
          {
            console.log("in get new address")
            return resHndlr.apiResponder(req,res,"Something went wrong.",500,err)
          }
          else
          {
            var update = {'country':currencyValue.country,'address':address,'name':currencyValue.name,'currency':currencyValue.currency}
            Currencies.findOneAndUpdate({userId:req.body.user_id},{$push:{currencies:update}},{new:true})
            .then((success)=>{
              var found = success.currencies.find(function(element) {
              return element.currency == currencyValue.currency;
            });
              return resHndlr.apiResponder(req,res,"BCH Address generated successfully",200,found)
            })
            .catch((unsuccess)=>{
              return resHndlr.apiResponder(req,res,"Something went wrong.",500,unsuccess)
            })
          }
        })
        }
          else {return resHndlr.apiResponder(req,res,"Please enter the correct Currency.",500)}

					}
				})
		})
	},

  'changePassword' : function(req, res) {
       var currentPassword    = req.body.currentPassword;
       var newPassword        = req.body.newPassword;
       var confirmNewPassword = req.body.confirmNewPassword;
       var _id = req.body.userId;

       if (currentPassword && newPassword && confirmNewPassword && _id) {
           User.findOne({ _id }, {}, function(err, data) {
               if (err) {
                return resHndlr.apiResponder(req,res,"please enter the correct userId",400,err)

               } else
               if (data) {
                   bcrypt.compare(currentPassword, data.password, function(err, result) {
                       console.log("hashhhhhhhhhhhhhhhhhhhhhhhhhhhhhh compare", result);
                       if (err) {
                         console.log('there are the error',err);
                         return resHndlr.apiResponder(req,res,"Wrong , due to wrong current password",400,err)

                       } else
                       if (result) {
                           if (newPassword === confirmNewPassword) {
                               bcrypt.hash(confirmNewPassword, 10, function(err, hash) {

                                   if (err) {
                                     return resHndlr.apiResponder(req,res,"error to bcrypt newPassword",400,err)
                                   }
                                   if (hash) {
                                       console.log("thereeeeeeeeeeeeeeee", data.Password);
                                       User.findOneAndUpdate({ _id: _id}, {
                                           "$set": {"password": hash}}, (err, rcd) => {
                                           console.log("hashhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh new pass", hash);
                                           if (err) {
                                             return resHndlr.apiResponder(req,res,"new password unable to bcrypt the password",400,err)

                                           } else if (rcd) {
                                                  return resHndlr.apiResponder(req,res,"Password Changed Successfully",200,rcd)


                                           } else {
                                                 return resHndlr.apiResponder(req,res,"new password unable to bcrypt the password",400)


                                           }
                                       })

                                   } else {
                                     return resHndlr.apiResponder(req,res,"newPassword not bcrypt sucessfully",400)

                                   }
                               })
                           } else {
                             return resHndlr.apiResponder(req,res,"Newpassword and confirmNewPassword does not match",400)

                           }
                       } else {
                          return resHndlr.apiResponder(req,res,"CurrentPassword not matched",400)

                       }

                   })
               } else {
                 return resHndlr.apiResponder(req,res,"Please enter the correct userId",400)
               }
           })
       } else {
         return resHndlr.apiResponder(req,res,"Please enter the all required input",400)

       }
    },
    'genBalance' : (req,res)=>{
       var _id = req.body.userId;
       var currency = req.body.currency;
       Currencies.findOne({_id : req.body.userId},{currencies : {$elemMatch :{currency :req.body.currency}}},{},(err,data)=>{
         //db.users.findOne({"_id": id},{awards: {$elemMatch: {award:'Turing Award', year:1977}}})
         if(err){
           return resHndlr.apiResponder(req,res,"something wents wrong",400)
         }else if(data){
              console.log('that is data==============',data.currencies[0].balance);
              var Balance = data.currencies[0].balance;
               return resHndlr.apiResponder(req,res,"data found successfully",200,data.currencies[0].balance)
         }else {return resHndlr.apiResponder(req,res,"Please enter the correct Id",400)}
       })
    },
    'getBalancebyAddress' : (req,res)=>{
      //var address = req.body.address;
      client.getBalance('mpGNSbWNhmkVyFrdhCJoGfN4grVksYyUTg', 6, function(err, balance, resHeaders) {
  if (err) return console.log("there are the error ------------------",err);
  console.log('Balance:', balance);
});
},



'getBalance': (req, res) => {
      let currencyValue = currencyData.currencyData[req.body.currency]
      console.log("currencyValue: ", currencyValue, req.body.user_id)
      globalFunction.isUserExsist(req.body.user_id, function(err, response) {
          if (err)
              return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
          else {
              console.log("response._id :::  ",response._id)
              var labelWithPrefix = 'LABELPREFIX' + response._id;
              client.cmd('getbalance', labelWithPrefix, (err, balanceOnServer, resHeader) => {
                  console.log("err,balanceOnServer,resHeader :  ",err , "------", balanceOnServer,"------",resHeader)
                  if (err)
                      errorOnSever(req, res, err);
                  else if(balanceOnServer){
                      console.log("balanceOnServer : ", balanceOnServer)
                      let currencyDetailsInDb = response.balance.currencies.find(function(element) {
                          return element.currency == currencyValue.currency;
                      });
                       if(currencyDetailsInDb)
                      {
                      console.log("currencyDetailsInDb :  ", currencyDetailsInDb);
                      let updatedBalance = currencyDetailsInDb.balance + balanceOnServer;
                      console.log("updatedBalance :  ", updatedBalance);
                      client.cmd('move', labelWithPrefix, currencyValue.COMPANYACCOUNT, balanceOnServer, (err, UpdatedServer, resHeader) => {
                          console.log("in move function:  ",err,">>>>>>",UpdatedServer)
                          if (err)
                              errorOnSever(req, res, err);
                          else if (UpdatedServer) {
                              globalFunction.updateBalanceInDb(req.body.user_id, currencyValue.currency, updatedBalance, (err, result) => {
                                  if (err)
                                      return resHndlr.apiResponder(req, res, "Something went wrong", 500, err);
                                  else
                                      return resHndlr.apiResponder(req, res, "Successfully update your balance.", 200, result);
                              })
                          }
                      })
                  }
                  else
                      return resHndlr.apiResponder(req, res, "Sorry, you don't have this currency access yet.Please visit this currency page first", 500, err);
                  }
                  else

                     return resHndlr.apiResponder(req, res, "No funds to update", 500, err);

              })
          }
      })
  },

  'getTransactionsBit':(req,res)=>{
    if(!req.body.user_id)
        return resHndlr.apiResponder(req, res, "Something went wrong", 500, err)
    else
{
    var labelWithPrefix = 'LABELPREFIX' + req.body.user_id;
          client.cmd('listtransactions',labelWithPrefix,function(err, transactionList) {
          if (err) {
            if (err.code && err.code == "ECONNREFUSED") {
              return res.json({
                "message": "Server Refuse to connect App",
                statusCode: 400
              });
            }
            if (err.code && err.code < 0) {
              return res.json({
                "message": "Problem in server",
                statusCode: 400
              });
            }
            return res.json({
              "message": "Error in Server",
              statusCode: 400
            });
          }
          console.log("Return transactionList List !! ");
          return res.json({
            "tx": transactionList,
            statusCode: 200
          });
        });
      }
},
'userCurrencyBalance': (req, res) => {
        // console.log(req)
        if (!req.query) resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
        else {
            Currencies.findOne({
                userId: req.query['user_id'],
                'currencies.currency': req.query['currency']
            }, {
                'currencies.$': 1
            }).then((success) => {
                resHndlr.apiResponder(req, res, Constants.MESSAGES.Data, 200, success)
            }).catch((unsuccess) => {
                console.log(unsuccess)
                resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
            })
        }
    },

    'getAllCurrency' : (req,res)=>{
       var _id = req.body.userId;
       Currencies.findOne({_id :req.body.userId},{},(err,data)=>{
         if(err){
           return resHndlr.apiResponder(req,res,"something wents wrong",400)

         }else if(data){

           return resHndlr.apiResponder(req,res,"data found successfully",200,data)
         }else {
           return resHndlr.apiResponder(req,res,"Please enter the correct Id",400)
         }
       })
    }
    // 'getBalance' : (req,res)=>{
    //  var _id = req.body.userId;
    //  Currencies.findOne({})
    // }




}
