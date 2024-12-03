import { Request, Response } from 'express';
import { IUser } from '../models/user.model';
import { User } from '../models/user.model';
export const registerUser = async (req: Request, res: Response) => {
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

    if(!userName || !fullName || !email || !password || !phone || !address || !role){
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
      avtar: req.file?.filename,
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

