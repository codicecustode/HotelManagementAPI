//has to improve consistensy in errro handling
//has to improve formatting of errro and response messages
import { RequestHandler, Request, Response } from 'express'
import { IRoom } from '../types/room.type'
import { Room } from '../models/room.model'
import fs from 'fs'

const deleteFiles = async (files: Express.Multer.File[]) => {

  try {
    await Promise.all(files.map(file => fs.promises.unlink(file.path)))
    return;
  } catch (error) {
    console.log(error)
    return;
  }
}

const createRoom: RequestHandler = async (req: Request, res: Response) => {

  const { roomName, roomSlug, roomType, roomPrice, roomCapacity, roomDescription,
    extraFacilities, isPetAllowed, isFeatured, isBreakfastProvide, isAirConditioned
  }: IRoom = req.body

  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [];

  if (!files || files.length === 0) {
    res.status(400).json({ message: 'Room images are required' })
    return
  }

  if (!roomName) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room name is required' })
    return
  }

  if (!roomSlug) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room slug is required' })
    return
  }

  if (!roomType) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room type is required' })
    return
  }

  if (!roomPrice) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room price is required' })
    return
  }

  if (!roomCapacity) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room capacity is required' })
    return
  }

  if (!roomDescription) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Room description is required' })
    return
  }

  if (!extraFacilities) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Extra Facilities is required' })
    return
  }

  if (!isPetAllowed) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Pet allowed info required' })
    return
  }

  if (!isAirConditioned) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Airconditionded info required' })
    return
  }

  if (!isBreakfastProvide) {
    await deleteFiles(files)
    res.status(400).json({ message: 'Breakfast Provide info required' })
    return
  }


  try {
    const room = await new Room({
      roomName,
      roomSlug,
      roomType,
      roomPrice,
      roomCapacity,
      roomDescription,
      roomImages: files.map((file) => ({ url: file.path })),
      extraFacilities,
      isPetAllowed,
      isFeatured,
      isBreakfastProvide,
      isAirConditioned,
      createdBy: req.user._id
    })
    try{
      await room.save()
    }catch(error){
      await deleteFiles(files)
      res.status(400).json({ 
        message: 'error while saving the room data in DB',
        error: error
      })
      return
    }
    await room.save()
    res.status(201).json({ message: 'Room created successfully', room })
    return
  } catch (error) {
    await deleteFiles(files)
    console.log(error)
    res.send(error)
    return
  }

}



export { createRoom }
