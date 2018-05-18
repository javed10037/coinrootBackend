const User = require('../user/user');
const resHndlr = require("../global/Responder");
const Currencies = require('../currency/currencies');
var bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const globalFunction = require('../global/globalFunctions');
const Constants = require('./userConstant');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const bitcoin = require('bitcoin');
const client = new bitcoin.Client({
  //BCH Server details
  host: '162.213.252.66',
  port: 18336,
  user: 'test',
  pass: 'test123'
});

module.exports = {
  'registration': (req, res) => {   // just a demo api not for use
    var reqBj = {
      spendingPassword : req.body.spendingPassword,
      confirmSpendingPassword  : req.body.confirmSpendingPassword,
      password  : req.body.password,
      confirmPassword  : req.body.confirmPassword,
      email:req.body.email
    }
    if (reqBj.email && reqBj.password && reqBj.confirmPassword && reqBj.spendingPassword && reqBj.confirmSpendingPassword)
    {
    // var token;
     if(reqBj.password == reqBj.confirmPassword){
       if(reqBj.confirmSpendingPassword == reqBj.spendingPassword){
            User.findOne({email:req.body.email},{},(err,data)=>{
               if(err){
               return  resHndlr.apiResponder(req,res,"There is error to get data from db",400)
             }else
            if(!data){
                      bcrypt.hash(reqBj.password, 10, (err, hash)=>{
                        if (err) {
                         return  resHndlr.apiResponder(req,res,"unable to bcrypt the password", 400)
                          } else if (hash){
                            bcrypt.hash(reqBj.spendingPassword,10,(err,hashed)=>{
                              if(err){
                              return  resHndlr.apiResponder(req,res, "unable to bcrypt the password",400 )
                            }else if(hashed){
                          crypto.randomBytes(3, function (err, buf) {
                            if(err){
                              console.log('dshfdsfdgygdfdyff')
                            }
                          else if(buf){
                          var token = buf.toString('hex');
                        var obj1 = {
                          spendingPassword : hashed,
                          password  : hash,
                          email:req.body.email,
                          verificationToken : token.toLowerCase()
                        }
                                 User.create(obj1).then((user)=>{
                                  console.log('register successfully',user);
                                      // return  resHndlr.apiResponder(req,res,"New Account has been register successfully", 200)
                                      globalFunction.sendMail(user,user._id,req.body.email, 'subject', 'text', (err, result) =>{
                                    if (err) {
                                        console.log("err: ", err)
                                      return resHndlr.apiResponder(req, res, "There is error to send the token on mail", 400)
                                    }
                                    else
                                    return resHndlr.apiResponder(req, res, Constants.MESSAGES.evrifyMail, 200)
                                  })

                               }).catch((unsuccess)=>{
                                 console.log('dfsaaaaaaaaaaaaaaaaaaaaaaaa',unsuccess)
                             return  resHndlr.apiResponder(req,res,"Please enter the correct inputs",400)

                         })

                     }

                         else { return resHndlr.apiResponder(req,res,"error to create verification token ",400 )
                       }
                     })

                  }
                    else {
                     return  resHndlr.apiResponder(req,res,"spendingPassword is unable to bcrypt",400)
                   }
                 })
                 }
                 else {
                  return  resHndlr.apiResponder(req,res ,"Password is unable to bcrypt",400)
                }

               })
             }
            if(data){
              console.log('dfshhhfuidsfsdfsdfhduifhf',err)
         return  resHndlr.apiResponder(req,res, "This email id is already register with us ",400);
       }
     })
   }else {
       return resHndlr.apiResponder(req,res,"spendingPassword and confirmspendingPassword are  not match ",400 );
     }
   }else {
   return  resHndlr.apiResponder(req,res,"Password and confirmPassword not match",400);
   }
 }else { return resHndlr.apiResponder(req,res,"Please enter the all required field ",400 )
}
},
        // 'verifyOtp': (req, res) => {
        //     if (!req.body.otp) return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
        //     else User.findOne({verificationToken: req.body.otp})
        //         .then((success) => {
        //           if(!success.verifyEmail.verificationStatus == true){
        //         if (success && success.verificationToken == req.body.otp)
        //         {
        //           success.verifyEmail.verificationStatus = true;
        //           success.verifyEmail.email = success.email;
        //           success.save()
        //           .then((result)=>
        //           {
        //             var batch = [];
        //
        //                         batch.push({
        //                           method: 'getnewaddress',
        //                           params: ['myaccount']
        //                         });
        //
        //                       client.cmd(batch, function(err, address, resHeaders){
        //                         if (err) return console.log(err);
        //                         console.log('Address:', address);
        //
        //                         User.update({verificationToken: req.body.otp},{$push : {'btcAddress': {"address" : address}}},function(err,data){
        //
        //                           if(err) {return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 500);
        //                         }  else if(data){
        //                           console.log(data);
        //                       resHndlr.apiResponder(req, res, 'OTP is virified successfully.', 200,data)
        //                     }
        //               })
        //
        //         })
        //       }).catch((err)=>{console.log('therejfhgyusgydchfdgys')
        //     })
        //   }
        //
        //         else resHndlr.apiResponder(req, res, 'Please provide the correct otp.', 400)
        //       }else  resHndlr.apiResponder(req, res, 'This email Id is already verify .', 400)
        //     }).catch((unsuccess) => resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400))
        // },








        'verifyOtp': (req, res) => {
            if (!req.body.otp)
             return resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
            else User.findOne({verificationToken: req.body.otp})
                .then((success) => {
                  if(success){
                  if(!success.verifyEmail.verificationStatus == true){
                  if (success && success.verificationToken == req.body.otp)
                  {
                  success.verifyEmail.verificationStatus = true;
                  success.verifyEmail.email = success.email;


                  Currencies.create({userId:success._id})
                     .then((result)=>{
                         success.balance = result._id;
                         success.save(function(err,result)
                    {
                        if(err)
                          return  resHndlr.apiResponder(req, res, Constants.MESSAGES.SomeThingWrong, 400)
                        else
                          return  resHndlr.apiResponder(req, res, 'Email verified successfully.', 200)
                        // res.redirect('http://192.168.0.131/binance/trading/trade');
                    })
                  })
        } else return resHndlr.apiResponder(req, res, 'Please provide the correct otp.', 400)

     }  else  return resHndlr.apiResponder(req, res, 'you email Id is already verify .', 400)
   }else return resHndlr.apiResponder(req, res, 'Please enter the correct otp.', 400)
    })
    .catch((unsuccess)=>console.log("unsuccess: ",unsuccess))

},
    'login': (req, res) => {
    	if(!req.body.password || !req.body.email)
            resHndlr.apiResponder(req, res, Constants.MESSAGES.RequiredField, 400)
        else
        User.findOne({email: req.body.email},function(err, record) {
            if (err)
                return resHndlr.apiResponder(req, res, Constants.MESSAGES.EmailNotExsist, 400)
            else if (record) {
              console.log('this is going there are ',record)
                if(record.verifyEmail.verificationStatus == true || record.verifyEmail.verificationStatus == 'True'){
                bcrypt.compare(req.body.password, record.password, (err, data) =>{
                    if (data) {

                            var token = jwt.sign({id:data._id},'secret',{ expiresIn: '1h' });
                        resHndlr.apiResponder(req, res, Constants.MESSAGES.loginSuccessfull,200,record,token)

                        //    resHndlr.apiResponder({req, res, "User loggin successfully successfully", auth : true,token : token , data : data })

                      var userid =  (req, res)=>{
                       var token = req.headers['token'];
                       jwt.verify(token, "name", (err, decoded)=>{
                         if (err) return res.json(err);
                         return res.json(decoded);
                       });
               }
             }

                    else
                        {
                          console.log(err)
                     return resHndlr.apiResponder(req, res, Constants.MESSAGES.PasswordMismatch, 400)
                    }
                })
              }else{
            return  resHndlr.apiResponder(req, res, 'your email is not verified first please verified the email.', 400)
             }

            } else
             return resHndlr.apiResponder(req, res, Constants.MESSAGES.EmailNotExsist, 400)
        })
    },
     'forgotPassword': (req,res)=>{
                User.findOne({email : req.body.email},{}).then((data)=>{
                  if(data){
                      crypto.randomBytes(10, function (err, buf){
                      token = buf.toString('hex');
                      data.verificationToken = token;
                      data.save(function(err,success){
                          if(err){
                          return resHndlr.apiResponder(req, res,'Please enter the correct email', 400)
                          }else if(success){
                           resHndlr.apiResponder(req, res,'reset verification token has been send successfully on your Email Id',200)
                             globalFunction.forgotPasswordMail(data,data._id,req.body.email, 'subject', 'text', (err, result) =>{
                             if(err){
                                console.log('please enter the correct email')
                           }else{
                            return resHndlr.apiResponder(req, res,'Please enter the correct email',400)
                          }
                       })
                     }else{

                       return resHndlr.apiResponder(req, res,'Please enter the correct email',400)
                   }
                     })
                   })
                 }else{
                   return resHndlr.apiResponder(req, res,'Please enter the correct email',400)
                 }
                   }).catch((err)=>{
                return resHndlr.apiResponder(req, res,'Please enter the correct email',400)
             })
           },
     'getAllInfoById' : (req,res)=>{
       let _id = req.body.userId;
         User.findOne({_id : req.body.userId},{}).then((data)=>{
          resHndlr.apiResponder(req, res, 'There are all data here of particular user',200,data)
         }).catch((err)=>{
           console.log('this is error',err)
          return resHndlr.apiResponder(req, res,'Please enter the correct id',400)
         })
       },
       'resetPassword' : (req,res)=>{
         var verificationToken = req.body.token;
         var newPassword = req.body.newPassword;
         var confirmNewPassword = req.body.confirmNewPassword;
         bcrypt.genSalt(10, function(err, salt){
           if(err){
             return resHndlr.apiResponder(req, res,'Something want wrong due to incurrect tooken',400)}
           else if(salt){
            if(verificationToken && newPassword && confirmNewPassword){
              if(newPassword == confirmNewPassword){
               User.findOne({verificationToken : req.body.token },{}).then((data)=>{
                 if(data){
                   console.log('there are the all data has been received sussessfully',data)
                   bcrypt.hash(newPassword,salt,(err,hash)=>{
                   if(err){
                     return resHndlr.apiResponder(req, res,'Something want wrong due to incurrect tooken',400)
                    }else if(hash){
                  data.password = hash;
                  console.log('there are the hash is generated successfully',data.password);
                  data.save(function(err,success){
                    if(err){
                   return resHndlr.apiResponder(req, res,'Something want wrong',400)
                 }else if(success){
                   resHndlr.apiResponder(req, res, 'New Password changed successfully',200,data)
                }
              })
            }else {
              return resHndlr.apiResponder(req, res,'Something want wrong',400)
            }
          })
        }else{   return resHndlr.apiResponder(req, res,'Please enter the correct verificationToken',400)}
        }).catch((err)=>{

          return resHndlr.apiResponder(req, res,'Please enter the the correct token',800)

      })
    }else {return resHndlr.apiResponder(req, res,'newPassword and confirmNewPassword are not matched',400)}
      }else{
        return resHndlr.apiResponder(req, res,'Please enter the required',400)
      }
    }
    })
  },

};
