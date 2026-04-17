import { Request, Response } from 'express';
import Equipment from '../models/Equipment';

export const getAllEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, department, type, search, page = '1', limit = '10' } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { assignedTech: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [equipment, total] = await Promise.all([
      Equipment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Equipment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: equipment,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching equipment' });
  }
};

export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      res.status(404).json({ success: false, message: 'Equipment not found' });
      return;
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json({ success: true, data: equipment });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      res.status(400).json({ success: false, message: 'Serial number already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Server error creating equipment' });
  }
};

export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!equipment) {
      res.status(404).json({ success: false, message: 'Equipment not found' });
      return;
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating equipment' });
  }
};

export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      res.status(404).json({ success: false, message: 'Equipment not found' });
      return;
    }
    res.json({ success: true, message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting equipment' });
  }
};

export const updateEquipmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!equipment) {
      res.status(404).json({ success: false, message: 'Equipment not found' });
      return;
    }
    res.json({ success: true, data: equipment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
