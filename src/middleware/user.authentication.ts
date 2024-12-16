import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; // Adjust the path as necessary
import crypto from 'crypto';

const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const user = await User.findById((decodedToken as jwt.JwtPayload)._id);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (user.status === 'blocked') {
      res.status(401).json({ message: 'User blocked' });
      return;
    }

    if (user.status === 'logout') {
      res.status(401).json({ message: 'User logged out' });
      return;
    }
    if(user.verified !== false){
      if (user.status === 'login') {
        req.user = user;
      }
    }
  }
  catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  next();
};

const isRefreshTokenValid = async (req: Request, res: Response, next: NextFunction) => {

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: 'Access denied. No token provided' });
    return;
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY as string);
    const user = await User.findById((decodedToken as jwt.JwtPayload)._id);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    req.user = user;
  }
  catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  next();
}

const isPasswordResetTokenValid = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.resetPasswordToken;
  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided for restting the password' });
    return;
  }
  const resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');
  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid token or token expired' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}

const isUserAdmin = async(req: Request, res: Response, next:NextFunction) => {
  try{
    const { user } = req;
    if(!user){
      res.status(401).json({message: 'Access denied. No token provided'});
      return;
    }
    if(user.role !== 'admin'){
      res.status(403).json({message: 'Access denied. Admin only'});
      return;
    }
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in isUserAdmin middleware:', error.message);
    } else {
      console.error('Unknown error in isUserAdmin middleware');
    }
    res.status(500).json({ message: 'Internal server error' });
  }

}

export {
  isUserAuthenticated,
  isRefreshTokenValid,
  isPasswordResetTokenValid
};