const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    mainCategory: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageURL1: {
        type: String,
        required: true
    },
    imageURL2: {
        type: String,
        required: true
    },
    imageURL3: {
        type: String,
    },
    imageURL4: {
        type: String,
    },
    createdDate: {
        type: Date,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);