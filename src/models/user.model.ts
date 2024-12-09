import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { IUser } from '../types/user.type';

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    index: true,
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required:  [true, 'Email is required'],
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    required: [true, 'Password is required'],
    select: false,
  },
  phone: {
    type: String,
    index: true,
    unique: true,
  },
  address: {
    type: String,
  },
  avtar: {
    type: String
  },
  gender:{
    type: String,
    enum: ['male', 'female'],
  },
  dob: {
    type: Date
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['register', 'login', 'logout', 'blocked'],
    default: 'register',
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
//
userSchema.pre('save', async function (next) {
  if(this.userName){
    (this as IUser).userName = this.userName.toLowerCase().trim().replace(/\s/g, '');
  }
  if(this.isModified('password')){
    (this as IUser).password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//custom methods
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  const user = await mongoose.model('User').findById(this._id).select('+password');
  return await bcrypt.compare(password, user?.password);
}

userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.JWT_ACCESS_EXPIRES as string });
  return token;
}

userSchema.methods.generateRefreshToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.JWT_REFRESH_EXPIRES as string });
  return token;
}

userSchema.methods.generateEmailVerificationToken = function (): string {
  const token = crypto.randomBytes(20).toString('hex');
  (this as IUser).emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  (this as IUser).emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
}

userSchema.methods.generateResetPasswordToken = function (): string {
  const token = crypto.randomBytes(20).toString('hex');
  (this as IUser).resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  (this as IUser).resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
}


export const User =  mongoose.model<IUser>('User', userSchema);