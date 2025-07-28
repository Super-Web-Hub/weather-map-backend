const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
router.post('/payments', paymentController.createPayment);

// Get all payments
router.get('/payments', paymentController.getAllPayments);

// Get a single payment by ID
router.get('/payments/:id', paymentController.getPaymentById);

// Update a payment by ID
router.put('/payments/:id', paymentController.updatePayment);

// Delete a payment by ID
router.delete('/payments/:id', paymentController.deletePayment);

module.exports = router;    