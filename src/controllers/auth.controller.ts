import { Request, Response, RequestHandler } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.type';
import { User } from '../models/user.model';
import { sendEmail } from '../utils/send.email';

const registerUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    const {
      userName,
      fullName,
      email,
      password,
      phone,
      address,
      gender,
      dob,
      role
    }: IUser = req.body;

    if (!userName || !fullName || !email || !password || !phone || !address || !role) {
      res.status(400).json({ message: 'All fields are required' });
      return
    }
    console.log(req.file);
    if (!req.file) {
      res.status(400).json({ message: 'Please upload an image' });
      return
    }

    const isUserExist = await User.findOne({
      $or: [{ email }, { phone }, { userName }],
    });

    if (isUserExist) {
      res.status(400).json({ message: 'User already exist' });
      return
    }

    const user = new User({
      userName,
      fullName,
      email,
      password,
      phone,
      address,
      gender,
      dob,
      role,
      avtar: req.file ? `uploads/${req.file.filename}` : 'avtar.png',
    });

    await user.save();

    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();
    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json({
        message: 'User created successfully',
        createdUser: user
      });
    return
  } catch (error: any) {
    res.status(500)
      .json({
        message: 'Internal Server Error',
        error: error.message
      });
    return
  }
};

const loginUser: RequestHandler  = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const { userType } = req.query;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  if (user.verified === false) {
    res.status(400).json({ message: 'User not verified' });
    return;
  }

  if (userType === 'admin') {
    if (user.role !== 'admin') {
      res.status(401).json({ message: 'Unauthorized user' });
      return;
    }
  }

  if (user.status === 'blocked') {
    res.status(401).json({ message: 'User is blocked' });
    return;
  }

  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const loggedUser = User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        status: 'login',
        updatedAt: new Date(),
      }
    },
    { new: true },
  )

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.status = 'login';
  await user.save({ validateBeforeSave: false });

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      message: 'User logged in successfully',
      result: {
        id: user._id,
        userName: user.userName,
        name: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avtar: user.avtar,
        gender: user.gender,
        role: user.role,
        dob: user.dob,
        status: user.status
      },
    });
};

const logoutUser: RequestHandler = async (req: Request, res: Response) => {
  
  try {
    const { user } = req;

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const loggedOutUser = User.findByIdAndUpdate(
      user._id,
      { status: 'logout' },
      { new: true }
    );

    res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json({ 
      message: 'User logged out successfully' 
    });
    return;
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return;
  }
}

const sendEmailVerificationLink: RequestHandler = async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided for email verification' });
    return;
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

  const user = await User.findById((decodedToken as jwt.JwtPayload)._id);

  if (!user) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  if (user.verified === true) {
    res.status(400).json({ message: 'User already verified' });
    return;
  }

  const emailVerificationToken = user.generateEmailVerificationToken();

  await user.save({ validateBeforeSave: false });

  const emailVerificationLink = `${process.env.CLIENT_URL}/auth/email-verification/${emailVerificationToken}`;
  
  const subject = 'User Email Verification from Nodemailer App';

  const text = 'Email Verification';

  const htmlMessage = `
    <p>This is a <b>User Verification mail</b> sent using Nodemailer.</p>
    <p>Click here <a href="${emailVerificationLink}" target="_blank">${emailVerificationLink}</a> to verify email</p>
  `;

  try {
    await sendEmail(user.email, subject, text, htmlMessage);
    res.status(200).json({ message: 'Email verification link sent' });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    return;
  }

}

const verifyEmail: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ message: 'token is required' });
      return;
    }

    const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.status = 'login';
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Email verified successfully' });
    return;
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    return;
  }
}

const refreshAccessToken: RequestHandler = async (req: Request, res: Response) => {

  const cookieRefreshToken = req.cookies.refreshToken;

  if (!cookieRefreshToken) {
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }

  const { user } = req;
  const token = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200)
    .cookie('refreshToken', refreshToken, options)
    .json({
      token,
      message: 'Token refreshed successfully',
    });
  return;
}







export {
  registerUser,
  loginUser,
  sendEmailVerificationLink,
  refreshAccessToken,
  verifyEmail,
  logoutUser
}



