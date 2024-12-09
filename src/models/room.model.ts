import mongoose, { Schema } from 'mongoose'
import { IRoom } from '../types/room.type'
const roomSchema = new Schema<IRoom>({
  roomName: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true,
    trim: true,
    index: true,
  },
  roomSlug: {
    type: String,
    required: [true, 'Room slug is required'],
    unique: true,
    trim: true,
    index: true,
  },
  roomType: {
    type: String,
    required: [true, 'Room type is required'],
    enum: ['single', 'couple', 'family']
  },
  roomPrice: {
    type: Number,
    required: [true, 'Room price is required']
  },
  roomCapacity: {
    type: Number,
    required: [true, 'Room capacity is required']
  },
  roomDescription: {
    type: String,
    required: [true, 'Room description is required']
  },
  roomImages: {
    type: [{ url: String }],
    required: [true, 'Room images are required']
  },
  roomStatus: {
    type: String,
    enum: ['available', 'booked', 'maintenance']
  },
  extraFacilities: {
    type: [String],
    required: [true, 'Extra facilities are required']
  },
  petAllowed: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  breakfast: {
    type: Boolean,
    default: false,
  },
  airConditioned: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const Room = mongoose.model<IRoom>('Room', roomSchema)