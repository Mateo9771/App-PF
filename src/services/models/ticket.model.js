import mongoose from "mongoose";

const colletion = 'ticket'

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
      },
      purchase_datetime: {
        type: Date,
        default: Date.now
      },
      amount: {
        type: Number,
        required: true
      },
      purchaser: {
        type: String,
        required: true
      }
})

const ticketModel = mongoose.model(colletion, schema)

export default ticketModel