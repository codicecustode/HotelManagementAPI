import { Document } from 'mongoose';
export interface IUser extends Document {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  avtar?: string;
  gender?: 'male' | 'female';
  dob: Date;
  address: string;
  role: 'user' | 'admin';
  verified: boolean;
  status: 'register' | 'login' | 'logout' | 'blocked';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Custom Methods
  generateAuthToken(): string;
  generateRefrshToken(): string;
  generateEmailVerificationToken(): string;
  generateResetPasswordToken(): string;
  comparePassword(password: string): boolean;
}