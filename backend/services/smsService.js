const twilio = require('twilio');

async function sendEmergencySMS({ toPhone, vehicleNumber, emergencyType, details, location }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER || '+18005550199';

  const smsMessage = `🚨 [PULSETRANSIT SOS EMERGENCY ALERT] 🚨\nVehicle: ${vehicleNumber}\nType: ${emergencyType}\nPhone: ${toPhone}\nLocation: Lat ${location?.[1] || 13.0827}, Lng ${location?.[0] || 80.2707}\nDetails: ${details}\n\nDispatched to Tamil Nadu Transport Control Room & PCR Patrol.`;

  // Check if real Twilio credentials are configured
  if (accountSid && accountSid.startsWith('AC') && authToken && authToken !== 'your_twilio_auth_token_here') {
    try {
      const client = twilio(accountSid, authToken);
      const message = await client.messages.create({
        body: smsMessage,
        from: fromPhone,
        to: toPhone
      });

      console.log(`[TWILIO LIVE SMS SUCCESS] Message SID: ${message.sid} sent to ${toPhone}`);
      return {
        success: true,
        provider: 'TWILIO_LIVE',
        messageSid: message.sid,
        toPhone
      };
    } catch (err) {
      console.error(`[TWILIO SMS ERROR] Failed to send live SMS via Twilio: ${err.message}`);
      return {
        success: false,
        provider: 'TWILIO_LIVE_FAILED',
        error: err.message
      };
    }
  } else {
    console.log(`[SMS DISPATCH SIMULATOR] Twilio credentials placeholder detected. Simulated SMS sent to ${toPhone}:\n${smsMessage}`);
    return {
      success: true,
      provider: 'SIMULATED_GATEWAY',
      toPhone
    };
  }
}

module.exports = { sendEmergencySMS };
