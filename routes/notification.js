// routes/notification.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Helper function to send notifications via WebSocket
const sendNotificationViaSocket = (io, userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('new-notification', notification);
    console.log(`📤 Socket notification sent to user ${userId}: ${notification.title}`);
  }
};

// Create notification (internal use, not exposed as API)
const createNotification = async (notificationData, io = null) => {
  try {
    const notification = new Notification(notificationData);
    const savedNotification = await notification.save();
    
    // Send via WebSocket if recipient is online
    sendNotificationViaSocket(io, notificationData.userId, savedNotification);
    
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get all notifications for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, unreadOnly = false, type, page = 1 } = req.query;
    
    let filter = { userId };
    
    // Apply filters
    if (unreadOnly === 'true') {
      filter.read = false;
    }
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;
    
    // Get notifications with pagination
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    
    // Get counts
    const totalCount = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: pageNumber,
          pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        },
        counts: {
          total: totalCount,
          unread: unreadCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
});

// Get notification summary/counts
router.get('/user/:userId/summary', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get counts by type
    const countsByType = await Notification.aggregate([
      { $match: { userId } },
      { $group: {
        _id: '$type',
        total: { $sum: 1 },
        unread: { 
          $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } 
        }
      }},
      { $sort: { total: -1 } }
    ]);
    
    // Get total counts
    const totalCount = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      read: false 
    });
    
    // Get recent notifications (last 5)
    const recentNotifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        summary: {
          total: totalCount,
          unread: unreadCount,
          read: totalCount - unreadCount
        },
        byType: countsByType,
        recent: recentNotifications
      }
    });
  } catch (error) {
    console.error('Error fetching notification summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification summary',
      error: error.message
    });
  }
});

// Get notification by ID
router.get('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification',
      error: error.message
    });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { 
        read: true,
        delivered: true 
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
});

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { 
        read: true,
        delivered: true 
      }
    );
    
    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: {
        markedCount: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
});

// Clear all notifications for a user
router.delete('/user/:userId/clear-all', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await Notification.deleteMany({ userId });
    
    res.json({
      success: true,
      message: `Cleared ${result.deletedCount} notifications`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing notifications',
      error: error.message
    });
  }
});

// Archive old notifications (keep last 100)
router.post('/user/:userId/archive', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get all notifications for user, sorted by date
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });
    
    if (notifications.length <= 100) {
      return res.json({
        success: true,
        message: 'No notifications to archive (under 100)',
        data: { archivedCount: 0 }
      });
    }
    
    // Get IDs of notifications to delete (keep first 100)
    const notificationsToDelete = notifications.slice(100);
    const deleteIds = notificationsToDelete.map(n => n._id);
    
    const result = await Notification.deleteMany({
      _id: { $in: deleteIds }
    });
    
    res.json({
      success: true,
      message: `Archived ${result.deletedCount} old notifications`,
      data: {
        archivedCount: result.deletedCount,
        remainingCount: 100
      }
    });
  } catch (error) {
    console.error('Error archiving notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving notifications',
      error: error.message
    });
  }
});

// Search notifications
router.get('/user/:userId/search', async (req, res) => {
  try {
    const { userId } = req.params;
    const { q, type, priority, dateFrom, dateTo } = req.query;
    
    let filter = { userId };
    
    // Text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Type filter
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Priority filter
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: {
        notifications,
        count: notifications.length
      }
    });
  } catch (error) {
    console.error('Error searching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching notifications',
      error: error.message
    });
  }
});

// Get notification types available for a user
router.get('/user/:userId/types', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const types = await Notification.aggregate([
      { $match: { userId } },
      { $group: {
        _id: '$type',
        count: { $sum: 1 },
        unreadCount: { 
          $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } 
        }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error fetching notification types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification types',
      error: error.message
    });
  }
});

// Export both router and helper functions
module.exports = {
  router,
  createNotification,
  sendNotificationViaSocket
};