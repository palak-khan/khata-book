const mongoose = require("mongoose");
const Joi = require("joi");
const userSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  profilepicture: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  hisaab: [{ type: mongoose.Schema.Types.ObjectId, ref: "hisaab" }],
});

// const userValidation = (data) => {
//   const schema = Joi.object({
//     username: Joi.string().trim().min(3).max(20).required(),
//     name: Joi.string().trim().required(),
//     dp: Joi.string().trim().optional(),
//     email: Joi.string().trim().email().required(),
//     password: Joi.string().required(),
//     hisaab: Joi.array()
//       .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
//       .optional(),
//   });

//   return schema.validate(data);
// };
// module.exports.userValidation = userValidation;
module.exports = mongoose.model("user", userSchema);