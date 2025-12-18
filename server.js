// backend/server.js - UPDATED FOR MULTI-FORM SUPPORT
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== MONGODB CONNECTION ==========
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/form_management';

console.log('🔗 ===== MONGODB CONNECTION =====');
console.log('Using URI:', MONGODB_URI);

// For Mongoose v7+ and MongoDB driver v6+
mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  console.log(`📊 Host: ${mongoose.connection.host}`);
  console.log(`📊 Port: ${mongoose.connection.port}`);
  console.log(`📊 Ready State: ${mongoose.connection.readyState}`);
  
  // Verify we can write to the database
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ MongoDB ping successful - ready for writes');
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('Full error:', err);
  console.log('⚠️ Will use in-memory storage if MongoDB not available');
});

// ========== MONGODB SCHEMA & MODEL ==========
// Updated schema to handle ALL form types
const formRequestSchema = new mongoose.Schema({
  // Common fields for all forms
  formId: { 
    type: String, 
    required: true,
    enum: ['form-01', 'form-02', 'form-04'], // Allowed form IDs
    index: true
  },
  formType: {
    type: String,
    required: true,
    enum: ['creation', 'approval', 'training'],
    default: 'creation'
  },
  formName: {
    type: String,
    required: true,
    default: 'Unknown Form'
  },
  formNumber: {
    type: String,
    required: true,
    default: 'N/A'
  },
  
  // Form-specific data (flexible structure)
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  
  // User information
  submittedBy: { 
    type: String, 
    required: true 
  },
  submitterName: { 
    type: String, 
    required: true 
  },
  submitterEmail: { 
    type: String, 
    default: '' 
  },
  department: { 
    type: String, 
    default: 'General' 
  },
  
  // Request tracking
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'pending',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium' 
  },
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Additional metadata
  savedLocally: { 
    type: Boolean, 
    default: false 
  },
  version: { 
    type: Number, 
    default: 1 
  }
}, {
  timestamps: true,
  // Enable indexing on commonly queried fields
  indexes: [
    { formId: 1, createdAt: -1 },
    { status: 1, createdAt: -1 },
    { submittedBy: 1, createdAt: -1 },
    { department: 1, createdAt: -1 }
  ]
});

// Pre-save hook to update timestamps
formRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set formName and formNumber based on formId
  if (!this.formName || this.formName === 'Unknown Form') {
    const formNames = {
      'form-01': 'Document Creation Form',
      'form-02': 'Document Approval Request Form', 
      'form-04': 'Training Schedule Form'
    };
    this.formName = formNames[this.formId] || 'Unknown Form';
  }
  
  if (!this.formNumber || this.formNumber === 'N/A') {
    const formNumbers = {
      'form-01': 'OF/DG/001',
      'form-02': 'OF/DG/002',
      'form-04': 'OF/DG/004'
    };
    this.formNumber = formNumbers[this.formId] || 'N/A';
  }
  
  // Auto-set formType based on formId
  if (!this.formType) {
    const formTypes = {
      'form-01': 'creation',
      'form-02': 'approval',
      'form-04': 'training'
    };
    this.formType = formTypes[this.formId] || 'creation';
  }
  
  next();
});

const FormRequest = mongoose.model('FormRequest', formRequestSchema);

// ========== IN-MEMORY FALLBACK ==========
let inMemoryRequests = [];

// Check connection status after server starts
setTimeout(() => {
  console.log('\n📊 ===== SERVER STARTUP STATUS =====');
  const isConnected = mongoose.connection.readyState === 1;
  console.log('MongoDB Ready State:', mongoose.connection.readyState);
  console.log('MongoDB Connected:', isConnected ? '✅ YES' : '❌ NO');
  console.log('In-memory requests:', inMemoryRequests.length);
  console.log('=====================================\n');
}, 2000);

// ========== API ENDPOINTS ==========

// 1. ROOT ENDPOINT
app.get('/', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    message: 'Form Management Backend API',
    version: '1.0.0',
    status: 'running',
    database: isConnected ? 'MongoDB' : 'In-memory (MongoDB not connected)',
    mongodb: {
      connected: isConnected,
      readyState: mongoose.connection.readyState,
      databaseName: mongoose.connection.db?.databaseName || 'Not connected'
    },
    requestsStored: isConnected ? 'Check /api/health' : inMemoryRequests.length,
    formsSupported: [
      { id: 'form-01', name: 'Document Creation Form', number: 'OF/DG/001' },
      { id: 'form-02', name: 'Document Approval Request Form', number: 'OF/DG/002' },
      { id: 'form-04', name: 'Training Schedule Form', number: 'OF/DG/004' }
    ],
    endpoints: [
      'GET  /api/health',
      'GET  /api/requests',
      'POST /api/requests',
      'GET  /api/requests/:id',
      'GET  /api/requests/count',
      'GET  /api/forms/:formId',
      'GET  /api/test-db'
    ]
  });
});

// 2. HEALTH CHECK
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      return res.json({
        status: 'WARNING',
        timestamp: new Date().toISOString(),
        requestCount: inMemoryRequests.length,
        server: 'Form Management Backend',
        database: 'In-memory (MongoDB not connected)',
        warning: 'Data will be lost on server restart',
        mongodb: {
          connected: false,
          readyState: mongoose.connection.readyState
        }
      });
    }
    
    const requestCount = await FormRequest.countDocuments();
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      requestCount: requestCount,
      server: 'Form Management Backend',
      database: 'MongoDB',
      mongodb: {
        connected: true,
        readyState: mongoose.connection.readyState,
        databaseName: mongoose.connection.db.databaseName
      }
    });
  } catch (error) {
    res.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      requestCount: inMemoryRequests.length,
      server: 'Form Management Backend',
      database: 'In-memory (MongoDB error)',
      error: error.message,
      mongodb: {
        connected: false,
        readyState: mongoose.connection.readyState
      }
    });
  }
});

// 3. GET REQUEST COUNT
app.get('/api/requests/count', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      return res.json({ 
        success: true, 
        count: inMemoryRequests.length, 
        storage: 'in-memory',
        mongodbConnected: false 
      });
    }
    
    const count = await FormRequest.countDocuments();
    res.json({ 
      success: true, 
      count, 
      storage: 'mongodb',
      mongodbConnected: true 
    });
  } catch (error) {
    res.json({ 
      success: true, 
      count: inMemoryRequests.length, 
      storage: 'in-memory-fallback',
      mongodbConnected: false,
      error: error.message 
    });
  }
});

// 4. GET ALL REQUESTS (with filtering)
app.get('/api/requests', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const { formId, status, department, limit = 50, page = 1 } = req.query;
    
    if (!isConnected) {
      let filteredRequests = [...inMemoryRequests];
      
      // Apply filters
      if (formId) {
        filteredRequests = filteredRequests.filter(r => r.formId === formId);
      }
      if (status) {
        filteredRequests = filteredRequests.filter(r => r.status === status);
      }
      if (department) {
        filteredRequests = filteredRequests.filter(r => r.department === department);
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
      
      return res.json({
        success: true,
        count: filteredRequests.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredRequests.length / limit),
        data: paginatedRequests,
        storage: 'in-memory',
        mongodbConnected: false
      });
    }
    
    // Build MongoDB query
    const query = {};
    if (formId) query.formId = formId;
    if (status) query.status = status;
    if (department) query.department = department;
    
    const skip = (page - 1) * limit;
    
    const [requests, totalCount] = await Promise.all([
      FormRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      FormRequest.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      count: requests.length,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: requests,
      storage: 'mongodb',
      mongodbConnected: true
    });
  } catch (error) {
    res.json({
      success: true,
      count: inMemoryRequests.length,
      data: inMemoryRequests,
      storage: 'in-memory-fallback',
      mongodbConnected: false,
      error: error.message
    });
  }
});

// 5. GET REQUESTS BY FORM ID
app.get('/api/forms/:formId', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const { formId } = req.params;
    
    if (!isConnected) {
      const formRequests = inMemoryRequests.filter(r => r.formId === formId);
      return res.json({
        success: true,
        formId: formId,
        count: formRequests.length,
        data: formRequests,
        storage: 'in-memory',
        mongodbConnected: false
      });
    }
    
    const requests = await FormRequest.find({ formId: formId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      formId: formId,
      count: requests.length,
      data: requests,
      storage: 'mongodb',
      mongodbConnected: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 6. GET SINGLE REQUEST BY ID
app.get('/api/requests/:id', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const { id } = req.params;
    
    if (!isConnected) {
      const request = inMemoryRequests.find(r => r._id === id);
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          message: 'Request not found',
          storage: 'in-memory',
          mongodbConnected: false 
        });
      }
      return res.json({ 
        success: true, 
        data: request, 
        storage: 'in-memory',
        mongodbConnected: false 
      });
    }
    
    // Try MongoDB first
    let request = await FormRequest.findById(id);
    
    // If not found in MongoDB, check in-memory
    if (!request) {
      request = inMemoryRequests.find(r => r._id === id);
      if (!request) {
        return res.status(404).json({ 
          success: false, 
          message: 'Request not found',
          storage: 'mongodb',
          mongodbConnected: true 
        });
      }
      return res.json({ 
        success: true, 
        data: request, 
        storage: 'in-memory',
        mongodbConnected: true 
      });
    }
    
    res.json({ 
      success: true, 
      data: request, 
      storage: 'mongodb',
      mongodbConnected: true 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      storage: 'error',
      mongodbConnected: mongoose.connection.readyState === 1 
    });
  }
});

// 7. CREATE NEW FORM REQUEST - SUPPORTS ALL FORMS!
app.post('/api/requests', async (req, res) => {
  console.log('\n📨 ===== NEW FORM SUBMISSION =====');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  console.log('🔍 MongoDB State:', mongoose.connection.readyState);
  
  try {
    const {
      formId,
      formData,
      submittedBy,
      submitterName,
      submitterEmail,
      department,
      status = 'pending',
      priority = 'medium',
      formType,
      formName,
      formNumber
    } = req.body;

    // Validation
    if (!formId) {
      console.log('❌ Validation failed: Missing formId');
      return res.status(400).json({
        success: false,
        message: 'Missing required field: formId'
      });
    }

    // Validate formId is supported
    const supportedForms = ['form-01', 'form-02', 'form-04'];
    if (!supportedForms.includes(formId)) {
      console.log(`❌ Validation failed: Unsupported formId: ${formId}`);
      return res.status(400).json({
        success: false,
        message: `Unsupported formId: ${formId}. Supported forms: ${supportedForms.join(', ')}`
      });
    }

    // Prepare request data
    const requestData = {
      formId,
      formData: formData || {},
      submittedBy: submittedBy || 'unknown',
      submitterName: submitterName || 'Unknown User',
      submitterEmail: submitterEmail || '',
      department: department || 'General',
      status: status,
      priority: priority,
      formType: formType || (formId === 'form-01' ? 'creation' : 
                            formId === 'form-02' ? 'approval' : 
                            formId === 'form-04' ? 'training' : 'unknown'),
      formName: formName || (formId === 'form-01' ? 'Document Creation Form' :
                           formId === 'form-02' ? 'Document Approval Request Form' :
                           formId === 'form-04' ? 'Training Schedule Form' : 'Unknown Form'),
      formNumber: formNumber || (formId === 'form-01' ? 'OF/DG/001' :
                               formId === 'form-02' ? 'OF/DG/002' :
                               formId === 'form-04' ? 'OF/DG/004' : 'N/A')
    };

    console.log('📝 Request data prepared:', {
      formId: requestData.formId,
      formName: requestData.formName,
      submitterName: requestData.submitterName,
      department: requestData.department
    });

    let savedRequest;
    let storageType = '';
    const isConnected = mongoose.connection.readyState === 1;

    // STRATEGY 1: Try MongoDB if connected
    if (isConnected) {
      console.log('💾 Attempting to save to MongoDB...');
      try {
        const newRequest = new FormRequest(requestData);
        savedRequest = await newRequest.save();
        storageType = 'mongodb';
        console.log(`✅ Saved to MongoDB! ID: ${savedRequest._id}`);
        console.log(`✅ Document details:`, {
          _id: savedRequest._id,
          formId: savedRequest.formId,
          formName: savedRequest.formName,
          createdAt: savedRequest.createdAt
        });
        
        // VERIFY the save actually happened
        console.log('🔍 Verifying document in database...');
        const verify = await FormRequest.findById(savedRequest._id);
        if (verify) {
          console.log(`✅ Verification PASSED - Document found in DB`);
        } else {
          console.error(`❌ Verification FAILED - Document not found after save!`);
          throw new Error('Document not found after save - verification failed');
        }
        
      } catch (mongoError) {
        console.error('❌ MongoDB save failed:', mongoError.message);
        console.error('❌ Error details:', mongoError);
        // Continue to in-memory fallback
      }
    }

    // STRATEGY 2: If MongoDB failed or not connected, use in-memory
    if (!savedRequest) {
      console.log('💾 Using in-memory storage...');
      savedRequest = {
        ...requestData,
        _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedLocally: true
      };
      inMemoryRequests.push(savedRequest);
      storageType = 'in-memory';
      console.log(`✅ Saved to in-memory. Total: ${inMemoryRequests.length}`);
    }

    // Return success response
    console.log(`🎉 Form submission COMPLETE - Saved to: ${storageType}`);
    res.status(201).json({
      success: true,
      message: `${requestData.formName} submitted successfully! (Saved to ${storageType})`,
      data: savedRequest,
      storage: storageType,
      mongodb: {
        connected: isConnected,
        readyState: mongoose.connection.readyState
      }
    });

  } catch (error) {
    console.error('❌ FORM SUBMISSION ERROR:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Emergency fallback
    try {
      console.log('🚨 Attempting emergency fallback save...');
      const fallbackRequest = {
        ...req.body,
        _id: `emergency_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        emergency: true,
        savedLocally: true
      };
      inMemoryRequests.push(fallbackRequest);
      
      console.log(`✅ Emergency save complete. Total: ${inMemoryRequests.length}`);
      
      res.status(201).json({
        success: true,
        message: 'Form submitted to emergency fallback storage',
        data: fallbackRequest,
        storage: 'emergency-fallback',
        warning: 'Multiple save attempts failed, using emergency storage',
        mongodb: {
          connected: mongoose.connection.readyState === 1,
          readyState: mongoose.connection.readyState
        }
      });
    } catch (fallbackError) {
      console.error('❌ Emergency fallback also failed:', fallbackError.message);
      res.status(500).json({
        success: false,
        message: 'Failed to save form - all storage methods failed',
        error: error.message,
        mongodb: {
          connected: mongoose.connection.readyState === 1,
          readyState: mongoose.connection.readyState
        }
      });
    }
  }
});

// 8. UPDATE REQUEST (for edit mode)
app.put('/api/requests/:id', async (req, res) => {
  console.log('\n✏️ ===== UPDATE FORM REQUEST =====');
  console.log('📦 Request ID:', req.params.id);
  console.log('📦 Update data:', JSON.stringify(req.body, null, 2));
  
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const isConnected = mongoose.connection.readyState === 1;
    
    if (!isConnected) {
      // Update in-memory
      const index = inMemoryRequests.findIndex(r => r._id === id);
      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: 'Request not found in local storage'
        });
      }
      
      inMemoryRequests[index] = {
        ...inMemoryRequests[index],
        ...updateData,
        updatedAt: new Date()
      };
      
      console.log('✅ Updated in-memory request');
      
      return res.json({
        success: true,
        message: 'Request updated successfully (in-memory)',
        data: inMemoryRequests[index],
        storage: 'in-memory'
      });
    }
    
    // Update in MongoDB
    const updatedRequest = await FormRequest.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found in database'
      });
    }
    
    console.log('✅ Updated MongoDB request:', updatedRequest._id);
    
    res.json({
      success: true,
      message: 'Request updated successfully',
      data: updatedRequest,
      storage: 'mongodb'
    });
    
  } catch (error) {
    console.error('❌ Update error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 9. TEST DATABASE CONNECTION - ENHANCED
app.get('/api/test-db', async (req, res) => {
  console.log('🧪 Testing database connection...');
  
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const dbName = mongoose.connection.db?.databaseName || 'Not connected';
    
    // Try to actually write and read
    let testWrite = null;
    let testRead = null;
    let writeSuccess = false;
    let writeError = null;
    
    if (isConnected) {
      try {
        console.log('📝 Creating test document...');
        // Write test document
        const testDoc = new FormRequest({
          formId: 'form-01',
          formData: { 
            test: 'database write test', 
            timestamp: new Date().toISOString(),
            server: 'Form Management Backend'
          },
          submittedBy: 'system',
          submitterName: 'System Test',
          submitterEmail: 'test@system.com',
          department: 'System',
          status: 'pending',
          formName: 'Test Form',
          formNumber: 'TEST/001'
        });
        
        testWrite = await testDoc.save();
        writeSuccess = true;
        console.log(`✅ Test document saved: ${testWrite._id}`);
        
        // Read it back
        console.log('🔍 Reading test document back...');
        testRead = await FormRequest.findById(testWrite._id);
        console.log(`✅ Test document read: ${!!testRead}`);
        
        // Count all documents
        const count = await FormRequest.countDocuments();
        console.log(`📊 Total documents in collection: ${count}`);
        
        // Get counts by form type
        const formCounts = await FormRequest.aggregate([
          { $group: { _id: "$formId", count: { $sum: 1 } } }
        ]);
        console.log('📊 Documents by form:', formCounts);
        
        // Clean up
        console.log('🧹 Cleaning up test document...');
        await FormRequest.deleteOne({ _id: testWrite._id });
        console.log('✅ Test document cleaned up');
        
      } catch (writeErr) {
        writeError = writeErr.message;
        console.error('❌ Test write failed:', writeErr.message);
        console.error('❌ Write error details:', writeErr);
      }
    }
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: isConnected,
        readyState: mongoose.connection.readyState,
        states: {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        }[mongoose.connection.readyState],
        databaseName: dbName,
        host: mongoose.connection.host || 'Not connected',
        port: mongoose.connection.port || 'Not connected',
        writeTest: writeSuccess ? 'PASSED' : 'FAILED',
        writeError: writeError,
        testWriteId: testWrite?._id?.toString() || null,
        testReadSuccess: !!testRead
      },
      formsSupported: ['form-01', 'form-02', 'form-04'],
      inMemory: {
        count: inMemoryRequests.length,
        sample: inMemoryRequests.slice(0, 3).map(r => ({
          _id: r._id,
          formId: r.formId,
          formName: r.formName,
          createdAt: r.createdAt
        }))
      },
      environment: {
        MONGODB_URI: process.env.MONGODB_URI || 'Not set',
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: PORT
      }
    });
  } catch (error) {
    console.error('❌ Database test error:', error.message);
    res.json({
      success: false,
      error: error.message,
      inMemory: {
        count: inMemoryRequests.length
      }
    });
  }
});

// 10. CLEAR IN-MEMORY STORAGE (for testing)
app.delete('/api/clear-memory', (req, res) => {
  const count = inMemoryRequests.length;
  inMemoryRequests = [];
  res.json({
    success: true,
    message: `Cleared ${count} in-memory requests`,
    cleared: count
  });
});

// 11. GET SERVER STATS
app.get('/api/stats', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    
    let mongoStats = {};
    if (isConnected) {
      const total = await FormRequest.countDocuments();
      const byForm = await FormRequest.aggregate([
        { $group: { _id: "$formId", count: { $sum: 1 } } }
      ]);
      const byStatus = await FormRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      
      mongoStats = { total, byForm, byStatus };
    }
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      mongodb: {
        connected: isConnected,
        stats: mongoStats
      },
      memory: {
        count: inMemoryRequests.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ========== ERROR HANDLING ==========
app.use((req, res, next) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET  /',
      'GET  /api/health',
      'GET  /api/requests',
      'POST /api/requests',
      'PUT  /api/requests/:id',
      'GET  /api/requests/:id',
      'GET  /api/requests/count',
      'GET  /api/forms/:formId',
      'GET  /api/stats',
      'GET  /api/test-db',
      'DELETE /api/clear-memory'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log('===============================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Base URL: http://localhost:${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Forms endpoint: http://localhost:${PORT}/api/requests`);
  console.log(`🔍 Test DB: http://localhost:${PORT}/api/test-db`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔄 MongoDB State: ${mongoose.connection.readyState}`);
  console.log('===============================================');
  
  // Initial connection check
  const isConnected = mongoose.connection.readyState === 1;
  if (!isConnected) {
    console.log('⚠️  WARNING: MongoDB not connected on startup');
    console.log('⚠️  Forms will be saved to in-memory storage');
    console.log('⚠️  Check your MongoDB installation and connection string');
  }
});