import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; // Adjust the path as necessary

const isUserAuthenticated = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['Authorization'];
  const token = Array.isArray(authHeader) ? authHeader[0].split(' ')[1] : authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    const user = await User.findById((decodedToken as jwt.JwtPayload)._id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(401).json({ message: 'User blocked' });
    }

    if (user.status === 'login') {
      req.user = user;
    }
  }
  catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next();
  }



  export { 
    isUserAuthenticated 
  };