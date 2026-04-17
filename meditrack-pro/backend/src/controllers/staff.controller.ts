import { Request, Response } from 'express';
import Staff from '../models/Staff';

export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.find().populate('assignedEquipment', 'name serialNumber').sort({ name: 1 });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching staff' });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findById(req.params.id).populate('assignedEquipment', 'name serialNumber department');
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating staff' });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff member not found' });
      return;
    }
    res.json({ success: true, message: 'Staff member deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
