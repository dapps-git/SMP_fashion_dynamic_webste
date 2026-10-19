const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  title: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  image: { type: String }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  emirate: { type: String, default: 'Dubai' },
  notes: { type: String, default: '' },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: 'AED' },
  paymentMethod: { type: String, default: 'Cash / Card on Delivery (Inspect First)' },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
