const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.status(500).json(err));
  },
  // GET single thought
  getSingleThought({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: "No thoughts found with this ID" })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  //CREATE a thought / PUSH created thought _id to user's thoughts array
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        )
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res
                .status(404)
                .json({ message: "No thoughts found with this ID" });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      })
      .catch((err) => res.status(500).json(err));
  },
  //UPDATE thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
      runValidators: true,
      new: true,
    })
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: "No thoughts found with this ID" })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  //DELETE thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thoughts found with this ID" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  //CREATE reaction  /api/thoughts/thoughtID/reactions
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: "No thought found with that ID" })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
  //DELETE reaction
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) =>
        !dbThoughtData
          ? res.status(404).json({ message: "No thoughts found with this ID" })
          : res.json(dbThoughtData)
      )
      .catch((err) => res.status(500).json(err));
  },
};