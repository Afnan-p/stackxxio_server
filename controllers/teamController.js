import Team from '../models/Team.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Add new team member
// @route   POST /api/team
export const addTeamMember = async (req, res) => {
  try {
    const { name, role, socialLinks } = req.body;
    const image = req.file ? req.file.path : '';

    if (!image) {
      return res.status(400).json({ message: 'Member image is required' });
    }

    const member = new Team({
      name,
      role,
      image,
      socialLinks: typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks,
    });

    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all team members
// @route   GET /api/team
export const getTeamMembers = async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
export const updateTeamMember = async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const { name, role, socialLinks } = req.body;
    if (name) member.name = name;
    if (role) member.role = role;
    if (socialLinks) {
      member.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }
    if (req.file) {
      member.image = req.file.path;
    }

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
export const deleteTeamMember = async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
