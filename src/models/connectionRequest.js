const mongoose = require('mongoose');
const connectRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User" // here accessing directly from User table, table name must be what is defined in User model and fetching details with match objectId. (TYPE)
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