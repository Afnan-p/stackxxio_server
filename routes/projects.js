import express from 'express';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Local Storage Config for Projects
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and MP4 are allowed.'));
    }
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('category').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('category');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function getYoutubeThumbnail(url) {
  const match = url.match(/(?:v=|youtu.be\/)([^&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

// Add new project (Protected) - Multiple images + media file
router.post('/', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, techStack, liveLink, githubLink, category, type, videoUrl } = req.body;
    
    // Validation for Video Projects
    if (type === "video" && !videoUrl) {
      return res.status(400).json({ message: "Video URL is required for video projects" });
    }

    let mediaUrl = req.body.mediaUrl || '';
    let thumbnail = req.body.thumbnail || '';
    const images = req.files && req.files['images'] ? req.files['images'].map(file => file.path.replace(/\\/g, '/')) : [];

    if (req.files && req.files['media']) {
      mediaUrl = req.files['media'][0].path.replace(/\\/g, '/');
    }

    if (req.files && req.files['thumbnail']) {
      thumbnail = req.files['thumbnail'][0].path.replace(/\\/g, '/');
    }

    // Auto-generate thumbnail for YouTube if empty
    if (type === 'video' && !thumbnail && videoUrl) {
      if (videoUrl.includes("youtube") || videoUrl.includes("youtu.be")) {
        thumbnail = getYoutubeThumbnail(videoUrl);
      }
    }

    const project = new Project({
      title,
      description,
      type: type || 'image',
      videoUrl: videoUrl || '',
      thumbnail,
      mediaUrl,
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
router.put('/:id', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, techStack, liveLink, githubLink, category, type, videoUrl, mediaUrl, thumbnail } = req.body;
    
    const newType = type || project.type;
    const newVideoUrl = videoUrl !== undefined ? videoUrl : project.videoUrl;

    // Validation for Video Projects
    if (newType === "video" && !newVideoUrl) {
      return res.status(400).json({ message: "Video URL is required for video projects" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
    if (liveLink) project.liveLink = liveLink;
    if (githubLink) project.githubLink = githubLink;
    if (category) project.category = category;
    if (type) project.type = type;
    if (videoUrl !== undefined) project.videoUrl = videoUrl;
    if (mediaUrl !== undefined) project.mediaUrl = mediaUrl;
    if (thumbnail !== undefined) project.thumbnail = thumbnail;
    
    if (req.files) {
      if (req.files['media']) project.mediaUrl = req.files['media'][0].path.replace(/\\/g, '/');
      if (req.files['thumbnail']) project.thumbnail = req.files['thumbnail'][0].path.replace(/\\/g, '/');
      if (req.files['images']) project.images = req.files['images'].map(file => file.path.replace(/\\/g, '/'));
    }

    // Auto-generate thumbnail for YouTube if empty
    if (project.type === 'video' && !project.thumbnail && project.videoUrl) {
      if (project.videoUrl.includes("youtube") || project.videoUrl.includes("youtu.be")) {
        project.thumbnail = getYoutubeThumbnail(project.videoUrl);
      }
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
