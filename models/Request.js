const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  formId: {
    type: String,
    required: true,
    index: true
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedBy: {
    type: String,
    required: true,
    index: true
  },
  submitterName: {
    type: String,
    required: true
  },
  submitterEmail: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  approvalChain: [{
    approverId: String,
    approverName: String,
    approverEmail: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    comments: String,
    approvedAt: Date
  }],
  currentApprover: {
    approverId: String,
    approverName: String,
    approverEmail: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  completedAt: Date,
  comments: [{
    userId: String,
    userName: String,
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Update updatedAt on save
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes
requestSchema.index({ formId: 1, submittedBy: 1 });
requestSchema.index({ status: 1, createdAt: -1 });
requestSchema.index({ 'approvalChain.approverId': 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);