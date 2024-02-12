const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', CounterSchema);

const BlogSchema = new mongoose.Schema(
    {
        _id: Number,
        title: {
            type: String,
            required: [true, "Please provide a blog title"],
            maxlength: 50,
        },
        description: {
            type: String,
            required: [true, "Please provide a blog description"],
            maxlength: 100,
        },
        content: {
            type: String,
            required: [true, "Please provide blog content"],
        },
        author: {
            type: String,
            required: [true, "Please provide author"],
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
        likes: [{
            type: mongoose.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true },
);

BlogSchema.pre('save', async function(next) {
    const doc = this;
    const counter = await Counter.findByIdAndUpdate({_id: 'blogId'}, {$inc: { seq: 1} }, {new: true, upsert: true});
    doc._id = counter.seq;
    next();
});

module.exports = mongoose.model("Blog", BlogSchema);