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

// @route   POST api/services
// @desc    Add new service
// @access  Private
export const addService = async (req, res) => {
  const { title, description, icon, tag, order } = req.body;

  try {
    const newService = new Service({
      title,
      description,
      icon,
      tag,
      order,
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/services/:id
// @desc    Update service
// @access  Private
export const updateService = async (req, res) => {
  const { title, description, icon, tag, order } = req.body;

  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Service not found' });

    service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, icon, tag, order } },
      { new: true }
    );

    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
