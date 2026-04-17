import { Request, Response } from 'express';
import Equipment from '../models/Equipment';
import MaintenanceLog from '../models/MaintenanceLog';
import { subMonths, subDays, format, eachWeekOfInterval, eachDayOfInterval } from 'date-fns';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalMachines = await Equipment.countDocuments();
    const underMaintenance = await Equipment.countDocuments({ status: 'Maintenance' });
    const onlineConsultsEquipment = await Equipment.countDocuments({ type: 'Online Consult', status: 'Active' });
    const offlineCount = await Equipment.countDocuments({ status: 'Offline' });
    const uptimeRate = totalMachines > 0
      ? (((totalMachines - underMaintenance - offlineCount) / totalMachines) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalMachines,
        underMaintenance,
        onlineConsultsToday: onlineConsultsEquipment * 320 + 847,
        uptimeRate: parseFloat(uptimeRate.toFixed(1)),
        totalMachinesChange: '+8.5%',
        maintenanceChange: `-${underMaintenance > 3 ? 3 : 1} units`,
        consultsChange: '+22.4%',
        uptimeChange: '+1.2%',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

export const getUtilization = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '3m';
    const now = new Date();
    let dataPoints: { date: string; inUse: number; idle: number }[] = [];

    const generatePoint = (seed: number) => {
      const inUse = Math.floor(60 + Math.sin(seed * 0.7) * 20 + Math.random() * 15);
      const idle = Math.floor(100 - inUse + Math.random() * 10);
      return { inUse: Math.min(95, Math.max(40, inUse)), idle: Math.min(40, Math.max(5, idle)) };
    };

    if (range === '3m') {
      const start = subMonths(now, 3);
      const weeks = eachWeekOfInterval({ start, end: now });
      dataPoints = weeks.map((week, i) => ({
        date: format(week, 'MMM dd'),
        ...generatePoint(i),
      }));
    } else if (range === '30d') {
      const start = subDays(now, 30);
      const days = eachDayOfInterval({ start, end: now });
      dataPoints = days.filter((_, i) => i % 3 === 0).map((day, i) => ({
        date: format(day, 'MMM dd'),
        ...generatePoint(i + 10),
      }));
    } else {
      const start = subDays(now, 7);
      const days = eachDayOfInterval({ start, end: now });
      dataPoints = days.map((day, i) => ({
        date: format(day, 'EEE'),
        ...generatePoint(i + 20),
      }));
    }

    res.json({ success: true, data: dataPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching utilization' });
  }
};

export const getMachinesByDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Equipment.countDocuments();
    const byDept = await Equipment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const topTwo = byDept.slice(0, 2);
    const othersCount = byDept.slice(2).reduce((acc, d) => acc + d.count, 0);

    const departments = [
      ...topTwo.map((d) => ({
        department: d._id,
        count: d.count,
        percentage: total > 0 ? Math.round((d.count / total) * 100) : 0,
      })),
      ...(othersCount > 0
        ? [{ department: 'Others', count: othersCount, percentage: total > 0 ? Math.round((othersCount / total) * 100) : 0 }]
        : []),
    ];

    res.json({ success: true, data: { total, departments } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching department data' });
  }
};
