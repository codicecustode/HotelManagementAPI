import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface IUser extends Document {
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

const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
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
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    required: [true, 'Password is required'],
    select: false,
  },
  phone: {
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
    this.userName = this.userName.toLowerCase().trim().replace(/\s/g, '');
  }
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//custom methods
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.JWT_ACCESS_EXPIRES as string });
  return token;
}

userSchema.methods.generateRefrshToken = function (): string {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: process.env.JWT_REFRESH_EXPIRES as string });
  return token;
}

userSchema.methods.generateEmailVerificationToken = function (): string {
  const token = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
}

userSchema.methods.generateResetPasswordToken = function (): string {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return token;
}


const User =  mongoose.model<IUser>('User', userSchema);