import express from 'express';
import Project from '../models/Project.js';
import auth from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary Storage Config for Projects
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stackxio/projects',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }] // High-res sharp images fix
  },
});

const upload = multer({ storage: storage });

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new project (Protected) - Multiple images
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, techStack, liveLink, githubLink, category } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const project = new Project({
      title,
      description,
      images,
      techStack: typeof techStack === 'string' ? JSON.parse(techStack) : techStack,
      liveLink,
      githubLink,
      category,
    });

    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update project (Protected)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, techStack, liveLink, githubLink, category } = req.body;
    
    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
    if (liveLink) project.liveLink = liveLink;
    if (githubLink) project.githubLink = githubLink;
    if (category) project.category = category;
    
    if (req.files && req.files.length > 0) {
      project.images = req.files.map(file => file.path);
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete project (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
