import { Request, Response } from 'express';
import Equipment from '../models/Equipment';
import MaintenanceLog from '../models/MaintenanceLog';
import ServiceRequest from '../models/ServiceRequest';
import Staff from '../models/Staff';
import Alert from '../models/Alert';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Simple intent detection based on keywords
function detectIntent(message: string): { intent: string; entities: Record<string, string> } {
  const msg = message.toLowerCase().trim();

  // Equipment queries
  if (msg.match(/(?:how many|total|count).*(?:equipment|machine|device)/)) return { intent: 'equipment_count', entities: {} };
  if (msg.match(/(?:offline|down|not working)/)) return { intent: 'equipment_offline', entities: {} };
  if (msg.match(/(?:active|online|running|operational)/)) return { intent: 'equipment_active', entities: {} };
  if (msg.match(/(?:maintenance|under repair|being repaired)/)) return { intent: 'equipment_maintenance', entities: {} };
  if (msg.match(/(?:list|show|all).*(?:equipment|machine|device)/)) return { intent: 'equipment_list', entities: {} };

  // Department queries
  const deptMatch = msg.match(/(?:radiology|cardiology|pathology|icu|teleconsultancy|obstetrics|diagnostic|emergency)/i);
  if (deptMatch) {
    const deptMap: Record<string, string> = {
      radiology: 'Radiology', cardiology: 'Cardiology', pathology: 'Pathology Lab',
      icu: 'ICU Monitoring', teleconsultancy: 'Teleconsultancy', obstetrics: 'Obstetrics',
      diagnostic: 'Diagnostic', emergency: 'Emergency',
    };
    return { intent: 'department_info', entities: { department: deptMap[deptMatch[0].toLowerCase()] || deptMatch[0] } };
  }

  // Maintenance queries
  if (msg.match(/(?:maintenance|service).*(?:cost|expense|spend)/)) return { intent: 'maintenance_cost', entities: {} };
  if (msg.match(/(?:maintenance|service).*(?:log|history|record)/)) return { intent: 'maintenance_list', entities: {} };
  if (msg.match(/(?:pending|scheduled|upcoming).*(?:maintenance|service)/)) return { intent: 'maintenance_pending', entities: {} };

  // Service request queries
  if (msg.match(/(?:critical|urgent).*(?:request|ticket|issue)/)) return { intent: 'service_critical', entities: {} };
  if (msg.match(/(?:open|pending).*(?:request|ticket|issue)/)) return { intent: 'service_open', entities: {} };
  if (msg.match(/(?:service request|ticket|issue)/)) return { intent: 'service_list', entities: {} };

  // Staff queries
  if (msg.match(/(?:staff|team|employee|doctor|technician|engineer)/)) return { intent: 'staff_info', entities: {} };

  // Alert queries
  if (msg.match(/(?:alert|notification|warning)/)) return { intent: 'alerts_info', entities: {} };

  // Warranty queries
  if (msg.match(/(?:warranty|expir)/)) return { intent: 'warranty_info', entities: {} };

  // Uptime / overview
  if (msg.match(/(?:uptime|overview|summary|dashboard|status|report|stat)/)) return { intent: 'overview', entities: {} };

  // Help
  if (msg.match(/(?:help|what can you|capabilities|commands)/)) return { intent: 'help', entities: {} };

  return { intent: 'general', entities: {} };
}

async function processIntent(intent: string, entities: Record<string, string>): Promise<string> {
  switch (intent) {
    case 'equipment_count': {
      const total = await Equipment.countDocuments();
      const active = await Equipment.countDocuments({ status: 'Active' });
      const maint = await Equipment.countDocuments({ status: 'Maintenance' });
      const offline = await Equipment.countDocuments({ status: 'Offline' });
      return `📊 **Equipment Summary**\n\n| Status | Count |\n|--------|-------|\n| ✅ Active | ${active} |\n| 🔧 Maintenance | ${maint} |\n| ❌ Offline | ${offline} |\n| **Total** | **${total}** |`;
    }

    case 'equipment_offline': {
      const offlineEquip = await Equipment.find({ status: 'Offline' }).lean();
      if (offlineEquip.length === 0) return '✅ Great news! No equipment is currently offline.';
      let response = `⚠️ **${offlineEquip.length} Equipment Offline**\n\n`;
      offlineEquip.forEach(e => {
        response += `• **${e.name}** (${e.serialNumber}) — ${e.department}, ${e.location || 'N/A'}\n  ${e.notes || ''}\n`;
      });
      return response;
    }

    case 'equipment_active': {
      const activeEquip = await Equipment.find({ status: 'Active' }).lean();
      let response = `✅ **${activeEquip.length} Equipment Active**\n\n| Equipment | Department | Location |\n|-----------|------------|----------|\n`;
      activeEquip.forEach(e => {
        response += `| ${e.name} | ${e.department} | ${e.location || '—'} |\n`;
      });
      return response;
    }

    case 'equipment_maintenance': {
      const maintEquip = await Equipment.find({ status: 'Maintenance' }).lean();
      if (maintEquip.length === 0) return '✅ No equipment is currently under maintenance.';
      let response = `🔧 **${maintEquip.length} Equipment Under Maintenance**\n\n`;
      maintEquip.forEach(e => {
        response += `• **${e.name}** — ${e.department} (Assigned: ${e.assignedTech || 'Unassigned'})\n`;
      });
      return response;
    }

    case 'equipment_list': {
      const allEquip = await Equipment.find().sort({ name: 1 }).lean();
      let response = `📋 **All Equipment (${allEquip.length} items)**\n\n| # | Equipment | Type | Status | Department |\n|---|-----------|------|--------|------------|\n`;
      allEquip.forEach((e, i) => {
        const statusIcon = e.status === 'Active' ? '✅' : e.status === 'Maintenance' ? '🔧' : '❌';
        response += `| ${i + 1} | ${e.name} | ${e.type} | ${statusIcon} ${e.status} | ${e.department} |\n`;
      });
      return response;
    }

    case 'department_info': {
      const dept = entities.department;
      const deptEquip = await Equipment.find({ department: dept }).lean();
      const deptStaff = await Staff.find({ department: dept }).lean();
      const deptRequests = await ServiceRequest.find({ department: dept }).lean();
      if (deptEquip.length === 0 && deptStaff.length === 0) return `No data found for department: ${dept}`;

      let response = `🏥 **${dept} Department Overview**\n\n`;
      response += `**Equipment (${deptEquip.length}):**\n`;
      deptEquip.forEach(e => {
        const statusIcon = e.status === 'Active' ? '✅' : e.status === 'Maintenance' ? '🔧' : '❌';
        response += `• ${statusIcon} ${e.name} — ${e.type}\n`;
      });
      if (deptStaff.length > 0) {
        response += `\n**Staff (${deptStaff.length}):**\n`;
        deptStaff.forEach(s => { response += `• ${s.name} — ${s.role}\n`; });
      }
      if (deptRequests.length > 0) {
        const open = deptRequests.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
        response += `\n**Service Requests:** ${deptRequests.length} total, ${open} active`;
      }
      return response;
    }

    case 'maintenance_cost': {
      const logs = await MaintenanceLog.find().populate('equipment', 'name').lean();
      const totalCost = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
      const completed = logs.filter(l => l.status === 'Completed');
      const completedCost = completed.reduce((sum, l) => sum + (l.cost || 0), 0);
      let response = `💰 **Maintenance Cost Summary**\n\n`;
      response += `• **Total Budget Spent:** ₹${totalCost.toLocaleString()}\n`;
      response += `• **Completed Work:** ₹${completedCost.toLocaleString()} across ${completed.length} jobs\n`;
      response += `• **Avg Cost/Job:** ₹${logs.length > 0 ? Math.round(totalCost / logs.length).toLocaleString() : 0}\n\n`;
      response += `| Equipment | Type | Cost | Status |\n|-----------|------|------|--------|\n`;
      logs.forEach(l => {
        const eqName = (l.equipment as any)?.name || 'N/A';
        response += `| ${eqName} | ${l.type} | ₹${(l.cost || 0).toLocaleString()} | ${l.status} |\n`;
      });
      return response;
    }

    case 'maintenance_list': {
      const logs = await MaintenanceLog.find().populate('equipment', 'name').sort({ startDate: -1 }).lean();
      let response = `🔧 **Maintenance Log (${logs.length} records)**\n\n| Equipment | Type | Status | Technician | Cost |\n|-----------|------|--------|------------|------|\n`;
      logs.forEach(l => {
        const eqName = (l.equipment as any)?.name || 'N/A';
        response += `| ${eqName} | ${l.type} | ${l.status} | ${l.technicianName} | ₹${(l.cost || 0).toLocaleString()} |\n`;
      });
      return response;
    }

    case 'maintenance_pending': {
      const pending = await MaintenanceLog.find({ status: { $in: ['Pending', 'In Progress'] } }).populate('equipment', 'name').lean();
      if (pending.length === 0) return '✅ No pending maintenance tasks.';
      let response = `⏳ **${pending.length} Pending/In-Progress Maintenance**\n\n`;
      pending.forEach(l => {
        const eqName = (l.equipment as any)?.name || 'N/A';
        response += `• **${eqName}** — ${l.type} (${l.status})\n  Technician: ${l.technicianName}\n`;
      });
      return response;
    }

    case 'service_critical': {
      const critical = await ServiceRequest.find({ priority: { $in: ['Critical', 'High'] }, status: { $ne: 'Resolved' } }).populate('equipment', 'name').lean();
      if (critical.length === 0) return '✅ No critical or high-priority open requests.';
      let response = `🚨 **${critical.length} Critical/High Priority Requests**\n\n`;
      critical.forEach(r => {
        const eqName = (r.equipment as any)?.name || 'N/A';
        const icon = r.priority === 'Critical' ? '🔴' : '🟠';
        response += `${icon} **${eqName}** — ${r.priority}\n  Issue: ${r.issue}\n  Status: ${r.status} | Dept: ${r.department}\n\n`;
      });
      return response;
    }

    case 'service_open': {
      const open = await ServiceRequest.find({ status: { $in: ['Open', 'In Progress'] } }).populate('equipment', 'name').lean();
      if (open.length === 0) return '✅ All service requests are resolved!';
      let response = `📋 **${open.length} Open/In-Progress Requests**\n\n| Equipment | Priority | Status | Department |\n|-----------|----------|--------|------------|\n`;
      open.forEach(r => {
        const eqName = (r.equipment as any)?.name || 'N/A';
        response += `| ${eqName} | ${r.priority} | ${r.status} | ${r.department} |\n`;
      });
      return response;
    }

    case 'service_list': {
      const all = await ServiceRequest.find().populate('equipment', 'name').lean();
      let response = `🎫 **Service Requests Summary**\n\n`;
      const byStatus: Record<string, number> = {};
      const byPriority: Record<string, number> = {};
      all.forEach(r => {
        byStatus[r.status] = (byStatus[r.status] || 0) + 1;
        byPriority[r.priority] = (byPriority[r.priority] || 0) + 1;
      });
      response += `**By Status:**\n`;
      Object.entries(byStatus).forEach(([k, v]) => { response += `• ${k}: ${v}\n`; });
      response += `\n**By Priority:**\n`;
      Object.entries(byPriority).forEach(([k, v]) => { response += `• ${k}: ${v}\n`; });
      return response;
    }

    case 'staff_info': {
      const staff = await Staff.find().populate('assignedEquipment', 'name status').lean();
      let response = `👥 **Staff Directory (${staff.length} members)**\n\n`;
      staff.forEach(s => {
        const equipCount = s.assignedEquipment?.length || 0;
        response += `• **${s.name}** — ${s.role}\n  📧 ${s.email} | 🏥 ${s.department} | 🔧 ${equipCount} equipment assigned\n\n`;
      });
      return response;
    }

    case 'alerts_info': {
      const alerts = await Alert.find().sort({ createdAt: -1 }).limit(10).lean();
      const unread = alerts.filter(a => !a.isRead).length;
      let response = `🔔 **Alerts (${unread} unread)**\n\n`;
      alerts.forEach(a => {
        const icon = a.severity === 'error' ? '🔴' : a.severity === 'warning' ? '🟡' : 'ℹ️';
        response += `${icon} **${a.title}** ${a.isRead ? '' : '🆕'}\n  ${a.message}\n\n`;
      });
      return response;
    }

    case 'warranty_info': {
      const equip = await Equipment.find({ warrantyExpiry: { $exists: true } }).sort({ warrantyExpiry: 1 }).lean();
      const now = new Date();
      let response = `📄 **Warranty Status**\n\n| Equipment | Warranty Expiry | Status |\n|-----------|----------------|--------|\n`;
      equip.forEach(e => {
        if (!e.warrantyExpiry) return;
        const expiry = new Date(e.warrantyExpiry);
        const daysLeft = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const status = daysLeft < 0 ? '❌ Expired' : daysLeft < 90 ? '⚠️ Expiring Soon' : '✅ Valid';
        response += `| ${e.name} | ${expiry.toLocaleDateString()} | ${status} (${daysLeft > 0 ? daysLeft + 'd left' : Math.abs(daysLeft) + 'd ago'}) |\n`;
      });
      return response;
    }

    case 'overview': {
      const total = await Equipment.countDocuments();
      const active = await Equipment.countDocuments({ status: 'Active' });
      const maint = await Equipment.countDocuments({ status: 'Maintenance' });
      const offline = await Equipment.countDocuments({ status: 'Offline' });
      const uptimeRate = total > 0 ? (((total - maint - offline) / total) * 100).toFixed(1) : '0';
      const openRequests = await ServiceRequest.countDocuments({ status: { $in: ['Open', 'In Progress'] } });
      const criticalAlerts = await Alert.countDocuments({ severity: 'error', isRead: false });
      const totalMaintCost = (await MaintenanceLog.find().lean()).reduce((s, l) => s + (l.cost || 0), 0);
      const staffCount = await Staff.countDocuments();

      return `🏥 **MediTrack Pro Dashboard Overview**\n\n| Metric | Value |\n|--------|-------|\n| Total Equipment | ${total} |\n| ✅ Active | ${active} |\n| 🔧 Under Maintenance | ${maint} |\n| ❌ Offline | ${offline} |\n| 📈 Uptime Rate | ${uptimeRate}% |\n| 🎫 Open Service Requests | ${openRequests} |\n| 🚨 Critical Alerts | ${criticalAlerts} |\n| 💰 Total Maintenance Cost | ₹${totalMaintCost.toLocaleString()} |\n| 👥 Staff Members | ${staffCount} |`;
    }

    case 'help':
      return `🤖 **MediTrack AI Assistant — What I Can Do**\n\nHere are some things you can ask me:\n\n**Equipment:**\n• "How many machines do we have?"\n• "Show offline equipment"\n• "List all equipment"\n• "Which devices are under maintenance?"\n\n**Departments:**\n• "Tell me about Radiology department"\n• "What's in the Emergency department?"\n\n**Maintenance:**\n• "What's the total maintenance cost?"\n• "Show maintenance history"\n• "Any pending maintenance?"\n\n**Service Requests:**\n• "Show critical tickets"\n• "How many open requests?"\n\n**Other:**\n• "Show staff directory"\n• "Any alerts?"\n• "Warranty status"\n• "Give me a dashboard overview"`;

    default:
      return `I'm not sure I understood that. Try asking about:\n• Equipment status or counts\n• Department information\n• Maintenance logs and costs\n• Service requests\n• Staff directory\n• Alerts and notifications\n• Warranty status\n\nOr type **"help"** for a full list of commands! 💡`;
  }
}

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const { intent, entities } = detectIntent(message);
    const response = await processIntent(intent, entities);

    res.json({
      success: true,
      data: {
        role: 'assistant' as const,
        content: response,
        intent,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to process your request. Please try again.' });
  }
};
