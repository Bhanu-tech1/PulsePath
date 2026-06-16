export type Severity = 'high' | 'medium' | 'low';
export type ReportStatus = 'pending' | 'in-progress' | 'resolved';

export interface PotholeReport {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  description: string;
  severity: Severity;
  status: ReportStatus;
  imageUrl: string;
  createdAt: string;
  reportedBy: string;
}

export interface RouteNode {
  name: string;
  latitude: number;
  longitude: number;
  type: 'hospital' | 'location' | 'intersection';
}

export interface RoutePath {
  points: [number, number][];
  distanceKm: number;
  estimatedTimeMins: number;
  potholesAvoided: number;
  safeRoute: boolean;
}

export type Role = 'citizen' | 'emergency' | 'bbmp' | null;
