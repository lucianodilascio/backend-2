import mongoose from "mongoose";

const TicketSchema = mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },

    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    purchaser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }

});

const TicketModel = mongoose.model("Ticket", TicketSchema);

export default TicketModel;
