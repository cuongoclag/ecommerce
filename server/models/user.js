import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from "crypto-js";

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  address: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
  ],
  wishlist: [{ type: mongoose.Types.ObjectId, ref: "Products" }],
  isBlocked: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  passwordChangeAt: {
    type: String,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: String,
  },
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password)
  },
  createPasswordChangedToken: function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000
    return resetToken
  }
}

//Export the model
export default mongoose.model("User", userSchema);
