const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let user = new Schema({

email:{type:String,unique:true,lowercase:true}, //
password:{type:String}, //
spendingPassword:{type:String},
verificationToken : {type : String},
verifyEmail:{ verificationStatus: {type: Boolean, default :false},email: {type:String}},
btcAddress :[{ address :{type : String},name:{ type :String,default : 'BTC' },balance :{ type : String }}],
createdAt:{type:Date, default:Date.now},
state:{ //for delete/block/deactive
	status:{type:String},
	actionBY:{type:String , ref : 'user'}
},
referCode:{type:String}, // should be unique
referTime:{type:String},// time till that refer code is valid
referBy:{type:Schema.Types.ObjectId, ref : 'user'},//id of that user who refered you for this side
referStatus:{type:Boolean}, //refer is valid or not
balance:{type:String, ref : 'currencies'}
});
module.exports = mongoose.model('User',user);
