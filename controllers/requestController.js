const Request = require('../models/Request');

// Create new form request
exports.createRequest = async (req, res) => {
  try {
    const {
      formId,
      formData,
      submittedBy,
      submitterName,
      submitterEmail,
      department,
      priority = 'medium'
    } = req.body;

    // Validate required fields
    if (!formId || !formData || !submittedBy || !submitterName || !submitterEmail || !department) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    // Create new request
    const newRequest = new Request({
      formId,
      formData,
      submittedBy,
      submitterName,
      submitterEmail,
      department,
      priority,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to database
    await newRequest.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: newRequest
    });

  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update request
exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date(),
        $inc: { version: 1 }
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      success: true,
      message: 'Request updated successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all requests for a user
exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, formId, limit = 50, page = 1 } = req.query;

    // Build query
    let query = { submittedBy: userId };
    
    if (status) {
      query.status = status;
    }
    
    if (formId) {
      query.formId = formId;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRequest = await Request.findByIdAndDelete(id);
    
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });

  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Search requests
exports.searchRequests = async (req, res) => {
  try {
    const { 
      search, 
      status, 
      formId, 
      department,
      startDate,
      endDate,
      limit = 50,
      page = 1 
    } = req.query;

    // Build query
    let query = {};

    // Search in formData fields
    if (search) {
      query.$or = [
        { 'formData.requesterName': { $regex: search, $options: 'i' } },
        { 'formData.docTitle': { $regex: search, $options: 'i' } },
        { 'formData.docNo': { $regex: search, $options: 'i' } },
        { submitterName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by formId
    if (formId) {
      query.formId = formId;
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Search requests error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};