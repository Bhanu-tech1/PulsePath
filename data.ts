import { PotholeReport } from './types';

// Preset high-fidelity placeholder image URLs for potholes
export const POTHOLE_PRESETS = [
  {
    id: 'p1',
    severity: 'high' as const,
    name: 'Deep Crater (High Severity)',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    description: 'Deep cave-in pothole near crosswalk. Urgent hazard.'
  },
  {
    id: 'p2',
    severity: 'medium' as const,
    name: 'Noticeable Gap (Medium Severity)',
    url: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=600&q=80',
    description: 'Chipped asphalt, visible water logging danger.'
  },
  {
    id: 'p3',
    severity: 'low' as const,
    name: 'Surface Fissure (Low Severity)',
    url: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
    description: 'Fine hairline cracks, starting to decay.'
  }
];

// Seed data based in Bengaluru, situated between Begur and JP Nagar, and surrounding areas
export const INITIAL_REPORTS: PotholeReport[] = [
  {
    id: '1',
    address: 'Devarachikkanahalli Rd, Begur, Bengaluru',
    latitude: 12.8988,
    longitude: 77.6105,
    lat: 12.8988,
    lng: 77.6105,
    description: 'Deep cave-in pothole at Devarachikkanahalli intersection, major hazard for vehicles.',
    severity: 'high',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    createdAt: '21/05/2026 at 10:15',
    reportedBy: 'BBMP Field Lead'
  },
  {
    id: 'pothole-user-1',
    address: 'Bannerghatta Main Rd, Jayanagar 9th Block, Bengaluru',
    latitude: 12.9121,
    longitude: 77.5933,
    lat: 12.9121,
    lng: 77.5933,
    description: 'Severe deep trench on active driving lane.',
    severity: 'high',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    createdAt: '22/05/2026 at 06:12',
    reportedBy: 'Citizen GPS'
  },
  {
    id: 'pothole-user-2',
    address: '9th Cross Rd, Jayanagar 3rd Block, Bengaluru',
    latitude: 12.9200,
    longitude: 77.5800,
    lat: 12.9200,
    lng: 77.5800,
    description: 'Large pothole on secondary lane causing slow traffic.',
    severity: 'medium',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=600&q=80',
    createdAt: '22/05/2026 at 06:20',
    reportedBy: 'Ambulance Dispatch'
  },
  {
    id: '2',
    address: '29th Main Rd, BTM Layout 2nd Stage, Bengaluru',
    latitude: 12.9115,
    longitude: 77.6022,
    lat: 12.9115,
    lng: 77.6022,
    description: 'Wide structural fissure causing lane bottleneck.',
    severity: 'medium',
    status: 'in-progress',
    imageUrl: 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?auto=format&fit=crop&w=600&q=80',
    createdAt: '20/05/2026 at 14:22',
    reportedBy: 'Kiran G.'
  },
  {
    id: '3',
    address: 'JP Nagar 3rd Phase, Outer Ring Road, Bengaluru',
    latitude: 12.9080,
    longitude: 77.5830,
    lat: 12.9080,
    lng: 77.5830,
    description: 'Minor road surface erosion, repairs initiated.',
    severity: 'medium',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&w=600&q=80',
    createdAt: '19/05/2026 at 09:30',
    reportedBy: 'Priya Hegde'
  }
];

export const PRESET_HOSPITALS = [
  { name: 'JP Nagar Aster RV Hospital (Primary)', address: 'CA 37, 24th Main Rd, ITI Layout, JP Nagar 1st Phase, Bengaluru, Karnataka 560078', lat: 12.9107, lng: 77.5857 },
  { name: 'Bannerghatta Apollo Hospital', address: '154/11, Bannerghatta Rd, Opp. IIMB, Bengaluru, Karnataka 560076', lat: 12.8958, lng: 77.5985 },
  { name: 'Fortis Hospital BG Road', address: '154/9, Bannerghatta Rd, Opp. IIMB, Bengaluru, Karnataka 560076', lat: 12.8943, lng: 77.5976 },
  { name: 'Sri Jayadeva Cardiovascular Hospital', address: 'Bannerghatta Rd, Jayanagar 9th Block, Bengaluru, Karnataka 560069', lat: 12.9234, lng: 77.5994 }
];

export const PRESET_START_LOCATIONS = [
  { name: 'Beguru Sector (Ambulance Base)', address: 'Begur Road, Begur, Bengaluru, Karnataka 560068', lat: 12.8933, lng: 77.6244 },
  { name: 'Koramangala 5th Block Post', address: '100 Feet Rd, Koramangala 5th Block, Bengaluru, Karnataka 560095', lat: 12.9352, lng: 77.6244 },
  { name: 'Indiranagar Metro Station Zone', address: 'Indiranagar Double Rd, Stage 1, Indiranagar, Bengaluru, Karnataka 560038', lat: 12.9718, lng: 77.6412 },
  { name: 'Electronic City Emergency Cell', address: 'Hosur Rd, Electronic City Phase I, Bengaluru, Karnataka 560100', lat: 12.8500, lng: 77.6667 }
];

export interface MapStreet {
  id: string;
  name: string;
  points: [number, number][]; // lat, lng
}

// Minimal dummy streets layout in case SVG drawing is imported anywhere else, but now using Bengaluru coordinates
export const MAP_STREETS: MapStreet[] = [
  { id: 'begur_road', name: 'Begur Main Road', points: [[12.8933, 77.6244], [12.8988, 77.6105], [12.9115, 77.6022]] },
  { id: 'outer_ring_road', name: 'Outer Ring Road (ORR)', points: [[12.9115, 77.6022], [12.9080, 77.5910], [12.9107, 77.5857]] }
];
