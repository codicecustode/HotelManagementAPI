import { Request, Response } from 'express';
import { IUser } from '../models/user.model';
import { User } from '../models/user.model';
const registerUser = async (req: Request, res: Response) => {
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
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const isUserExist = await User.findOne({
      $or: [{ email }, { phone }, { userName }],
    });

    if (isUserExist) {
      return res.status(400).json({ message: 'User already exist' });
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

    return res.status(200).json({
      message: 'User created successfully',
      createdUser: user,
    });
  } catch (error: any) {
    return res.status(500)
      .json({ message: 'Internal Server Error', error: error.message });
  }
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { userType } = req.query;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if(user.verified === false) {
    return res.status(400).json({ message: 'User not verified' });
  }

  if (userType === 'admin') {
    if (user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized user' });
    }
  }

  if (user.status === 'blocked') {
    return res.status(401).json({ message: 'User is blocked' });
  }

  const isPasswordMatch = user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
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
  const refreshToken = user.generateRefrshToken();

  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  return res.status(200)
    .cookie('accessToken', accessToken, options)
    .json({
      message: 'User logged in successfully',
      accessToken,
      refreshToken,
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
}

export {
  registerUser,
  loginUser
}



