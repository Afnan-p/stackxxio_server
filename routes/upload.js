import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper function to upload to Cloudinary and cleanup
const uploadToCloudinary = async (file, folderName) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `stackxio/${folderName}`,
    });
    // Delete local file after upload
    fs.unlinkSync(file.path);
    return result.secure_url;
  } catch (error) {
    // Cleanup even if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

// POST /api/upload/project
router.post("/project", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = await uploadToCloudinary(req.file, "projects");
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/upload/team
router.post("/team", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = await uploadToCloudinary(req.file, "team");
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
