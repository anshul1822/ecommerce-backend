const mongoose = require('mongoose');
const {Schema} = mongoose;
// {
//     "name": "Bdfsfs",
//     "email": "VG@fas.com",
//     "password": "!$4fMzYHv5R6U",
//     "role": "admin",
//     "addresses": [
//       {
//         "name": "Anshul Sinha",
//         "email": "anshulanant19@gmail.com",
//         "fullname": "",
//         "phone": "07667346011",
//         "street": "Flat No -2C , Block -B, Laxmi Narayan Apartment Baraitu , Ranchi Ramgarh",
//         "city": "Bhubaneshwar ",
//         "state": "Odisha",
//         "pinCode": "751024"
//       },
//       {
//         "name": "Bikaram",
//         "email": "B@1231.com",
//         "phone": "2244567",
//         "street": "Chawri Bazar",
//         "city": "Raipaur",
//         "state": "Himachal",
//         "pinCode": "222444"
//       }
//     ],
//     "id": 5
//   }

const userSchema = new Schema({
    name : { type : String , required : true},
    email : {type : String , required : true, unique:true},
    password : {type : String , required : true},
    role : {type : String , required : true, default : 'user'},
    addresses : {type : [Schema.Types.Mixed]},
    orders : {type : [Schema.Types.Mixed]},
    //TODO : We can make separate schemna for addresses
});

const virtual = userSchema.virtual('id');
virtual.get(function(){
    return this._id;
})

userSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform : function (doc, ret) {delete ret._id}
})

exports.User = mongoose.model('User', userSchema);