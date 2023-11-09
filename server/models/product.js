import mongoose from "mongoose";

var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  image: {
    type: Array
  },
  color: {
    type: String,
    enum: ['Black', 'White', ]
  },
  ratings: [
    {
        star: { type: Number },
        postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
        comment: { type: String }
    }
  ],
  total: {
    type: Number,
    default: 0
  }
}, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);
