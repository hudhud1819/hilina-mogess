// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient Information
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Notification Details
  type: {
    type: String,
    enum: [
      'new_request',       // New request submitted
      'request_approved',  // Request approved
      'request_rejected',  // Request rejected
      'correction_needed', // Request needs correction
      'sla_warning',       // SLA deadline approaching
      'sla_overdue',       // SLA overdue
      'bulk_approved',     // Bulk approval
      'bulk_rejected',     // Bulk rejection
      'system_alert',      // System notifications
      'info'              // General information
    ],
    required: true
  },
  
  title: {
    type: String,
    required: true
  },
  
  message: {
    type: String,
    required: true
  },
  
  // Associated Request (if any)
  requestId: {
    type: String,
    index: true
  },
  
  // Sender Information
  senderId: String,
  senderName: String,
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Status
  read: {
    type: Boolean,
    default: false
  },
  
  delivered: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: true
  }
}, {
  timestamps: true
});

// Indexes for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ requestId: 1, type: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

module.exports = mongoose.model('Notification', notificationSchema);