
// Types that will be replaced by Prisma generated types once the DB is connected

export enum FileType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  PPT = 'PPT',
  EPUB = 'EPUB',
  OTHER = 'OTHER'
}

export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  BORROWED = 'BORROWED',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum LoanStatus {
  ACTIVE = 'ACTIVE',
  RETURNED = 'RETURNED',
  EXPIRED = 'EXPIRED'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string | null;
  cover: string;
  filePath: string;
  fileType: FileType;
  createdAt: Date;
  updatedAt: Date;
  status: BookStatus;
}

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  startTime: Date;
  endTime?: Date | null;
  status: LoanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: 'USER' | 'ADMIN';
  plan: 'FREE' | 'PREMIUM';
  remainingTime: number;
}
