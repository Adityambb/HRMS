
import { Client, InternalUser, UserRole, Employee, Shift, AttendanceRecord, LocationType, ApprovalStatus, Holiday, LeaveType, AttendanceCycle } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'TechCorp Global',
    legalEntityId: 'le1',
    allowBranchOverrides: true,
    geoFencingEnabled: true,
    allowedRemoteDesignations: ['Software Engineer', 'Manager'],
    branches: [
      { id: 'b1', clientId: 'c1', name: 'New York HQ', location: 'USA', latitude: 40.7128, longitude: -74.0060, radiusMeters: 200 },
    ],
    locationApprovalRequired: true,
    unplannedWFHApprovalRequired: true,
    presentThresholdHours: 8,
    halfDayThresholdHours: 4,
    allowHRAdjustments: true,
    cycleStartDay: 21,
    maxSwipeRequestsPerCycle: 3,
    workflowSlaDays: 3,
    compOffExpiryDays: 60,
    compOffEnabled: true,
    holidayYearType: 'CALENDAR',
    flexiHolidayLimit: 2,
    flexiHolidayApprovalRequired: true,
    otEnabled: true,
    otMinMinutes: 60,
    otDailyCapMinutes: 240,
    otWeeklyCapMinutes: 600,
    otPreApprovalRequired: true,
    otPayMultipliers: { 'REGULAR': 1, 'WEEKEND': 2, 'HOLIDAY': 3 },
    exemptionEnabled: true,
    exemptionWindowMinutes: 60,
    exemptionLimitPerCycle: 2
  }
];

export const MOCK_HOLIDAYS: Holiday[] = [
  { id: 'h1', clientId: 'c1', branchIds: [], name: 'New Year Day', date: '2026-01-01', isFixed: true },
  { id: 'h2', clientId: 'c1', branchIds: [], name: 'Independence Day', date: '2026-07-04', isFixed: true },
  { id: 'h3', clientId: 'c1', branchIds: [], name: 'Global Tech Summit', date: '2026-09-15', isFixed: false, isOptional: true },
  { id: 'h4', clientId: 'c1', branchIds: ['b1'], name: 'Founder Day', date: '2026-11-20', isFixed: true },
  { id: 'h5', clientId: 'c1', branchIds: [], name: 'Christmas Eve', date: '2026-12-24', isFixed: true },
];

export const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 'lt1', clientId: 'c1', name: 'Privilege Leave', code: 'PL', isLwp: false, color: 'bg-blue-500' },
  { id: 'lt2', clientId: 'c1', name: 'Sick Leave', code: 'SL', isLwp: false, color: 'bg-rose-500' },
  { id: 'lt3', clientId: 'c1', name: 'Loss of Pay', code: 'LWP', isLwp: true, color: 'bg-slate-500' },
  { id: 'lt4', clientId: 'c1', name: 'Comp Off', code: 'CO', isLwp: false, color: 'bg-emerald-500' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Alice Smith', email: 'alice@techcorp.com', clientId: 'c1', branchId: 'b1', joiningDate: '2023-01-10', designation: 'Software Engineer', currentShiftId: 's1', managerId: 'u1' },
  { id: 'e2', name: 'Bob Jones', email: 'bob@techcorp.com', clientId: 'c1', branchId: 'b1', joiningDate: '2023-03-15', designation: 'Accountant', currentShiftId: 's1', managerId: 'u1' },
];

export const MOCK_SHIFTS: Shift[] = [
  {
    id: 's1',
    clientId: 'c1',
    name: 'Morning General',
    startTime: '10:00',
    endTime: '18:00',
    graceMinutes: 15,
    lateThresholdMinutes: 30,
    lateCountForDeduction: 3,
    weeklyOffs: [0, 6]
  }
];

export const MOCK_USER: InternalUser = {
  id: 'u1',
  name: 'John HR Manager',
  role: UserRole.ADMIN,
  mappedClientIds: ['c1']
};

export const MOCK_CYCLES: AttendanceCycle[] = [
  { id: 'cy1', clientId: 'c1', startDate: '2024-04-21', endDate: '2024-05-20', status: 'LOCKED' },
  { id: 'cy2', clientId: 'c1', startDate: '2024-05-21', endDate: '2024-06-20', status: 'OPEN' }
];

export const MOCK_REQUESTS = [];
export const MOCK_ATTENDANCE = [];
export const MOCK_LEAVE_BALANCES = [];
export const MOCK_LEAVE_REQUESTS = [];
export const MOCK_LEAVE_POLICIES = [];
