const mongoose = require('mongoose');
const Joi = require("joi");
const hisaabSchema = mongoose.Schema({
    title:{
        type:String,
        trim:true,
        minLength:3,
        maxLength:100,
        required:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    encrypted:{
        type:Boolean,
        default:false,
    },
    shareable:{
        type:Boolean,
        default:false,
    },
    passcode:{
        type:String,
        default:'',
    },
    editpermissions:{
        type:Boolean,
        default:false,
    },
},{
    timestamps:true,
});

// const hisaabValidation = (data) => {
//     const schema = Joi.object({
//       title: Joi.string().trim().required(),
//       description: Joi.string().trim().required(),
//       user: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  
//       encrypted: Joi.boolean().default(false),
//       shareable: Joi.boolean().default(false),
//       passcode: Joi.number().default(""),
//       editPermission: Joi.boolean().default(false),
//     });
  
//     return schema.validate(data);
//   };

//   module.exports.hisaabModelValidator = hisaabValidation;
module.exports =  mongoose.model('hisaab',hisaabSchema);
