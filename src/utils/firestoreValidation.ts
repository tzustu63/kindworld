/**
 * Firestore Validation Utilities
 * 
 * Client-side validation that mirrors Firestore security rules.
 * This provides immediate feedback to users before attempting operations
 * that would be rejected by security rules.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export type UserRole = 'user' | 'admin' | 'company';
export type MissionStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
export type MissionCategory = 'volunteer' | 'donation' | 'charity' | 'blood_drive' | 'other';
export type TransactionType = 'mission_completion' | 'voucher_redemption' | 'bonus' | 'adjustment';
export type VoucherCategory = '7-eleven' | 'familymart' | 'px-mart' | 'other';
export type RedemptionStatus = 'pending' | 'issued' | 'used' | 'expired';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeCriteriaType = 'hours' | 'missions' | 'points' | 'streak';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ============================================================================
// Constants
// ============================================================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LIMITS = {
  displayName: { min: 1, max: 100 },
  bio: { min: 0, max: 500 },
  missionTitle: { min: 1, max: 200 },
  missionDescription: { min: 1, max: 2000 },
  pointsReward: { min: 1, max: 10000 },
  transactionAmount: { min: -100000, max: 100000 },
  transactionDescription: { min: 1, max: 500 },
  voucherBrandName: { min: 1, max: 100 },
  voucherTitle: { min: 1, max: 200 },
  voucherPointsCost: { min: 1, max: 100000 },
  redemptionCode: { min: 6, max: 50 },
  badgeName: { min: 1, max: 100 },
  badgeDescription: { min: 1, max: 500 },
  badgeThreshold: { min: 1, max: 1000000 },
  companyName: { min: 1, max: 200 },
  companyDescription: { min: 0, max: 1000 },
};

// ============================================================================
// Helper Functions
// ============================================================================

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function isNonEmptyString(value: any): boolean {
  return typeof value === 'string' && value.length > 0;
}

function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function isValidEnum<T>(value: any, validValues: readonly T[]): value is T {
  return validValues.includes(value);
}

// ============================================================================
// User Validation
// ============================================================================

export function validateUserCreation(data: {
  email: string;
  displayName: string;
  role?: UserRole;
  compassionPoints?: number;
  totalVolunteerHours?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (!isNonEmptyString(data.displayName)) {
    errors.push('Display name is required');
  } else if (data.displayName.length > LIMITS.displayName.max) {
    errors.push(`Display name must be ${LIMITS.displayName.max} characters or less`);
  }

  if (data.role && data.role !== 'user') {
    errors.push('New users must have role "user"');
  }

  if (data.compassionPoints !== undefined && data.compassionPoints !== 0) {
    errors.push('Initial compassion points must be 0');
  }

  if (data.totalVolunteerHours !== undefined && data.totalVolunteerHours !== 0) {
    errors.push('Initial volunteer hours must be 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateUserUpdate(data: {
  displayName?: string;
  bio?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (data.displayName !== undefined) {
    if (!isNonEmptyString(data.displayName)) {
      errors.push('Display name cannot be empty');
    } else if (data.displayName.length > LIMITS.displayName.max) {
      errors.push(`Display name must be ${LIMITS.displayName.max} characters or less`);
    }
  }

  if (data.bio !== undefined && data.bio.length > LIMITS.bio.max) {
    errors.push(`Bio must be ${LIMITS.bio.max} characters or less`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Mission Validation
// ============================================================================

export function validateMissionCreation(data: {
  title: string;
  description: string;
  pointsReward: number;
  status: MissionStatus;
  category: MissionCategory;
  date: Date;
  location: {
    address: string;
    city: string;
  };
}): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(data.title)) {
    errors.push('Mission title is required');
  } else if (data.title.length > LIMITS.missionTitle.max) {
    errors.push(`Mission title must be ${LIMITS.missionTitle.max} characters or less`);
  }

  if (!isNonEmptyString(data.description)) {
    errors.push('Mission description is required');
  } else if (data.description.length > LIMITS.missionDescription.max) {
    errors.push(`Mission description must be ${LIMITS.missionDescription.max} characters or less`);
  }

  if (!isInRange(data.pointsReward, LIMITS.pointsReward.min, LIMITS.pointsReward.max)) {
    errors.push(
      `Points reward must be between ${LIMITS.pointsReward.min} and ${LIMITS.pointsReward.max}`
    );
  }

  if (!isValidEnum(data.status, ['draft', 'published'] as const)) {
    errors.push('Initial mission status must be "draft" or "published"');
  }

  if (
    !isValidEnum(data.category, [
      'volunteer',
      'donation',
      'charity',
      'blood_drive',
      'other',
    ] as const)
  ) {
    errors.push('Invalid mission category');
  }

  if (data.date <= new Date()) {
    errors.push('Mission date must be in the future');
  }

  if (!isNonEmptyString(data.location.address)) {
    errors.push('Mission address is required');
  }

  if (!isNonEmptyString(data.location.city)) {
    errors.push('Mission city is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMissionStatusTransition(
  oldStatus: MissionStatus,
  newStatus: MissionStatus
): ValidationResult {
  const errors: string[] = [];

  const validTransitions: Record<MissionStatus, MissionStatus[]> = {
    draft: ['published', 'cancelled'],
    published: ['ongoing', 'cancelled'],
    ongoing: ['completed', 'cancelled'],
    completed: ['completed'],
    cancelled: ['cancelled'],
  };

  if (!validTransitions[oldStatus].includes(newStatus)) {
    errors.push(`Cannot transition from "${oldStatus}" to "${newStatus}"`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMissionUpdate(data: {
  title?: string;
  description?: string;
  pointsReward?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      errors.push('Mission title cannot be empty');
    } else if (data.title.length > LIMITS.missionTitle.max) {
      errors.push(`Mission title must be ${LIMITS.missionTitle.max} characters or less`);
    }
  }

  if (data.description !== undefined) {
    if (!isNonEmptyString(data.description)) {
      errors.push('Mission description cannot be empty');
    } else if (data.description.length > LIMITS.missionDescription.max) {
      errors.push(`Mission description must be ${LIMITS.missionDescription.max} characters or less`);
    }
  }

  if (data.pointsReward !== undefined) {
    if (!isInRange(data.pointsReward, LIMITS.pointsReward.min, LIMITS.pointsReward.max)) {
      errors.push(
        `Points reward must be between ${LIMITS.pointsReward.min} and ${LIMITS.pointsReward.max}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Points Transaction Validation
// ============================================================================

export function validatePointsTransaction(data: {
  amount: number;
  type: TransactionType;
  description: string;
}): ValidationResult {
  const errors: string[] = [];

  if (data.amount === 0) {
    errors.push('Transaction amount cannot be zero');
  }

  if (!isInRange(data.amount, LIMITS.transactionAmount.min, LIMITS.transactionAmount.max)) {
    errors.push(
      `Transaction amount must be between ${LIMITS.transactionAmount.min} and ${LIMITS.transactionAmount.max}`
    );
  }

  if (
    !isValidEnum(data.type, [
      'mission_completion',
      'voucher_redemption',
      'bonus',
      'adjustment',
    ] as const)
  ) {
    errors.push('Invalid transaction type');
  }

  if (!isNonEmptyString(data.description)) {
    errors.push('Transaction description is required');
  } else if (data.description.length > LIMITS.transactionDescription.max) {
    errors.push(
      `Transaction description must be ${LIMITS.transactionDescription.max} characters or less`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Voucher Validation
// ============================================================================

export function validateVoucherCreation(data: {
  brandName: string;
  title: string;
  pointsCost: number;
  monetaryValue: number;
  stock: number;
  category: VoucherCategory;
  isActive: boolean;
}): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(data.brandName)) {
    errors.push('Brand name is required');
  } else if (data.brandName.length > LIMITS.voucherBrandName.max) {
    errors.push(`Brand name must be ${LIMITS.voucherBrandName.max} characters or less`);
  }

  if (!isNonEmptyString(data.title)) {
    errors.push('Voucher title is required');
  } else if (data.title.length > LIMITS.voucherTitle.max) {
    errors.push(`Voucher title must be ${LIMITS.voucherTitle.max} characters or less`);
  }

  if (!isInRange(data.pointsCost, LIMITS.voucherPointsCost.min, LIMITS.voucherPointsCost.max)) {
    errors.push(
      `Points cost must be between ${LIMITS.voucherPointsCost.min} and ${LIMITS.voucherPointsCost.max}`
    );
  }

  if (data.monetaryValue <= 0) {
    errors.push('Monetary value must be positive');
  }

  if (data.stock < 0) {
    errors.push('Stock cannot be negative');
  }

  if (!isValidEnum(data.category, ['7-eleven', 'familymart', 'px-mart', 'other'] as const)) {
    errors.push('Invalid voucher category');
  }

  if (typeof data.isActive !== 'boolean') {
    errors.push('isActive must be a boolean');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateVoucherRedemption(data: {
  userPoints: number;
  voucherPointsCost: number;
  voucherStock: number;
  voucherIsActive: boolean;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.voucherIsActive) {
    errors.push('This voucher is no longer active');
  }

  if (data.voucherStock <= 0) {
    errors.push('This voucher is out of stock');
  }

  if (data.userPoints < data.voucherPointsCost) {
    errors.push(
      `Insufficient points. You need ${data.voucherPointsCost} points but have ${data.userPoints}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRedemptionStatusTransition(
  oldStatus: RedemptionStatus,
  newStatus: RedemptionStatus
): ValidationResult {
  const errors: string[] = [];

  const validTransitions: Record<RedemptionStatus, RedemptionStatus[]> = {
    pending: ['issued', 'expired'],
    issued: ['used', 'expired'],
    used: ['used'],
    expired: ['expired'],
  };

  if (!validTransitions[oldStatus].includes(newStatus)) {
    errors.push(`Cannot transition from "${oldStatus}" to "${newStatus}"`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Badge Validation
// ============================================================================

export function validateBadgeCreation(data: {
  name: string;
  description: string;
  criteria: {
    type: BadgeCriteriaType;
    threshold: number;
  };
  rarity: BadgeRarity;
}): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(data.name)) {
    errors.push('Badge name is required');
  } else if (data.name.length > LIMITS.badgeName.max) {
    errors.push(`Badge name must be ${LIMITS.badgeName.max} characters or less`);
  }

  if (!isNonEmptyString(data.description)) {
    errors.push('Badge description is required');
  } else if (data.description.length > LIMITS.badgeDescription.max) {
    errors.push(`Badge description must be ${LIMITS.badgeDescription.max} characters or less`);
  }

  if (!isValidEnum(data.criteria.type, ['hours', 'missions', 'points', 'streak'] as const)) {
    errors.push('Invalid badge criteria type');
  }

  if (!isInRange(data.criteria.threshold, LIMITS.badgeThreshold.min, LIMITS.badgeThreshold.max)) {
    errors.push(
      `Badge threshold must be between ${LIMITS.badgeThreshold.min} and ${LIMITS.badgeThreshold.max}`
    );
  }

  if (!isValidEnum(data.rarity, ['common', 'rare', 'epic', 'legendary'] as const)) {
    errors.push('Invalid badge rarity');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Company Validation
// ============================================================================

export function validateCompanyCreation(data: {
  name: string;
  contactEmail: string;
  totalPointsSponsored?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!isNonEmptyString(data.name)) {
    errors.push('Company name is required');
  } else if (data.name.length > LIMITS.companyName.max) {
    errors.push(`Company name must be ${LIMITS.companyName.max} characters or less`);
  }

  if (!isValidEmail(data.contactEmail)) {
    errors.push('Invalid contact email format');
  }

  if (data.totalPointsSponsored !== undefined && data.totalPointsSponsored !== 0) {
    errors.push('Initial total points sponsored must be 0');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateCompanyUpdate(data: { description?: string }): ValidationResult {
  const errors: string[] = [];

  if (data.description !== undefined && data.description.length > LIMITS.companyDescription.max) {
    errors.push(`Company description must be ${LIMITS.companyDescription.max} characters or less`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Export All Validators
// ============================================================================

export const validators = {
  user: {
    validateCreation: validateUserCreation,
    validateUpdate: validateUserUpdate,
  },
  mission: {
    validateCreation: validateMissionCreation,
    validateUpdate: validateMissionUpdate,
    validateStatusTransition: validateMissionStatusTransition,
  },
  points: {
    validateTransaction: validatePointsTransaction,
  },
  voucher: {
    validateCreation: validateVoucherCreation,
    validateRedemption: validateVoucherRedemption,
  },
  redemption: {
    validateStatusTransition: validateRedemptionStatusTransition,
  },
  badge: {
    validateCreation: validateBadgeCreation,
  },
  company: {
    validateCreation: validateCompanyCreation,
    validateUpdate: validateCompanyUpdate,
  },
};

export default validators;
