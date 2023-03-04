const cron = require('node-cron');
const Booking = require('./models/Bookings.js');
const Place = require('./models/Places.js');

function setupCronJob(){
  // Run this task every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log("cron running")
    const currentDate = new Date();
    // Find all bookings where the checkout time has passed
    const expiredBookings = await Booking.find({ checkOut: { $lt: currentDate } });
    
    // Delete the expired bookings
    await Booking.deleteMany({ checkOut: { $lt: currentDate } });
    
    // Update the status of the places associated with the expired bookings
    for (const booking of expiredBookings) {
      await Place.updateOne({ _id: booking.placeId }, { isBooked: false });
    }
  }, {
    timezone: 'Asia/Kolkata', // Change this to your timezone
  });
}

module.exports = setupCronJob;