import { Request, Response } from 'express';
import { IUser } from '../models/user.model';
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

    console.log(req);
    return res.status(200).json({
      request: req.body,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
  }
}