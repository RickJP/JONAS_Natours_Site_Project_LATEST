/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe('pk_test_QtcBKPRHkF7O6y8md2OX0LPR');

export const bookTour = async tourId => {
  // Get  checkout session from API
  try {
    const session = await axios(`http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);
    // Create checkout form + charge credit card
    console.log(session);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch  (err){
      console.log(err);
      showAlert('error', err);
  }
 
};