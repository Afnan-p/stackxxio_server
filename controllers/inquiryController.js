import Inquiry from '../models/Inquiry.js';

// @desc    Submit a new inquiry
// @route   POST /api/inquiries
// @access  Public
export const submitInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry transmitted successfully',
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Transmission failed',
      error: error.message
    });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin only)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch inquiries',
      error: error.message
    });
  }
};

// @desc    Delete an inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin only)
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    await inquiry.deleteOne();
    res.status(200).json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
