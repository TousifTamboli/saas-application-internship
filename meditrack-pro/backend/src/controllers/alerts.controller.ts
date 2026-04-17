import { Request, Response } from 'express';
import Alert from '../models/Alert';

export const getAllAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const alerts = await Alert.find()
      .populate('equipment', 'name serialNumber')
      .sort({ isRead: 1, createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching alerts' });
  }
};

export const createAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating alert' });
  }
};

export const markAlertAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!alert) {
      res.status(404).json({ success: false, message: 'Alert not found' });
      return;
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteAlert = async (req: Request, res: Response): Promise<void> => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      res.status(404).json({ success: false, message: 'Alert not found' });
      return;
    }
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const clearAllAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    await Alert.deleteMany({});
    res.json({ success: true, message: 'All alerts cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
