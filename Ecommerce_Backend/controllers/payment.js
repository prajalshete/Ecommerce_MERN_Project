const Payment = require('../models/paymentModel');
const stripe = require('stripe')('sk_test_51QXdnDFqTFeDjJYRcXC1KsaskV548Dbpur3r7fQk6HRRMufVrZdC5TIJ2HKuJC1tOUh0SxRrJj3jiKqRmpbBh1iq00ojNqOqrr'); // Replace with your actual secret key

const createPaymentIntent = async (userId, amount) => {
    console.log('Received amount in INR:', amount);  // Debugging line
    console.log('Received userId:', userId);  // Debugging line

    // Convert amount to a number if it's a string
    amount = Number(amount);

    // Ensure the amount is a valid number
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
    }

    // Convert amount from INR to paisa for Stripe (100 paisa = 1 INR)
    const amountInPaisa = amount * 100;

    console.log('Converted amount in paisa:', amountInPaisa); // Debugging line

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInPaisa, // Amount in paisa for Stripe
            currency: 'inr', // Currency set to INR
            payment_method_types: ['card'],
        });

        // Save payment details to the database in INR
        const payment = new Payment({
            userId,
            amount, // Save amount in INR (not paisa)
            currency: 'inr',
            stripePaymentId: paymentIntent.id,
            status: 'pending',
        });

        await payment.save();
        

        return paymentIntent.client_secret;
    } catch (error) {
        throw new Error('Payment creation failed: ' + error.message);
    }
};



// Function to delete a payment by ID
async function deletePayment(paymentId) {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    return deletedPayment;
}


module.exports = { createPaymentIntent,deletePayment };
