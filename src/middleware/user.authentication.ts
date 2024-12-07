import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; // Adjust the path as necessary

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



export {
  isUserAuthenticated,
  isRefreshTokenValid
};