export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'contractor' | 'admin';
}

export interface PotholeReport {
  id: string;
  imageUrl: string;
  location: string;
  coordinates: [number, number];
  reportDate: string;
  reporterId: string;
  description?: string;
  severity: 'low' | 'medium' | 'high';
  status: 'reported' | 'verified' | 'in_progress' | 'completed';
  bounty: number;
  contractorId?: string;
  claimedDate?: string;
  completedDate?: string;
  verificationImageUrl?: string;
  transactionId?: string;

}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  address: string;
  rating: number;
  repairsCompleted: number;
  wallet: string;
  pothole: number; 
}


export interface Transaction {
  id: string;
  potholeId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  contractorId: string;
  txHash?: string;
}