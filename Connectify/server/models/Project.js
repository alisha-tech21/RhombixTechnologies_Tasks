const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      type: String,
      default: "",
    },
    liveUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["live", "in_progress", "archived"],
      default: "live",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
