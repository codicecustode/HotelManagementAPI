import { Document } from 'mongoose';
export interface IRoom extends Document {
  roomName: string;
  roomSlug: string;
  roomType: 'single' | 'couple' | 'family';
  roomPrice: number;
  roomCapacity: number;
  roomDescription: string;
  roomImages: { url: string }[];
  roomStatus: 'available' | 'booked' | 'maintenance';
  extraFacilities: string[];
  petAllowed: boolean;
  isFeatured: boolean;
  breakfast: boolean;
  airConditioned: boolean;
  createdBy: Object;
  createdAt: Date;
  updatedAt: Date;
}