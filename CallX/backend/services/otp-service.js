const crypto = require("crypto");
const hashService = require("./hash-service");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("");


const twilio = require("twilio")(
 
  { lazyLoading: true }
);

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(1000, 9999);
    return otp;
  }

  async sendBySms(phone, otp) {
  try {
    const phoneClean = phone.replace(/\D/g, '');
    const message = await twilio.messages.create({
      body: `Your OTP is ${otp} valid for 2 minutes`,
      messagingServiceSid: "",
      to: `+91${phoneClean}`,
    });
    return message;
  } catch (err) {
    console.error("Twilio error:", err);
    throw err; 
  }
}

  async SendOtpByMail(email, otp) {
    const msg = {
      to: email,
      from:"nikhilsangale9616@gmail.com" ,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 2 minutes.`,
    };
     return await sgMail.send(msg);
  }

  verifyOtp(hashedOtp, data) {
    let computedHash = hashService.hashOtp(data);
    return computedHash === hashedOtp;
  }
}

module.exports = new OtpService();
