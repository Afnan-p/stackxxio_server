import Service from '../models/Service.js';

// @route   GET api/services
// @desc    Get all services
// @access  Public
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

import mongoose from 'mongoose';

// @route   GET api/services/:slug
// @desc    Get single service by slug or id
// @access  Public
export const getServiceBySlug = async (req, res) => {
  try {
    const param = req.params.slug;
    let service = await Service.findOne({ slug: param });
    
    // If not found by slug, and it's a valid ObjectId, try finding by _id
    if (!service && mongoose.Types.ObjectId.isValid(param)) {
      service = await Service.findById(param);
    }

    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

// @route   POST api/services
// @desc    Add new service
// @access  Private
export const addService = async (req, res) => {
  try {
    const { title, description, icon, tag, order, fullDescription, features, technologies, faqs, seoTitle, seoDescription } = req.body;
    let slug = req.body.slug || generateSlug(title);
    
    // Check slug uniqueness
    const existing = await Service.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    let image = null;
    if (req.file) {
      image = req.file.secure_url || req.file.path;
    }

    const newService = new Service({
      title,
      description,
      icon: icon || 'FaCode',
      tag,
      order: order || 0,
      slug,
      fullDescription,
      features: features ? JSON.parse(features) : [],
      technologies: technologies ? JSON.parse(technologies) : [],
      faqs: faqs ? JSON.parse(faqs) : [],
      seoTitle,
      seoDescription,
      image
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error("ADD SERVICE ERROR:", err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// @route   PUT api/services/:id
// @desc    Update service
// @access  Private
export const updateService = async (req, res) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });

    const { title, description, icon, tag, order, fullDescription, features, technologies, faqs, seoTitle, seoDescription } = req.body;
    
    const updateData = {
      title,
      description,
      icon,
      tag,
      order,
      fullDescription,
      seoTitle,
      seoDescription
    };

    if (features) updateData.features = JSON.parse(features);
    if (technologies) updateData.technologies = JSON.parse(technologies);
    if (faqs) updateData.faqs = JSON.parse(faqs);
    if (req.body.slug) updateData.slug = req.body.slug;

    if (req.file) {
      updateData.image = req.file.secure_url || req.file.path;
    }

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(service);
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    res.status(500).json({ message: err.message || 'Server Error' });
  }
};

// @route   DELETE api/services/:id
// @desc    Delete service
// @access  Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });

    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Service removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
