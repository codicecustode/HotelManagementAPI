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
  isPetAllowed: boolean;
  isFeatured: boolean;
  isBreakfastProvide: boolean;
  isAirConditioned: boolean;
  createdBy: Object;
  createdAt: Date;
  updatedAt: Date;
}