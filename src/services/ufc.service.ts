import { ApiService } from './api.service';
import { UFCPrediction, Fighter, ApiResponse, FilterOptions } from '../types/models';

// Mock Data
const mockUFCPredictions: UFCPrediction[] = [
  {
    id: 'ufc-pred-1',
    event: 'UFC 300',
    date: '2025-07-15T20:00:00Z',
    fighter1: { id: 'f1', name: 'Alex Pereira', record: '10-2-0', stats: { wins: 10, losses: 2, draws: 0, strikingAccuracy: 0.55, grapplingAccuracy: 0.2, takedownDefense: 0.7 } },
    fighter2: { id: 'f2', name: 'Jamahal Hill', record: '12-1-0 (1 NC)', stats: { wins: 12, losses: 1, draws: 0, strikingAccuracy: 0.58, grapplingAccuracy: 0.1, takedownDefense: 0.65 } },
    prediction: { winner: 'Alex Pereira', confidence: 0.65, method: 'KO/TKO', round: 2 },
    status: 'pending',
  },
  {
    id: 'ufc-pred-2',
    event: 'UFC 299',
    date: '2025-03-09T21:00:00Z',
    fighter1: { id: 'f3', name: "Sean O'Malley", record: '18-1-0 (1 NC)', stats: { wins: 18, losses: 1, draws: 0, strikingAccuracy: 0.6, grapplingAccuracy: 0.3, takedownDefense: 0.75 } },
    fighter2: { id: 'f4', name: 'Marlon Vera', record: '23-9-1', stats: { wins: 23, losses: 9, draws: 1, strikingAccuracy: 0.52, grapplingAccuracy: 0.4, takedownDefense: 0.68 } },
    prediction: { winner: "Sean O'Malley", confidence: 0.72, method: 'Decision', round: 5 },
    status: 'correct', // Example of a past prediction
  },
];

const mockFighters: { [key: string]: Fighter } = {
  'f1': { id: 'f1', name: 'Alex Pereira', record: '10-2-0', stats: { wins: 10, losses: 2, draws: 0, strikingAccuracy: 0.55, grapplingAccuracy: 0.2, takedownDefense: 0.7 } },
  'f2': { id: 'f2', name: 'Jamahal Hill', record: '12-1-0 (1 NC)', stats: { wins: 12, losses: 1, draws: 0, strikingAccuracy: 0.58, grapplingAccuracy: 0.1, takedownDefense: 0.65 } },
  'f3': { id: 'f3', name: "Sean O'Malley", record: '18-1-0 (1 NC)', stats: { wins: 18, losses: 1, draws: 0, strikingAccuracy: 0.6, grapplingAccuracy: 0.3, takedownDefense: 0.75 } },
  'f4': { id: 'f4', name: 'Marlon Vera', record: '23-9-1', stats: { wins: 23, losses: 9, draws: 1, strikingAccuracy: 0.52, grapplingAccuracy: 0.4, takedownDefense: 0.68 } },
};

/**
 * Service for UFC/MMA related API calls
 */
export class UFCService {
  private api: ApiService;
  private endpoint = 'ufc';

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  /**
   * Get all UFC predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<UFCPrediction[]>> {
    console.log('Fetching UFC predictions with filters:', filters);
    // Using mock implementation
    await new Promise(resolve => setTimeout(resolve, 850));
    let filteredPredictions = mockUFCPredictions;
    if (filters?.status) {
      filteredPredictions = filteredPredictions.filter(p => p.status === filters.status);
    }
    return {
      data: filteredPredictions,
      metadata: { total: filteredPredictions.length, page: 1, limit: filteredPredictions.length }
    };
  }

  /**
   * Get a single UFC prediction by ID (Mock Implementation)
   */
  async getPredictionById(id: string): Promise<UFCPrediction> {
    console.log('Fetching mock UFC prediction by ID:', id);
    await new Promise(resolve => setTimeout(resolve, 300));
    const prediction = mockUFCPredictions.find(p => p.id === id);
    if (!prediction) {
      throw new Error(`Prediction with id ${id} not found`);
    }
    return prediction;
    // Original API call commented out
    // return this.api.get<UFCPrediction>(`${this.endpoint}/${id}`);
  }

  /**
   * Get upcoming UFC events (Mock Implementation)
   */
  async getUpcomingEvents(): Promise<ApiResponse<string[]>> {
    console.log('Fetching mock upcoming UFC events');
    await new Promise(resolve => setTimeout(resolve, 200));
    const upcomingEvents = [...new Set(mockUFCPredictions.filter(p => p.status === 'pending').map(p => p.event))];
    return {
        data: upcomingEvents,
        metadata: { total: upcomingEvents.length, page: 1, limit: upcomingEvents.length }
    };
    // Original API call commented out
    // return this.api.get<ApiResponse<string[]>>(`${this.endpoint}/events/upcoming`);
  }

  /**
   * Get fighter details (Mock Implementation)
   */
  async getFighterDetails(fighterId: string): Promise<Fighter> {
    console.log('Fetching mock fighter details:', fighterId);
    await new Promise(resolve => setTimeout(resolve, 300));
    const fighter = mockFighters[fighterId];
     if (!fighter) {
      throw new Error(`Fighter with id ${fighterId} not found`);
    }
    return fighter;
    // Original API call commented out
    // return this.api.get<Fighter>(`${this.endpoint}/fighters/${fighterId}`);
  }

  /**
   * Get prediction for a specific matchup (Mock Implementation)
   */
  async getPredictionForMatchup(fighter1Id: string, fighter2Id: string): Promise<UFCPrediction> {
     console.log('Fetching mock prediction for matchup:', fighter1Id, fighter2Id);
     await new Promise(resolve => setTimeout(resolve, 600));
     // Find a mock prediction that matches or create a generic one
     const existing = mockUFCPredictions.find(p =>
       (p.fighter1.id === fighter1Id && p.fighter2.id === fighter2Id) ||
       (p.fighter1.id === fighter2Id && p.fighter2.id === fighter1Id)
     );
     if (existing) return existing;

     const fighter1 = mockFighters[fighter1Id];
     const fighter2 = mockFighters[fighter2Id];
     if (!fighter1 || !fighter2) throw new Error('One or both fighters not found');

     // Create a generic mock prediction if no specific one exists
     return {
        id: `ufc-custom-${Date.now()}`,
        event: 'Custom Matchup',
        date: new Date().toISOString(),
        fighter1: fighter1,
        fighter2: fighter2,
        prediction: { winner: fighter1.name, confidence: 0.55, method: 'Decision', round: 3 },
        status: 'pending',
     };
    // Original API call commented out
    // return this.api.get<UFCPrediction>(`${this.endpoint}/matchup`, {
    //   fighter1: fighter1Id,
    //   fighter2: fighter2Id
    // });
  }

  /**
   * Request a new prediction for a matchup (Mock Implementation)
   */
  async requestPrediction(fighter1Id: string, fighter2Id: string, event: string): Promise<UFCPrediction> {
    console.log('Requesting mock prediction:', fighter1Id, fighter2Id, event);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate creating and returning a new prediction - for now, return a generic one
    const fighter1 = mockFighters[fighter1Id];
    const fighter2 = mockFighters[fighter2Id];
     if (!fighter1 || !fighter2) throw new Error('One or both fighters not found');

    const newPrediction: UFCPrediction = {
        id: `ufc-req-${Date.now()}`,
        event: event || 'Requested Matchup',
        date: new Date().toISOString(),
        fighter1: fighter1,
        fighter2: fighter2,
        prediction: { winner: fighter1.name, confidence: Math.random() * 0.4 + 0.3, method: 'Decision', round: 3 }, // Random confidence
        status: 'pending',
     };
     mockUFCPredictions.push(newPrediction); // Add to mock data (won't persist)
     return newPrediction;
    // Original API call commented out
    // return this.api.post<UFCPrediction>(`${this.endpoint}/predictions/request`, {
    //   fighter1Id,
    //   fighter2Id,
    //   event
    // });
  }
}

/**
 * React hook for using the UFC service
 */
import { useApi } from './api.service';

export const useUFCService = () => {
  const api = useApi();
  return new UFCService(api);
};