import { Request, Response } from 'express';
import Equipment from '../models/Equipment';
import MaintenanceLog from '../models/MaintenanceLog';
import ServiceRequest from '../models/ServiceRequest';
import Staff from '../models/Staff';
import Alert from '../models/Alert';
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

export const getEnhancedStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Maintenance cost by type
    const maintenanceLogs = await MaintenanceLog.find().populate('equipment', 'name department').lean();
    const costByType: Record<string, number> = {};
    maintenanceLogs.forEach(l => {
      costByType[l.type] = (costByType[l.type] || 0) + (l.cost || 0);
    });
    const maintenanceCostData = Object.entries(costByType).map(([type, cost]) => ({ type, cost }));
    const totalMaintenanceCost = maintenanceLogs.reduce((s, l) => s + (l.cost || 0), 0);

    // Service requests breakdown
    const serviceRequests = await ServiceRequest.find().lean();
    const srByPriority: Record<string, number> = {};
    const srByStatus: Record<string, number> = {};
    serviceRequests.forEach(sr => {
      srByPriority[sr.priority] = (srByPriority[sr.priority] || 0) + 1;
      srByStatus[sr.status] = (srByStatus[sr.status] || 0) + 1;
    });

    // Warranty tracker
    const equipment = await Equipment.find({ warrantyExpiry: { $exists: true } }).lean();
    const now = new Date();
    let warrantyValid = 0, warrantyExpiring = 0, warrantyExpired = 0;
    equipment.forEach(e => {
      if (!e.warrantyExpiry) return;
      const daysLeft = Math.floor((new Date(e.warrantyExpiry).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) warrantyExpired++;
      else if (daysLeft < 90) warrantyExpiring++;
      else warrantyValid++;
    });

    // Equipment type distribution
    const byType = await Equipment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const equipmentByType = byType.map(t => ({ type: t._id, count: t.count }));

    // Staff workload
    const staff = await Staff.find().populate('assignedEquipment', 'name').lean();
    const staffWorkload = staff.map(s => ({
      name: s.name,
      role: s.role,
      department: s.department,
      assignedCount: s.assignedEquipment?.length || 0,
    }));

    // Recent activity (combine alerts + maintenance + service requests, sorted)
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentActivity = [
      ...alerts.map(a => ({
        type: 'alert' as const,
        title: a.title,
        description: a.message,
        severity: a.severity,
        timestamp: a.createdAt,
      })),
      ...maintenanceLogs.slice(0, 3).map(l => ({
        type: 'maintenance' as const,
        title: `${l.type} Maintenance`,
        description: `${l.technicianName} — ${l.status}`,
        severity: l.status === 'In Progress' ? 'warning' : 'info' as 'warning' | 'info',
        timestamp: l.startDate,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);

    // Monthly cost trend (simulated from actual data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyCostTrend = months.map((m, i) => ({
      month: m,
      cost: Math.round(totalMaintenanceCost * (0.12 + Math.sin(i * 0.8) * 0.08 + Math.random() * 0.05)),
    }));

    res.json({
      success: true,
      data: {
        maintenanceCostData,
        totalMaintenanceCost,
        monthlyCostTrend,
        serviceRequestsByPriority: Object.entries(srByPriority).map(([priority, count]) => ({ priority, count })),
        serviceRequestsByStatus: Object.entries(srByStatus).map(([status, count]) => ({ status, count })),
        totalServiceRequests: serviceRequests.length,
        warranty: { valid: warrantyValid, expiring: warrantyExpiring, expired: warrantyExpired },
        equipmentByType,
        staffWorkload,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching enhanced stats' });
  }
};
