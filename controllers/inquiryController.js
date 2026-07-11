import Inquiry from '../models/Inquiry.js';
import sendEmail from '../utils/sendEmail.js';
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

    // Send email notification to admin
    const emailMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #111; text-align: center; border-bottom: 2px solid #10B981; padding-bottom: 10px;">New Inquiry Received!</h2>
        <p style="font-size: 16px; color: #555;">You have received a new message from the ZYNEXTA website contact form:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message from your website.</p>
      </div>
    `;

    // Fire and forget email sending (we don't await/block the response to user)
    sendEmail({
      email: process.env.RECEIVER_EMAIL, // Admin email
      subject: `New Inquiry from ${name}`,
      message: emailMessage,
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
