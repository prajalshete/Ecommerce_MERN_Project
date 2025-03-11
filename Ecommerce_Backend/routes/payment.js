// routes/payment.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/payment');
const { deletePayment } = require('../controllers/payment');




// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { userId, amount } = req.body;  // Destructure userId and amount from the body
        console.log('Received userId:', userId);  // Debugging line
        console.log('Received amount:', amount);  // Debugging line

        const clientSecret = await createPaymentIntent(userId, amount);
        res.send({ clientSecret }); // Send the client secret to the frontend
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



// Route to delete a payment record
router.delete('/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;
        const deletedPayment = await deletePayment(paymentId);

        if (!deletedPayment) {
            return res.status(404).send({ message: 'Payment not found' });
        }

        res.send({ message: 'Payment deleted successfully', deletedPayment });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;
