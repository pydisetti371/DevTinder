const mongoose = require('mongoose');
const connectRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{value} is not supported`
        }
    },
    toUserName: {
        type: String
    },
    fromUserName: {
        type: String
    }
}, {
    timestamps: true
})
connectRequestSchema.pre('save', function (next) {
     const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
       throw new Error("Cannot send connection request to yourself");
    } 
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectRequestSchema
)

module.exports = ConnectionRequestModel