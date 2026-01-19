const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");

class AuthController {
  async sendOtp(req, res) {
    const { phone, email } = req.body;
    if ((!email && !phone) || (email && phone)) {
      return res.status(400).json({
        message: "Provide exactly one: either email or phone, not both!",
      });
    }

    const otp = await otpService.generateOtp();

    const ttl = 1000 * 60 * 2;
    const expires = Date.now() + ttl;
    let data;
    if (phone) {
      data = `${phone}.${otp}.${expires}`;
    }
    if (email) {
      data = `${email}.${otp}.${expires}`;
    }
    const hash = hashService.hashOtp(data);

    // send OTP
    try {
      if (phone) {
        await otpService.sendBySms(phone, otp);
        res.json({
          hash: `${hash}.${expires}`,
          phone,
        });
      }
      if (email) {
        await otpService.SendOtpByMail(email, otp);
        res.json({
          hash: `${hash}.${expires}`,
          email,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "message sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone, email } = req.body;
    if (!otp || !hash) {
      res.status(400).json({ message: "All fields are required!" });
    }
    if ((!email && !phone) || (email && phone)) {
      return res.status(400).json({
        message: "Provide exactly one: either email or phone, not both!",
      });
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired!" });
    }
    let data;
    if (phone) {
      data = `${phone}.${otp}.${expires}`;
    }
    if (email) {
      data = `${email}.${otp}.${expires}`;
    }
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
    }

    let user;
    try {
        if(phone){
            user = await userService.findUser({ phone });
        }
        if(email){
            user = await userService.findUser({ email });
        }
      if (!user) {
         if(phone){
            user = await userService.createUser({ phone });
        }
        if(email){
            user = await userService.createUser({ email });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Db error" });
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async refresh(req, res) {

    const { refreshToken: refreshTokenFromCookie } = req.cookies;

    let userData;
    try {
      userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    try {
      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie,
      );
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
      return res.status(404).json({ message: "No user" });
    }

    const { refreshToken, accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });


    try {
      await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
      return res.status(500).json({ message: "Internal error" });
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async logout(req, res) {
    const { refreshToken } = req.cookies;

    await tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.json({ user: null, auth: false });
  }
}

module.exports = new AuthController();
