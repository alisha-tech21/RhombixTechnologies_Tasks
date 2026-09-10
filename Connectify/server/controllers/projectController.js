const Project = require("../models/Project");

// @desc    Create a new project (on my own profile)
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { title, description, liveUrl, githubUrl, techStack, status } =
      req.body;

    if (!title) {
      res.status(400);
      throw new Error("Project title is required");
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      image,
      liveUrl,
      githubUrl,
      status: status || "live",
      techStack: Array.isArray(techStack)
        ? techStack
        : typeof techStack === "string"
          ? JSON.parse(techStack)
          : [],
    });

    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for a specific user
// @route   GET /api/projects/user/:userId
// @access  Private
const getUserProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (!project.user.equals(req.user._id)) {
      res.status(403);
      throw new Error("You can only edit your own projects");
    }

    const { title, description, liveUrl, githubUrl, techStack, status } =
      req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (status !== undefined) project.status = status;
    if (techStack !== undefined) {
      project.techStack = Array.isArray(techStack)
        ? techStack
        : JSON.parse(techStack);
    }
    if (req.file) {
      project.image = `/uploads/${req.file.filename}`;
    }

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (!project.user.equals(req.user._id)) {
      res.status(403);
      throw new Error("You can only delete your own projects");
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
};
