const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create new request
router.post('/', requestController.createRequest);

// Get request by ID
router.get('/:id', requestController.getRequestById);

// Update request
router.put('/:id', requestController.updateRequest);

// Delete request
router.delete('/:id', requestController.deleteRequest);

// Get user's requests
router.get('/user/:userId', requestController.getUserRequests);

// Search requests
router.get('/', requestController.searchRequests);

module.exports = router;