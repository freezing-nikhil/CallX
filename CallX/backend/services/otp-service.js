const crypto = require("crypto");
const hashService = require("./hash-service");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey("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");


const twilio = require("twilio")(
  "AC2f15c951a25db3dc5373af11dd7b3334",
  "4ddc3804020a61e2bedcae56c3831d55",
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
      messagingServiceSid: "MGb44c98ba494e83d6314b28c6f1cdbc49",
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
