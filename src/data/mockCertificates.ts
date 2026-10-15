import { Certificate } from '../types/certificate';

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    rollNumber: 'MCO-1336-24',
    studentName: 'MD SHAHID ALAM',
    fatherName: 'EZAHAR ALAM',
    trade: 'MOBILE CRANE OPERATOR',
    session: '24',
    grade: 'A',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'valid',
    issueDate: '2024-04-18',
    certificateNumber: 'MIT/2024/MCO-1336',
    courseDuration: '6 Months',
    createdAt: '2024-04-18T10:00:00.000Z',
    updatedAt: '2024-04-18T10:00:00.000Z',
    createdBy: 'WASIM_372'
  },
  {
    id: 'cert-2',
    rollNumber: 'ACT-1082-24',
    studentName: 'SK AFRID',
    fatherName: 'SK RAHMATULLAH',
    trade: 'A/C & REFRIGERATION TECHNICIAN',
    session: '24',
    grade: 'A+',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'valid',
    issueDate: '2024-03-22',
    certificateNumber: 'MIT/2024/ACT-1082',
    courseDuration: '1 Year',
    createdAt: '2024-03-22T11:00:00.000Z',
    updatedAt: '2024-03-22T11:00:00.000Z',
    createdBy: 'WASIM_372'
  },
  {
    id: 'cert-3',
    rollNumber: 'JCB-1420-23',
    studentName: 'MUSTAFIJUR RAHMAN',
    fatherName: 'ABDUL JALIL',
    trade: 'HEAVY EQUIPMENT & JCB OPERATOR',
    session: '23',
    grade: 'A',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    status: 'valid',
    issueDate: '2023-11-15',
    certificateNumber: 'MIT/2023/JCB-1420',
    courseDuration: '6 Months',
    createdAt: '2023-11-15T09:30:00.000Z',
    updatedAt: '2023-11-15T09:30:00.000Z',
    createdBy: 'WASIM_372'
  },
  {
    id: 'cert-4',
    rollNumber: 'ELC-0912-23',
    studentName: 'RAHUL KUMAR',
    fatherName: 'RAMESHWAR PRASAD',
    trade: 'INDUSTRIAL ELECTRICIAN',
    session: '23',
    grade: 'B+',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    status: 'revoked',
    revocationReason: 'Candidate failed to submit authentic secondary school completion certificate during audit.',
    issueDate: '2023-08-10',
    certificateNumber: 'MIT/2023/ELC-0912',
    courseDuration: '1 Year',
    createdAt: '2023-08-10T14:15:00.000Z',
    updatedAt: '2024-01-05T16:00:00.000Z',
    createdBy: 'WASIM_372'
  },
  {
    id: 'cert-5',
    rollNumber: 'WLD-0754-22',
    studentName: 'IMTIYAZ AHMAD',
    fatherName: 'NUR MOHAMMAD',
    trade: 'TIG & ARC WELDER 6G',
    session: '22',
    grade: 'A',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    status: 'expired',
    issueDate: '2022-02-14',
    expiryDate: '2024-02-14',
    certificateNumber: 'MIT/2022/WLD-0754',
    courseDuration: '6 Months',
    createdAt: '2022-02-14T10:00:00.000Z',
    updatedAt: '2024-02-15T00:00:00.000Z',
    createdBy: 'WASIM_372'
  }
];

export const SUCCESS_STORIES = [
  {
    name: 'SK AFRID',
    trade: 'A/C Technician',
    company: 'Al Habtoor Group (Dubai, UAE)',
    package: 'AED 3,200/mo',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'MUSTAFIJUR RAHMAN',
    trade: 'Mobile Crane Operator',
    company: 'Larsen & Toubro (L&T Metro Project)',
    package: '₹38,000/mo',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'MD SHAHID ALAM',
    trade: 'Mobile Crane Operator',
    company: 'Tata Projects Ltd (Chennai)',
    package: '₹42,000/mo',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'MOHAMMAD DANISH',
    trade: 'Industrial Electrician',
    company: 'Voltas Electro-Mechanical (Qatar)',
    package: 'QAR 2,800/mo',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'
  }
];

export const LATEST_NEWS_ITEMS = [
  'NEW ADMISSION OPEN for Batch 2024-2025: Mobile Crane, Tower Crane, Excavator, Forklift, and A/C Training.',
  'CAMPUS DRIVE ON 28th: 45 Gulf Openings for Certified Crane Operators & Industrial Electricians.',
  'SPECIAL WORKSHOP: Modern Inverter HVAC & VRV/VRF System Diagnostics starts this Saturday.',
  '100% Practical Training on Real Machinery with Guaranteed Gulf & Domestic Placement Support.'
];
