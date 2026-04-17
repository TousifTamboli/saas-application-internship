import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

import User from '../models/User';
import Equipment from '../models/Equipment';
import MaintenanceLog from '../models/MaintenanceLog';
import ServiceRequest from '../models/ServiceRequest';
import Staff from '../models/Staff';
import Alert from '../models/Alert';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/meditrack';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Equipment.deleteMany({}),
      MaintenanceLog.deleteMany({}),
      ServiceRequest.deleteMany({}),
      Staff.deleteMany({}),
      Alert.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ── 1. Seed Admin User ──────────────────────────────────────────
    const adminUser = await User.create({
      name: 'Dr. Aris Thorne',
      email: 'admin@meditrack.com',
      password: 'Admin@123',
      role: 'Admin',
    });
    console.log('👤 Admin user created:', adminUser.email);

    // ── 2. Seed Equipment (12 records) ──────────────────────────────
    const equipmentData = [
      {
        name: 'SIEMENS CT-X900',
        serialNumber: '994-01-A',
        type: 'CT Scanner',
        department: 'Radiology',
        status: 'Active',
        assignedTech: 'Dr. Priya Mehta',
        lastServiced: new Date('2023-10-12'),
        nextServiceDue: new Date('2024-04-12'),
        location: 'Radiology Wing A',
        manufacturer: 'Siemens Healthineers',
        modelName: 'CT-X900',
        purchaseDate: new Date('2021-03-15'),
        warrantyExpiry: new Date('2026-03-15'),
        notes: 'Primary CT scanner for trauma cases',
      },
      {
        name: 'GE Voluson E10',
        serialNumber: '211-55-B',
        type: 'Sonography',
        department: 'Obstetrics',
        status: 'Maintenance',
        assignedTech: 'Tech. Ravi Kumar',
        lastServiced: new Date('2024-01-04'),
        nextServiceDue: new Date('2024-07-04'),
        location: 'OB Ward 2',
        manufacturer: 'GE Healthcare',
        modelName: 'Voluson E10',
        purchaseDate: new Date('2020-06-20'),
        warrantyExpiry: new Date('2025-06-20'),
        notes: 'High-end ultrasound system',
      },
      {
        name: 'PHILIPS MRI-2.0',
        serialNumber: '887-34-M',
        type: 'MRI',
        department: 'Diagnostic',
        status: 'Offline',
        assignedTech: 'Dr. Anita Singh',
        lastServiced: new Date('2023-12-20'),
        nextServiceDue: new Date('2024-06-20'),
        location: 'Diagnostic Block B',
        manufacturer: 'Philips Healthcare',
        modelName: 'Ingenia Ambition 1.5T',
        purchaseDate: new Date('2019-11-10'),
        warrantyExpiry: new Date('2024-11-10'),
        notes: 'Offline due to power surge - under repair',
      },
      {
        name: 'DRÄGER Evita V800',
        serialNumber: '456-22-C',
        type: 'Ventilator',
        department: 'ICU Monitoring',
        status: 'Active',
        assignedTech: 'Nurse Rajesh Patel',
        lastServiced: new Date('2023-11-15'),
        nextServiceDue: new Date('2024-05-15'),
        location: 'ICU North Ward',
        manufacturer: 'Dräger Medical',
        modelName: 'Evita V800',
        purchaseDate: new Date('2022-02-28'),
        warrantyExpiry: new Date('2027-02-28'),
        notes: 'Critical care ventilator',
      },
      {
        name: 'PHILIPS Affiniti 70C',
        serialNumber: '321-67-E',
        type: 'ECG',
        department: 'Cardiology',
        status: 'Active',
        assignedTech: 'Dr. Priya Mehta',
        lastServiced: new Date('2024-01-20'),
        nextServiceDue: new Date('2024-07-20'),
        location: 'Cardiology Suite 1',
        manufacturer: 'Philips Healthcare',
        modelName: 'Affiniti 70C',
        purchaseDate: new Date('2021-08-15'),
        warrantyExpiry: new Date('2026-08-15'),
        notes: 'Cardiac ultrasound and ECG system',
      },
      {
        name: 'FUJIFILM DR CALNEO G',
        serialNumber: '741-88-X',
        type: 'X-Ray',
        department: 'Radiology',
        status: 'Active',
        assignedTech: 'Tech. Sania Mirza',
        lastServiced: new Date('2023-09-05'),
        nextServiceDue: new Date('2024-03-05'),
        location: 'Radiology Wing B',
        manufacturer: 'Fujifilm',
        modelName: 'DR Calneo G',
        purchaseDate: new Date('2020-12-01'),
        warrantyExpiry: new Date('2025-12-01'),
      },
      {
        name: 'SYSMEX XN-9100',
        serialNumber: '583-44-L',
        type: 'Blood Analyzer',
        department: 'Pathology Lab',
        status: 'Active',
        assignedTech: 'Lab Tech. Vinay Sharma',
        lastServiced: new Date('2024-02-10'),
        nextServiceDue: new Date('2024-08-10'),
        location: 'Pathology Lab 3',
        manufacturer: 'Sysmex Corporation',
        modelName: 'XN-9100',
        purchaseDate: new Date('2022-05-18'),
        warrantyExpiry: new Date('2027-05-18'),
        notes: 'Automated hematology analyzer',
      },
      {
        name: 'MINDRAY BeneVision N22',
        serialNumber: '629-11-P',
        type: 'Patient Monitor',
        department: 'ICU Monitoring',
        status: 'Active',
        assignedTech: 'Nurse Kavitha R.',
        lastServiced: new Date('2023-08-22'),
        nextServiceDue: new Date('2024-02-22'),
        location: 'ICU South Ward',
        manufacturer: 'Mindray',
        modelName: 'BeneVision N22',
        purchaseDate: new Date('2021-11-30'),
        warrantyExpiry: new Date('2026-11-30'),
        notes: 'Multi-parameter patient monitor',
      },
      {
        name: 'ZOLL AED Plus',
        serialNumber: '117-99-D',
        type: 'Defibrillator',
        department: 'Emergency',
        status: 'Active',
        assignedTech: 'Dr. Amit Roy',
        lastServiced: new Date('2024-01-30'),
        nextServiceDue: new Date('2024-07-30'),
        location: 'Emergency Bay 1',
        manufacturer: 'Zoll Medical',
        modelName: 'AED Plus',
        purchaseDate: new Date('2022-09-14'),
        warrantyExpiry: new Date('2027-09-14'),
        notes: 'Automated external defibrillator',
      },
      {
        name: 'GETINGE Flow-e',
        serialNumber: '808-23-G',
        type: 'Ventilator',
        department: 'Emergency',
        status: 'Maintenance',
        assignedTech: 'Tech. Ravi Kumar',
        lastServiced: new Date('2023-07-18'),
        nextServiceDue: new Date('2024-01-18'),
        location: 'Emergency Trauma Bay',
        manufacturer: 'Getinge',
        modelName: 'Flow-e',
        purchaseDate: new Date('2020-04-22'),
        warrantyExpiry: new Date('2025-04-22'),
        notes: 'Scheduled maintenance in progress',
      },
      {
        name: 'TELEMEDICINE Hub Pro',
        serialNumber: '999-01-T',
        type: 'Online Consult',
        department: 'Teleconsultancy',
        status: 'Active',
        assignedTech: 'IT Admin Nikhil',
        lastServiced: new Date('2024-02-01'),
        nextServiceDue: new Date('2024-08-01'),
        location: 'Teleconsult Suite A',
        manufacturer: 'MedicTech Solutions',
        modelName: 'Hub Pro v2',
        purchaseDate: new Date('2023-01-10'),
        warrantyExpiry: new Date('2028-01-10'),
        notes: 'Primary teleconsultation station',
      },
      {
        name: 'SIEMENS Acuson S3000',
        serialNumber: '445-76-S',
        type: 'Sonography',
        department: 'Radiology',
        status: 'Active',
        assignedTech: 'Dr. Priya Mehta',
        lastServiced: new Date('2023-11-28'),
        nextServiceDue: new Date('2024-05-28'),
        location: 'Radiology Wing C',
        manufacturer: 'Siemens Healthineers',
        modelName: 'Acuson S3000',
        purchaseDate: new Date('2021-07-07'),
        warrantyExpiry: new Date('2026-07-07'),
        notes: 'High-performance ultrasound',
      },
    ];

    const equipment = await Equipment.insertMany(equipmentData);
    console.log(`🏥 ${equipment.length} equipment records created`);

    // ── 3. Seed Maintenance Logs (5) ────────────────────────────────
    const maintenanceLogs = await MaintenanceLog.insertMany([
      {
        equipment: equipment[2]._id, // PHILIPS MRI
        technicianName: 'Tech. Ravi Kumar',
        type: 'Emergency',
        description: 'Power surge caused system failure. Replacing power supply unit and running diagnostics.',
        startDate: new Date('2024-01-15'),
        status: 'In Progress',
        cost: 45000,
        parts: ['Power Supply Unit PSU-200', 'Safety Fuse Array'],
      },
      {
        equipment: equipment[1]._id, // GE Voluson
        technicianName: 'Dr. Anita Singh',
        type: 'Scheduled',
        description: 'Quarterly preventive maintenance including probe calibration and software update.',
        startDate: new Date('2024-01-04'),
        endDate: new Date('2024-01-06'),
        status: 'Completed',
        cost: 12000,
        parts: ['Gel coupling compound', 'Probe cover set'],
      },
      {
        equipment: equipment[9]._id, // GETINGE Flow-e
        technicianName: 'Tech. Sania Mirza',
        type: 'Preventive',
        description: 'Semi-annual ventilator servicing: filter replacement, valve inspection, and flow sensor calibration.',
        startDate: new Date('2024-02-12'),
        status: 'Pending',
        cost: 8500,
        parts: ['HEPA filter set', 'Flow sensor module', 'Expiratory valve'],
      },
      {
        equipment: equipment[0]._id, // SIEMENS CT
        technicianName: 'Dr. Priya Mehta',
        type: 'Scheduled',
        description: 'Annual CT scanner calibration and X-ray tube inspection.',
        startDate: new Date('2023-10-10'),
        endDate: new Date('2023-10-12'),
        status: 'Completed',
        cost: 65000,
        parts: ['Cooling fluid refill', 'Detector panel inspection'],
      },
      {
        equipment: equipment[4]._id, // PHILIPS Affiniti
        technicianName: 'Lab Tech. Vinay Sharma',
        type: 'Preventive',
        description: 'Routine probe and transducer maintenance plus software patch application.',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-21'),
        status: 'Completed',
        cost: 5500,
        parts: ['Ultrasound gel packets', 'Probe cover kit'],
      },
    ]);
    console.log(`🔧 ${maintenanceLogs.length} maintenance logs created`);

    // ── 4. Seed Service Requests (9) ────────────────────────────────
    await ServiceRequest.insertMany([
      { equipment: equipment[2]._id, requestedBy: 'Dr. Sharma', department: 'Diagnostic', priority: 'Critical', issue: 'MRI system completely offline after power surge. Patient MRIs cancelled.', status: 'In Progress', assignedTo: 'Tech. Ravi Kumar' },
      { equipment: equipment[0]._id, requestedBy: 'Radiologist Team', department: 'Radiology', priority: 'High', issue: 'CT scanner producing image artifacts in slice 4-8. Quality check needed.', status: 'Open' },
      { equipment: equipment[1]._id, requestedBy: 'OB Ward Nurse', department: 'Obstetrics', priority: 'Medium', issue: 'Scheduled maintenance overdue. System running but response time slow.', status: 'In Progress', assignedTo: 'Dr. Anita Singh' },
      { equipment: equipment[9]._id, requestedBy: 'Emergency Head', department: 'Emergency', priority: 'High', issue: 'Backup ventilator alarm triggering incorrectly. Needs calibration.', status: 'Open' },
      { equipment: equipment[6]._id, requestedBy: 'Lab Supervisor', department: 'Pathology Lab', priority: 'Low', issue: 'Reagent level sensor giving inconsistent readings.', status: 'Resolved', assignedTo: 'Lab Tech. Vinay Sharma', resolvedAt: new Date() },
      { equipment: equipment[7]._id, requestedBy: 'ICU Head Nurse', department: 'ICU Monitoring', priority: 'Medium', issue: 'Patient monitor intermittently losing SpO2 reading signal.', status: 'Open' },
      { equipment: equipment[8]._id, requestedBy: 'Dr. Amit Roy', department: 'Emergency', priority: 'High', issue: 'AED unit battery indicator shows low charge despite recent replacement.', status: 'Resolved', assignedTo: 'Tech. Sania Mirza', resolvedAt: new Date() },
      { equipment: equipment[10]._id, requestedBy: 'Admin Office', department: 'Teleconsultancy', priority: 'Low', issue: 'Video call quality degraded during peak hours. Network review needed.', status: 'Open' },
      { equipment: equipment[4]._id, requestedBy: 'Cardiology Dept.', department: 'Cardiology', priority: 'Medium', issue: 'ECG lead detection failure on V3 and V4 channels.', status: 'In Progress', assignedTo: 'Dr. Priya Mehta' },
    ]);
    console.log('📋 9 service requests created');

    // ── 5. Seed Staff (5) ────────────────────────────────────────────
    await Staff.insertMany([
      {
        name: 'Dr. Priya Mehta',
        role: 'Senior Radiologist',
        department: 'Radiology',
        email: 'priya.mehta@meditrack.com',
        phone: '+91-98765-43210',
        assignedEquipment: [equipment[0]._id, equipment[4]._id, equipment[11]._id],
      },
      {
        name: 'Tech. Ravi Kumar',
        role: 'Biomedical Engineer',
        department: 'Maintenance',
        email: 'ravi.kumar@meditrack.com',
        phone: '+91-87654-32109',
        assignedEquipment: [equipment[1]._id, equipment[2]._id, equipment[9]._id],
      },
      {
        name: 'Dr. Anita Singh',
        role: 'Chief Radiologist',
        department: 'Diagnostic',
        email: 'anita.singh@meditrack.com',
        phone: '+91-76543-21098',
        assignedEquipment: [equipment[2]._id],
      },
      {
        name: 'Lab Tech. Vinay Sharma',
        role: 'Senior Lab Technician',
        department: 'Pathology Lab',
        email: 'vinay.sharma@meditrack.com',
        phone: '+91-65432-10987',
        assignedEquipment: [equipment[6]._id],
      },
      {
        name: 'Dr. Amit Roy',
        role: 'Emergency Physician',
        department: 'Emergency',
        email: 'amit.roy@meditrack.com',
        phone: '+91-54321-09876',
        assignedEquipment: [equipment[8]._id, equipment[9]._id],
      },
    ]);
    console.log('👥 5 staff members created');

    // ── 6. Seed Alerts (5) ───────────────────────────────────────────
    await Alert.insertMany([
      {
        type: 'Offline',
        equipment: equipment[2]._id,
        title: 'MRI-2.0 Offline',
        message: 'Power surge detected in Diagnostic B wing. System unresponsive.',
        severity: 'error',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 mins ago
      },
      {
        type: 'Maintenance Due',
        equipment: equipment[0]._id,
        title: 'CT-X900 Maintenance Due',
        message: 'Scheduled check in 48 hours. Assign technician immediately.',
        severity: 'warning',
        isRead: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
      {
        type: 'Info',
        equipment: equipment[3]._id,
        title: 'New Inventory Added',
        message: '3x ICU Ventilators assigned to North Ward.',
        severity: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        type: 'Critical',
        equipment: equipment[9]._id,
        title: 'Ventilator Alarm Fault',
        message: 'Emergency ventilator producing false alarm signals in Trauma Bay.',
        severity: 'error',
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      },
      {
        type: 'Maintenance Due',
        equipment: equipment[6]._id,
        title: 'Blood Analyzer Calibration',
        message: 'Monthly calibration cycle due for Sysmex XN-9100 in Pathology Lab 3.',
        severity: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ]);
    console.log('🔔 5 alerts created');

    console.log('\n✨ Database seeding complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Email:    admin@meditrack.com');
    console.log('🔑 Admin Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
