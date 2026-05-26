import express from 'express';
import Project from '../models/Project.js';
import { auth } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'stackxxio/projects',
    allowed_formats: ['jpg', 'png', 'webp', 'mp4', 'mov'],
    resource_type: 'auto'
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-matroska'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and MP4/MOV are allowed.'));
    }
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { page, limit, category, paginate } = req.query;
    let query = {};
    
    console.log("GET /api/projects - Received category:", category);
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    console.log("Constructed query:", query);

    if (paginate === 'false') {
      const projects = await Project.find(query).populate('category').sort({ createdAt: -1 }).lean();
      return res.json(projects);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const skip = (pageNum - 1) * limitNum;

    const projects = await Project.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
      
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProjects: total,
      hasMore: skip + projects.length < total
    });
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
  if (!url) return "";
  const match = url.match(/(?:v=|youtu.be\/)([^&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

// Add new project (Protected) - Multiple images + media file
router.post('/', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, techStack, liveLink, githubLink, category, type, videoUrl } = req.body;
    
    // 1. Core Validation
    if (!title || !category) {
      return res.status(400).json({ message: "Title and Category are required" });
    }

    // 2. Media Validation
    const hasMediaFile = req.files && req.files['media'];
    const hasMediaUrl = req.body.mediaUrl && req.body.mediaUrl.trim() !== "";
    const hasVideoUrl = videoUrl && videoUrl.trim() !== "";

    if (type === 'video' && !hasVideoUrl && !hasMediaFile) {
      throw new Error("Video projects require a Video URL or an uploaded video file");
    }

    // 3. Asset Processing
    let finalMediaUrl = hasMediaUrl ? req.body.mediaUrl : null;
    let finalThumbnail = req.body.thumbnail && req.body.thumbnail.trim() !== "" ? req.body.thumbnail : null;
    const images = req.files && req.files['images'] ? req.files['images'].map(file => {
      console.log("CLOUDINARY IMAGE:", file);
      return file.secure_url || file.path;
    }) : [];

    if (req.files && req.files['media']) {
      const mediaFile = req.files['media'][0];
      console.log("CLOUDINARY MEDIA:", mediaFile);
      finalMediaUrl = mediaFile.secure_url || mediaFile.path;
    }

    if (req.files && req.files['thumbnail']) {
      const thumbFile = req.files['thumbnail'][0];
      console.log("CLOUDINARY THUMBNAIL:", thumbFile);
      finalThumbnail = thumbFile.secure_url || thumbFile.path;
    }

    // Auto-generate thumbnail for YouTube if empty
    if (type === 'video' && (!finalThumbnail || finalThumbnail === "/fallback.jpg") && hasVideoUrl) {
      if (videoUrl.includes("youtube") || videoUrl.includes("youtu.be")) {
        finalThumbnail = getYoutubeThumbnail(videoUrl);
      }
    }

    // Default fallback thumbnail if still empty for video
    if (type === 'video' && !finalThumbnail) {
      finalThumbnail = "/fallback.jpg";
    }

    const project = new Project({
      title,
      description: description && description.trim() !== "" ? description : "Digital masterpiece for STACKXXIO portfolio.",
      type: type || 'image',
      videoUrl: hasVideoUrl ? videoUrl : (type === 'video' ? finalMediaUrl : null), // Save uploaded video URL to videoUrl if it's a video project
      thumbnail: finalThumbnail,
      mediaUrl: finalMediaUrl,
      images,
      techStack: techStack ? (typeof techStack === 'string' ? JSON.parse(techStack) : techStack) : [],
      liveLink: liveLink && liveLink.trim() !== "" ? liveLink : null,
      githubLink: githubLink && githubLink.trim() !== "" ? githubLink : null,
      category,
    });

    const newProject = await project.save();
    console.log("SAVED PROJECT:", newProject);
    res.status(201).json(newProject);
  } catch (error) {
    console.error("PROJECT CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update project (Protected)
router.put('/:id', auth, upload.fields([{ name: 'media', maxCount: 1 }, { name: 'images', maxCount: 5 }, { name: 'thumbnail', maxCount: 1 }]), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, techStack, liveLink, githubLink, category, type, videoUrl, mediaUrl, thumbnail } = req.body;
    
    const newType = type || project.type;
    const newVideoUrl = videoUrl !== undefined ? videoUrl : project.videoUrl;
    const hasVideoUrl = newVideoUrl && newVideoUrl.trim() !== "";

    // Update fields with null fallback for empty strings
    if (title) project.title = title;
    if (description !== undefined) project.description = description && description.trim() !== "" ? description : project.description;
    if (techStack) project.techStack = typeof techStack === 'string' ? JSON.parse(techStack) : techStack;
    if (liveLink !== undefined) project.liveLink = liveLink && liveLink.trim() !== "" ? liveLink : null;
    if (githubLink !== undefined) project.githubLink = githubLink && githubLink.trim() !== "" ? githubLink : null;
    if (category) project.category = category;
    if (type) project.type = type;
    
    // Handle File Uploads
    if (req.files) {
      if (req.files['media']) {
        const mediaFile = req.files['media'][0];
        console.log("CLOUDINARY MEDIA (PUT):", mediaFile);
        const url = mediaFile.secure_url || mediaFile.path;
        project.mediaUrl = url;
        if (newType === 'video') project.videoUrl = url;
      }
      if (req.files['thumbnail']) {
        const thumbFile = req.files['thumbnail'][0];
        console.log("CLOUDINARY THUMBNAIL (PUT):", thumbFile);
        project.thumbnail = thumbFile.secure_url || thumbFile.path;
      }
      if (req.files['images']) {
        project.images = req.files['images'].map(file => file.secure_url || file.path);
      }
    }

    // Handle manual URL updates
    if (videoUrl !== undefined) project.videoUrl = videoUrl && videoUrl.trim() !== "" ? videoUrl : project.videoUrl;
    if (mediaUrl !== undefined) project.mediaUrl = mediaUrl && mediaUrl.trim() !== "" ? mediaUrl : project.mediaUrl;
    if (thumbnail !== undefined) project.thumbnail = thumbnail && thumbnail.trim() !== "" ? thumbnail : project.thumbnail;

    // Auto-generate thumbnail for YouTube if empty
    if (project.type === 'video' && (!project.thumbnail || project.thumbnail === "/fallback.jpg") && hasVideoUrl) {
      if (newVideoUrl.includes("youtube") || newVideoUrl.includes("youtu.be")) {
        project.thumbnail = getYoutubeThumbnail(newVideoUrl);
      }
    }

    // Default fallback thumbnail if still empty for video
    if (project.type === 'video' && !project.thumbnail) {
      project.thumbnail = "/fallback.jpg";
    }

    const updatedProject = await project.save();
    console.log("UPDATED PROJECT:", updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error("PROJECT UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete project (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
