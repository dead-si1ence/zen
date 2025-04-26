import { ApiService } from './api.service';
import { Formula1Prediction, Driver, ApiResponse, FilterOptions, Constructor } from '../types/models'; // Added Constructor type

// Mock Data with fixed types
const mockF1Predictions: Formula1Prediction[] = [
  {
    id: 'f1-pred-1',
    grandPrix: 'Monaco Grand Prix',
    date: '2025-05-26T14:00:00Z',
    predictions: {
      pole: { id: 'd1', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, image: '/zen/drivers/verstappen.png' },
      podium: [
        { id: 'd1', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, image: '/zen/drivers/verstappen.png' },
        { id: 'd2', name: 'Charles Leclerc', team: 'Ferrari', number: 16, image: '/zen/drivers/leclerc.png' },
        { id: 'd3', name: 'Lando Norris', team: 'McLaren', number: 4, image: '/zen/drivers/norris.png' },
      ],
      fastestLap: { id: 'd2', name: 'Charles Leclerc', team: 'Ferrari', number: 16, image: '/zen/drivers/leclerc.png' },
    },
    confidence: 0.75,
    status: 'pending',
  },
  {
    id: 'f1-pred-2',
    grandPrix: 'British Grand Prix',
    date: '2025-07-07T15:00:00Z',
    predictions: {
      pole: { id: 'd4', name: 'George Russell', team: 'Mercedes', number: 63, image: '/zen/drivers/russell.png' },
      podium: [
        { id: 'd4', name: 'George Russell', team: 'Mercedes', number: 63, image: '/zen/drivers/russell.png' },
        { id: 'd1', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, image: '/zen/drivers/verstappen.png' },
        { id: 'd5', name: 'Lewis Hamilton', team: 'Ferrari', number: 44, image: '/zen/drivers/hamilton.png' },
      ],
      fastestLap: { id: 'd1', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, image: '/zen/drivers/verstappen.png' },
    },
    confidence: 0.68,
    status: 'pending',
  },
];

const mockDrivers: { [key: string]: Driver } = {
  'd1': { id: 'd1', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, image: '/zen/drivers/verstappen.png', stats: { poles: 35, wins: 60 } },
  'd2': { id: 'd2', name: 'Charles Leclerc', team: 'Ferrari', number: 16, image: '/zen/drivers/leclerc.png', stats: { poles: 23, wins: 6 } },
  'd3': { id: 'd3', name: 'Lando Norris', team: 'McLaren', number: 4, image: '/zen/drivers/norris.png', stats: { poles: 2, wins: 1 } },
  'd4': { id: 'd4', name: 'George Russell', team: 'Mercedes', number: 63, image: '/zen/drivers/russell.png', stats: { poles: 2, wins: 1 } },
  'd5': { id: 'd5', name: 'Lewis Hamilton', team: 'Ferrari', number: 44, image: '/zen/drivers/hamilton.png', stats: { poles: 104, wins: 103 } },
};

// Fix Constructor type to match what the Formula1Page expects
const mockConstructors = [
  { id: 'c1', name: 'Red Bull Racing', points: 300, color: '#0600EF', logo: '/zen/teams/redbull.png' },
  { id: 'c2', name: 'Ferrari', points: 250, color: '#DC0000', logo: '/zen/teams/ferrari.png' },
  { id: 'c3', name: 'McLaren', points: 200, color: '#FF8700', logo: '/zen/teams/mclaren.png' },
  { id: 'c4', name: 'Mercedes', points: 150, color: '#00D2BE', logo: '/zen/teams/mercedes.png' },
];

// Add mock driver standings with points
const mockDriverStandings: Driver[] = [
  { ...mockDrivers['d1']},
  { ...mockDrivers['d2']},
  { ...mockDrivers['d5']},
  { ...mockDrivers['d3']},
  { ...mockDrivers['d4']},
];

// Constructor standings are already defined in mockConstructors
const mockConstructorStandings = mockConstructors;

/**
 * Service for Formula 1 related API calls
 */
export class Formula1Service {
  private api: ApiService;
  private endpoint = 'formula1';

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  /**
   * Get all Formula 1 predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<Formula1Prediction[]>> {
    console.log('Fetching Formula 1 predictions with filters:', filters);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 650));
    let filteredPredictions = mockF1Predictions;
    if (filters?.status) {
      filteredPredictions = filteredPredictions.filter(p => p.status === filters.status);
    }
    return {
      data: filteredPredictions,
      metadata: { total: filteredPredictions.length, page: 1, limit: filteredPredictions.length }
    };
    // Note: Real API call would be:
    // return this.api.get<ApiResponse<Formula1Prediction[]>>(this.endpoint, filters as Record<string, string>);
  }

  /**
   * Get a single Formula 1 prediction by ID
   */
  async getPredictionById(id: string): Promise<Formula1Prediction> {
    console.log('Fetching Formula 1 prediction by ID:', id);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 580));
    const prediction = mockF1Predictions.find(p => p.id === id);
    if (!prediction) {
      throw new Error(`Formula 1 Prediction with id ${id} not found`);
    }
    return prediction;
  }

  /**
   * Get upcoming Grand Prix events (Mock Implementation)
   */
  async getUpcomingGrandPrix(): Promise<ApiResponse<string[]>> {
    console.log('Fetching mock upcoming F1 GPs');
    await new Promise(resolve => setTimeout(resolve, 250));
    const upcomingGPs = [...new Set(mockF1Predictions.filter(p => p.status === 'pending').map(p => p.grandPrix))];
    return {
      data: upcomingGPs,
      metadata: { total: upcomingGPs.length, page: 1, limit: upcomingGPs.length }
    };
  }

  /**
   * Get driver details (Mock Implementation)
   */
  async getDriverDetails(driverId: string): Promise<Driver> {
    console.log('Fetching mock driver details:', driverId);
    await new Promise(resolve => setTimeout(resolve, 320));
    const driver = mockDrivers[driverId];
    if (!driver) {
      throw new Error(`Driver with id ${driverId} not found`);
    }
    return driver;
  }

  /**
   * Get all current drivers (Mock Implementation)
   */
  async getAllDrivers(): Promise<ApiResponse<Driver[]>> {
    console.log('Fetching all mock drivers');
    await new Promise(resolve => setTimeout(resolve, 400));
    const allDrivers = Object.values(mockDrivers);
    return {
      data: allDrivers,
      metadata: { total: allDrivers.length, page: 1, limit: allDrivers.length }
    };
  }

  /**
   * Get prediction for a specific Grand Prix (Mock Implementation)
   */
  async getPredictionForGrandPrix(grandPrix: string): Promise<Formula1Prediction> {
    console.log('Fetching mock prediction for GP:', grandPrix);
    await new Promise(resolve => setTimeout(resolve, 650));
    const prediction = mockF1Predictions.find(p => p.grandPrix.toLowerCase() === grandPrix.toLowerCase());
    if (!prediction) {
      return {
        id: `f1-gp-${Date.now()}`,
        grandPrix: grandPrix,
        date: new Date().toISOString(),
        predictions: {
          pole: mockDrivers['d1'],
          podium: [mockDrivers['d1'], mockDrivers['d2'], mockDrivers['d3']],
          fastestLap: mockDrivers['d2'],
        },
        confidence: 0.5,
        status: 'pending',
      };
    }
    return prediction;
  }

  /**
   * Get all current constructors (Mock Implementation)
   */
  async getAllConstructors(): Promise<ApiResponse<Constructor[]>> {
    console.log('Fetching all mock constructors');
    await new Promise(resolve => setTimeout(resolve, 420));
    return {
      data: mockConstructors,
      metadata: { total: mockConstructors.length, page: 1, limit: mockConstructors.length }
    };
  }

  /**
   * Request a new prediction for a Grand Prix (Mock Implementation)
   */
  async requestPrediction(grandPrix: string, raceDate: string): Promise<Formula1Prediction> {
    console.log('Requesting mock F1 prediction:', grandPrix, raceDate);
    await new Promise(resolve => setTimeout(resolve, 1100));
    const newPrediction: Formula1Prediction = {
      id: `f1-req-${Date.now()}`,
      grandPrix: grandPrix,
      date: raceDate || new Date().toISOString(),
      predictions: {
        pole: mockDrivers['d1'],
        podium: [mockDrivers['d1'], mockDrivers['d2'], mockDrivers['d3']],
        fastestLap: mockDrivers['d2'],
      },
      confidence: Math.random() * 0.3 + 0.4,
      status: 'pending',
    };
    mockF1Predictions.push(newPrediction);
    return newPrediction;
  }

  /**
   * Get driver standings
   */
  async getDriverStandings(): Promise<ApiResponse<Driver[]>> {
    console.log('Fetching F1 driver standings');
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      data: mockDriverStandings,
      metadata: { total: mockDriverStandings.length, page: 1, limit: mockDriverStandings.length }
    };
  }

  /**
   * Get constructor standings
   */
  async getConstructorStandings(): Promise<ApiResponse<Constructor[]>> {
    console.log('Fetching F1 constructor standings');
    await new Promise(resolve => setTimeout(resolve, 620));
    return {
      data: mockConstructorStandings,
      metadata: { total: mockConstructorStandings.length, page: 1, limit: mockConstructorStandings.length }
    };
  }
}

/**
 * React hook for using the Formula 1 service
 */
import { useApi } from './api.service';

export const useFormula1Service = () => {
  const api = useApi();
  return new Formula1Service(api);
};