import Footer from '../models/Footer.js';

// @route   GET api/footer
// @desc    Get footer data
// @access  Public
export const getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();
    if (!footer) {
      // Create default if not exists
      footer = new Footer();
      await footer.save();
    }
    res.json(footer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/footer
// @desc    Update footer data
// @access  Private
export const updateFooter = async (req, res) => {
  const { logoText, tagline, twitter, linkedin, instagram, whatsapp, copyright, email, phones } = req.body;

  try {
    let footer = await Footer.findOne();
    
    if (footer) {
      footer = await Footer.findOneAndUpdate(
        {},
        { $set: { logoText, tagline, twitter, linkedin, instagram, whatsapp, copyright, email, phones, updatedAt: Date.now() } },
        { new: true }
      );
      return res.json(footer);
    }

    // Fallback if somehow not created
    footer = new Footer({ logoText, tagline, twitter, linkedin, instagram, whatsapp, copyright, email, phones });
    await footer.save();
    res.json(footer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
