const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderid: { type: String, index: true, unique: true },
  selected: Object,
  couponWeekStart: { type: String, required: true },
});
const OrderModel = mongoose.model("order", OrderSchema);

module.exports.saveOrder = async function (orderid, selected, couponWeekStart) {
  await OrderModel.updateOne({ orderid }, { $set: { selected, couponWeekStart } }, { upsert: true });
};
module.exports.getOrder = async function (orderid) {
  return await OrderModel.findOne({ orderid });
};
module.exports.deleteOrder = async function (orderid) {
  await OrderModel.deleteOne({ orderid });
};
