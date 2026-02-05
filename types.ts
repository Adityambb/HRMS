
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR = 'HR'
}

export enum LocationType {
  OFFICE = 'OFFICE',
  WFH = 'WFH',
  TRAVELLING = 'TRAVELLING',
  EXTERNAL = 'EXTERNAL'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  INVALIDATED = 'INVALIDATED',
  CANCELLED = 'CANCELLED'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export interface Task {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  deadline: string;
  fileName?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface InternalUser {
  id: string;
  name: string;
  role: UserRole;
  mappedClientIds: string[];
}

export interface Client {
  id: string;
  name: string;
  legalEntityId: string;
  allowBranchOverrides: boolean;
  branches: Branch[];
  allowedRemoteDesignations: string[];
  geoFencingEnabled: boolean;
  locationApprovalRequired: boolean;
  unplannedWFHApprovalRequired: boolean;
  presentThresholdHours: number;
  halfDayThresholdHours: number;
  allowHRAdjustments: boolean;
  cycleStartDay: number;
  maxSwipeRequestsPerCycle: number;
  workflowSlaDays: number;
  compOffExpiryDays: number;
  compOffEnabled: boolean;
  // Holiday & OT & Exemption Configs
  holidayYearType: 'CALENDAR' | 'FINANCIAL';
  flexiHolidayLimit: number;
  flexiHolidayApprovalRequired: boolean;
  otEnabled: boolean;
  otMinMinutes: number;
  otDailyCapMinutes: number;
  otWeeklyCapMinutes: number;
  otPreApprovalRequired: boolean;
  otPayMultipliers: { [key: string]: number }; // e.g., { 'REGULAR': 1, 'WEEKEND': 2, 'HOLIDAY': 3 }
  exemptionEnabled: boolean; // Early Leave / Late Login
  exemptionWindowMinutes: number;
  exemptionLimitPerCycle: number;
}

export interface Holiday {
  id: string;
  clientId: string;
  branchIds: string[]; // empty for all
  name: string;
  date: string;
  isFixed: boolean;
  isOptional?: boolean;
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  date: string;
  actualMinutes: number;
  approvedMinutes: number;
  multiplier: number;
  manDayValue: number; // e.g., 0.25, 0.5
  status: ApprovalStatus;
}

export interface ExemptionRequest {
  id: string;
  employeeId: string;
  type: 'LATE_LOGIN' | 'EARLY_LEAVE';
  date: string;
  minutes: number;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
}

export interface Branch {
  id: string;
  clientId: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
}

export interface Shift {
  id: string;
  clientId: string;
  name: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  lateThresholdMinutes: number;
  lateCountForDeduction: number;
  weeklyOffs: number[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  clientId: string;
  branchId: string;
  joiningDate: string;
  designation: string;
  currentShiftId: string;
  managerId?: string;
  dailyRate?: number;
}

export interface LeaveType {
  id: string;
  clientId: string;
  name: string;
  code: string;
  isLwp: boolean;
  color: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE' | 'HALF_DAY' | 'WEEK_OFF' | 'HOLIDAY';
  punches: {
    id: string;
    in: string;
    out?: string;
    locationType: LocationType;
    approvalStatus: ApprovalStatus;
    selfieUrl?: string;
  }[];
  totalWorkingMinutes: number;
  hrAdjustment?: 'LOP' | 'LEAVE_ADJUSTED' | 'UNAPPROVED_ABSENCE';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
}

export interface ApprovalStep {
  level: number;
  approverId: string;
  approverName: string;
  status: ApprovalStatus;
  slaDeadline: string;
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  type: 'SWIPE';
  date: string;
  reason: string;
  requestedData: any;
  createdAt: string;
  currentLevel: number;
  status: ApprovalStatus;
  steps: ApprovalStep[];
}

export interface AttendanceCycle {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'LOCKED' | 'FROZEN';
}

export interface OvertimeEarnRequest {
  id: string;
  employeeId: string;
  date: string;
  hours: number;
  reason: string;
  status: ApprovalStatus;
  multiplier: number;
  manDayValue: number;
  payout: number;
  createdAt: string;
}
