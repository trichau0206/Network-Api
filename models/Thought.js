
const { Schema, model } = require("mongoose"); //
// import moment module to format the timestamp
const moment = require("moment");
const reactionSchema = require("./reaction");

// Thought SCHEMA
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
    username: {
      type: String,
      required: true,
    },

    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// GET total count of friends
thoughtSchema
  .virtual("reactionCount")
  // Getter
  .get(function () {
    return `reactions: ${this.reactions.length}`;
  });

// CREATE the User model with UserSchema
const Thought = model("Thought", thoughtSchema);

// EXPORT the Thought model
module.exports = Thought;