import { Request, Response } from 'express';
import ServiceRequest from '../models/ServiceRequest';

export const getAllServiceRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { priority, status } = req.query;
    const filter: Record<string, unknown> = {};
    if (priority) filter.priority = priority;
    if (status) filter.status = status;

    const requests = await ServiceRequest.find(filter)
      .populate('equipment', 'name serialNumber department')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getServiceRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await ServiceRequest.findById(req.params.id).populate('equipment', 'name serialNumber');
    if (!request) {
      res.status(404).json({ success: false, message: 'Service request not found' });
      return;
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createServiceRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await ServiceRequest.create(req.body);
    const populated = await request.populate('equipment', 'name serialNumber department');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating service request' });
  }
};

export const updateServiceRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('equipment', 'name serialNumber');
    if (!request) {
      res.status(404).json({ success: false, message: 'Service request not found' });
      return;
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateServiceRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const update: Record<string, unknown> = { status };
    if (status === 'Resolved') update.resolvedAt = new Date();

    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).populate('equipment', 'name serialNumber');
    if (!request) {
      res.status(404).json({ success: false, message: 'Service request not found' });
      return;
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
