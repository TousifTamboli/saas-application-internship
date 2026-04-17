import { Request, Response } from 'express';
import MaintenanceLog from '../models/MaintenanceLog';

export const getAllMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, equipment } = req.query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (equipment) filter.equipment = equipment;

    const logs = await MaintenanceLog.find(filter)
      .populate('equipment', 'name serialNumber department')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching maintenance logs' });
  }
};

export const getMaintenanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = await MaintenanceLog.findById(req.params.id).populate('equipment', 'name serialNumber');
    if (!log) {
      res.status(404).json({ success: false, message: 'Maintenance log not found' });
      return;
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = await MaintenanceLog.create(req.body);
    const populated = await log.populate('equipment', 'name serialNumber department');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating maintenance log' });
  }
};

export const updateMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('equipment', 'name serialNumber');
    if (!log) {
      res.status(404).json({ success: false, message: 'Maintenance log not found' });
      return;
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMaintenance = async (req: Request, res: Response): Promise<void> => {
  try {
    const log = await MaintenanceLog.findByIdAndDelete(req.params.id);
    if (!log) {
      res.status(404).json({ success: false, message: 'Maintenance log not found' });
      return;
    }
    res.json({ success: true, message: 'Maintenance log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
