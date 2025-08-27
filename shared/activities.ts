export interface ActivityCategory {
  id: string;
  name: string;
  description: string;
}

export interface ActivityLevel {
  id: string;
  name: string;
  basePoints: number;
  winnerBonus: number;
}

export interface SubActivity {
  id: string;
  name: string;
  categoryId: string;
  evidenceRequired: string[];
  pointsByLevel: Record<string, number>;
  isDurationBased?: boolean;
  durationPoints?: Record<string, number>;
  isCustom?: boolean; // Added for custom activities
}

export interface ActivitySubmission {
  id: string;
  studentId: string;
  studentName: string;
  subActivityId: string;
  level: string;
  isWinner: boolean;
  date: string;
  evidenceType: string;
  evidenceUrl?: string;
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  teacherRemarks?: string;
  approvedBy?: string;
  approvedDate?: string;
  // Marks/Performance fields
  marksObtained?: string;
  totalMarks?: string;
  grade?: string;
  marksEvidence?: string;
  marksApproved?: boolean;
  marksApprovedBy?: string;
  marksApprovedDate?: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'A',
    name: 'Technical Skills',
    description: 'Programming, workshops, certifications, and technical competitions'
  },
  {
    id: 'B',
    name: 'Sports & Cultural',
    description: 'Sports competitions, cultural events, and artistic activities'
  },
  {
    id: 'C',
    name: 'Community Outreach',
    description: 'Social service, community development, and outreach programs'
  },
  {
    id: 'D',
    name: 'Innovation/IPR/Entrepreneurship',
    description: 'Patents, startups, research publications, and innovation projects'
  },
  {
    id: 'E',
    name: 'Leadership/Management',
    description: 'Leadership roles, management positions, and organizational activities'
  }
];

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    id: 'college',
    name: 'College',
    basePoints: 3,
    winnerBonus: 0
  },
  {
    id: 'inter_college',
    name: 'Different College',
    basePoints: 5,
    winnerBonus: 0
  },
  {
    id: 'district',
    name: 'District',
    basePoints: 7,
    winnerBonus: 0
  },
  {
    id: 'state',
    name: 'State',
    basePoints: 10,
    winnerBonus: 0
  },
  {
    id: 'national',
    name: 'National',
    basePoints: 12,
    winnerBonus: 0
  },
  {
    id: 'international',
    name: 'International',
    basePoints: 15,
    winnerBonus: 0
  }
];

// Fixed points per activity level as requested
export const LEVEL_CREDITS: Record<string, number> = {
  college: 3,
  inter_college: 5,
  district: 7,
  state: 10,
  national: 12,
  international: 15
};

export const SUB_ACTIVITIES: SubActivity[] = [
  // Technical Skills (Category A)
  {
    id: 'A1',
    name: 'Programming Competition',
    categoryId: 'A',
    evidenceRequired: ['Certificate', 'Report'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 12
    }
  },
  {
    id: 'A2',
    name: 'Technical Workshop Attendance',
    categoryId: 'A',
    evidenceRequired: ['Certificate'],
    pointsByLevel: {
      college: 2,
      district: 3,
      state: 4,
      national: 5,
      international: 6
    }
  },
  {
    id: 'A3',
    name: 'Technical Workshop Conducting',
    categoryId: 'A',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 4,
      district: 6,
      state: 8,
      national: 10,
      international: 12
    }
  },
  {
    id: 'A4',
    name: 'Technical Certification',
    categoryId: 'A',
    evidenceRequired: ['Certificate'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'A5',
    name: 'Hackathon',
    categoryId: 'A',
    evidenceRequired: ['Certificate', 'Report'],
    pointsByLevel: {
      college: 4,
      district: 6,
      state: 8,
      national: 10,
      international: 12
    }
  },

  // Sports & Cultural (Category B)
  {
    id: 'B1',
    name: 'Sports Competition',
    categoryId: 'B',
    evidenceRequired: ['Certificate', 'Photos'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 12
    }
  },
  {
    id: 'B2',
    name: 'Cultural Event Performance',
    categoryId: 'B',
    evidenceRequired: ['Certificate', 'Photos', 'Report'],
    pointsByLevel: {
      college: 2,
      district: 4,
      state: 6,
      national: 8,
      international: 10
    }
  },
  {
    id: 'B3',
    name: 'Cultural Event Organization',
    categoryId: 'B',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'B4',
    name: 'Art Exhibition',
    categoryId: 'B',
    evidenceRequired: ['Certificate', 'Photos'],
    pointsByLevel: {
      college: 2,
      district: 4,
      state: 6,
      national: 8,
      international: 10
    }
  },

  // Community Outreach (Category C)
  {
    id: 'C1',
    name: 'Community Service',
    categoryId: 'C',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    isDurationBased: true,
    durationPoints: {
      'two_days': 3,
      'one_week': 6,
      'one_month': 9,
      'one_semester': 12
    },
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'C2',
    name: 'Blood Donation Camp',
    categoryId: 'C',
    evidenceRequired: ['Certificate', 'Photos'],
    pointsByLevel: {
      college: 3,
      district: 4,
      state: 5,
      national: 6,
      international: 7
    }
  },
  {
    id: 'C3',
    name: 'Environmental Initiative',
    categoryId: 'C',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'C4',
    name: 'Disaster Relief Work',
    categoryId: 'C',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 4,
      district: 6,
      state: 8,
      national: 10,
      international: 12
    }
  },

  // Innovation/IPR/Entrepreneurship (Category D)
  {
    id: 'D1',
    name: 'Patent Filing',
    categoryId: 'D',
    evidenceRequired: ['Patent Document', 'Certificate'],
    pointsByLevel: {
      college: 8,
      district: 10,
      state: 12,
      national: 15,
      international: 18
    }
  },
  {
    id: 'D2',
    name: 'Research Publication',
    categoryId: 'D',
    evidenceRequired: ['Publication Certificate', 'Research Paper'],
    pointsByLevel: {
      college: 6,
      district: 8,
      state: 10,
      national: 12,
      international: 15
    }
  },
  {
    id: 'D3',
    name: 'Startup Initiative',
    categoryId: 'D',
    evidenceRequired: ['Certificate', 'Business Plan', 'Report'],
    pointsByLevel: {
      college: 6,
      district: 8,
      state: 10,
      national: 12,
      international: 14
    }
  },
  {
    id: 'D4',
    name: 'Innovation Competition',
    categoryId: 'D',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 4,
      district: 6,
      state: 8,
      national: 10,
      international: 12
    }
  },

  // Leadership/Management (Category E)
  {
    id: 'E1',
    name: 'Student Council Position',
    categoryId: 'E',
    evidenceRequired: ['Appointment Letter', 'Performance Report'],
    pointsByLevel: {
      college: 5,
      district: 7,
      state: 9,
      national: 11,
      international: 13
    }
  },
  {
    id: 'E2',
    name: 'Event Organization',
    categoryId: 'E',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'E3',
    name: 'Team Leadership Role',
    categoryId: 'E',
    evidenceRequired: ['Certificate', 'Report'],
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'E4',
    name: 'Mentoring Program',
    categoryId: 'E',
    evidenceRequired: ['Certificate', 'Report'],
    pointsByLevel: {
      college: 4,
      district: 6,
      state: 8,
      national: 10,
      international: 12
    }
  },
  // Other options for each category
  {
    id: 'A_OTHER',
    name: 'Other Technical Activity',
    categoryId: 'A',
    evidenceRequired: ['Certificate', 'Report'],
    isCustom: true,
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 12
    }
  },
  {
    id: 'B_OTHER',
    name: 'Other Sports & Cultural Activity',
    categoryId: 'B',
    evidenceRequired: ['Certificate', 'Photos'],
    isCustom: true,
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 12
    }
  },
  {
    id: 'C_OTHER',
    name: 'Other Community Outreach Activity',
    categoryId: 'C',
    evidenceRequired: ['Certificate', 'Report', 'Photos'],
    isCustom: true,
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  },
  {
    id: 'D_OTHER',
    name: 'Other Innovation/IPR/Entrepreneurship Activity',
    categoryId: 'D',
    evidenceRequired: ['Certificate', 'Report'],
    isCustom: true,
    pointsByLevel: {
      college: 5,
      district: 7,
      state: 9,
      national: 12,
      international: 15
    }
  },
  {
    id: 'E_OTHER',
    name: 'Other Leadership/Management Activity',
    categoryId: 'E',
    evidenceRequired: ['Certificate', 'Report'],
    isCustom: true,
    pointsByLevel: {
      college: 3,
      district: 5,
      state: 7,
      national: 9,
      international: 11
    }
  }
];

export const PROGRAM_REQUIREMENTS = {
  'B.Tech': {
    totalRequired: 60,
    categoryMinimums: {
      A: 15,
      B: 10,
      C: 10,
      D: 10,
      E: 10
    }
  },
  'BCA': {
    totalRequired: 50,
    categoryMinimums: {
      A: 12,
      B: 8,
      C: 10,
      D: 8,
      E: 8
    }
  },
  'MBA': {
    totalRequired: 70,
    categoryMinimums: {
      A: 15,
      B: 10,
      C: 15,
      D: 15,
      E: 15
    }
  },
  'M.Tech': {
    totalRequired: 65,
    categoryMinimums: {
      A: 20,
      B: 8,
      C: 10,
      D: 15,
      E: 12
    }
  }
};

export function calculateActivityPoints(
  subActivity: SubActivity,
  level: string,
  isWinner: boolean,
  duration?: string
): number {
  let points = 0;

  // Duration-based override if applicable
  if (subActivity.isDurationBased && duration && subActivity.durationPoints) {
    points = subActivity.durationPoints[duration] || 0;
  } else {
    // Use fixed level credits first; fallback to sub-activity mapping
    points = LEVEL_CREDITS[level] ?? subActivity.pointsByLevel[level] ?? 0;
  }

  // Winner bonus disabled by default (set to 0 in ACTIVITY_LEVELS)
  return points;
}

export function getActivityCategory(categoryId: string): ActivityCategory | undefined {
  return ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
}

export function getSubActivity(subActivityId: string): SubActivity | undefined {
  return SUB_ACTIVITIES.find(sub => sub.id === subActivityId);
}

export function getSubActivitiesByCategory(categoryId: string): SubActivity[] {
  return SUB_ACTIVITIES.filter(sub => sub.categoryId === categoryId);
}
