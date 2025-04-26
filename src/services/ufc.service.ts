import { ApiService } from './api.service';
import { LLMPredictionService } from './llm-prediction.service';
import { UFCPrediction, Fighter, ApiResponse, FilterOptions } from '../types/models';

/**
 * Service for UFC/MMA related API calls
 */
export class UFCService {
  private api: ApiService;
  private endpoint = 'ufc';
  private llmService: LLMPredictionService;

  constructor(apiService: ApiService, llmService: LLMPredictionService) {
    this.api = apiService;
    this.llmService = llmService;
  }

  /**
   * Get all UFC predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<UFCPrediction[]>> {
    console.log('Fetching UFC predictions with filters:', filters);
    try {
      // For demo purposes, generate a prediction using LLM
      this.logApiCall(`GET ${this.endpoint}`, filters);
      
      // Mock data with LLM-generated prediction
      const mockPredictions: UFCPrediction[] = [];
      
      try {
        const prediction = await this.llmService.getUFCPrediction(
          'Israel Adesanya',
          'Alex Pereira',
          'UFC 300'
        ) as UFCPrediction;
        
        mockPredictions.push(prediction);
        
        // Add a second prediction
        const prediction2 = await this.llmService.getUFCPrediction(
          'Jon Jones',
          'Stipe Miocic',
          'UFC 301'
        ) as UFCPrediction;
        
        mockPredictions.push(prediction2);
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        
        // Fallback data if LLM fails
        const fighter1: Fighter = {
          id: 'f1',
          name: 'Israel Adesanya',
          record: '24-2',
          weightClass: 'Middleweight'
        };
        
        const fighter2: Fighter = {
          id: 'f2',
          name: 'Alex Pereira',
          record: '8-1',
          weightClass: 'Middleweight'
        };
        
        mockPredictions.push({
          id: '1',
          fighter1: fighter1,
          fighter2: fighter2,
          winner: 'Alex Pereira',
          method: 'KO/TKO',
          round: 2,
          confidence: 75,
          event: 'UFC 300',
          date: '2025-05-15'
        });
      }
      
      return {
        data: mockPredictions,
        metadata: { total: mockPredictions.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching UFC predictions:', error);
      throw error;
    }
  }

  /**
   * Get a single UFC prediction by ID
   */
  async getPredictionById(id: string): Promise<UFCPrediction> {
    console.log('Fetching UFC prediction by ID:', id);
    try {
      this.logApiCall(`GET ${this.endpoint}/${id}`);
      
      // Mock data with LLM-generated prediction
      try {
        const prediction = await this.llmService.getUFCPrediction(
          'Conor McGregor',
          'Michael Chandler',
          'UFC 302'
        ) as UFCPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Prediction with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching UFC prediction by ID:', error);
      throw error;
    }
  }

  /**
   * Get upcoming UFC events
   */
  async getUpcomingEvents(): Promise<ApiResponse<string[]>> {
    console.log('Fetching upcoming UFC events');
    try {
      this.logApiCall(`GET ${this.endpoint}/events/upcoming`);
      
      // Mock upcoming events
      const upcomingEvents = [
        'UFC 300: Adesanya vs. Pereira 3',
        'UFC 301: Jones vs. Miocic',
        'UFC 302: McGregor vs. Chandler'
      ];
      
      return {
        data: upcomingEvents,
        metadata: { total: upcomingEvents.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }

  /**
   * Get fighter details
   */
  async getFighterDetails(fighterId: string): Promise<Fighter> {
    console.log('Fetching fighter details:', fighterId);
    try {
      this.logApiCall(`GET ${this.endpoint}/fighters/${fighterId}`);
      
      // Mock fighter details
      const fighters: Record<string, Fighter> = {
        'f1': {
          id: 'f1',
          name: 'Israel Adesanya',
          record: '24-2',
          weightClass: 'Middleweight',
          age: 33,
          height: '193 cm',
          reach: '203 cm'
        }
      };
      
      const fighter = fighters[fighterId];
      if (fighter) return fighter;
      
      throw new Error(`Fighter with id ${fighterId} not found`);
    } catch (error) {
      console.error('Error fetching fighter details:', error);
      throw error;
    }
  }

  /**
   * Get prediction for a specific matchup
   */
  async getPredictionForMatchup(fighter1Id: string, fighter2Id: string): Promise<UFCPrediction> {
    console.log('Fetching prediction for matchup:', fighter1Id, fighter2Id);
    try {
      this.logApiCall(`GET ${this.endpoint}/matchup`, {fighter1: fighter1Id, fighter2: fighter2Id});
      
      // Mock matchup with fighters
      const fighters: Record<string, Fighter> = {
        'f1': {
          id: 'f1',
          name: 'Israel Adesanya',
          record: '24-2',
          weightClass: 'Middleweight'
        },
        'f2': {
          id: 'f2',
          name: 'Alex Pereira',
          record: '8-1',
          weightClass: 'Light Heavyweight'
        }
      };
      
      const fighter1 = fighters[fighter1Id];
      const fighter2 = fighters[fighter2Id];
      
      if (!fighter1 || !fighter2) {
        throw new Error('One or more fighters not found');
      }
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getUFCPrediction(
          fighter1,
          fighter2,
          'UFC 300'
        ) as UFCPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error('Prediction not found for this matchup');
      }
    } catch (error) {
      console.error('Error fetching matchup prediction:', error);
      throw error;
    }
  }

  /**
   * Request a new prediction for a matchup
   */
  async requestPrediction(fighter1Id: string, fighter2Id: string, event: string): Promise<UFCPrediction> {
    console.log('Requesting prediction:', fighter1Id, fighter2Id, event);
    try {
      this.logApiCall(`POST ${this.endpoint}/predictions/request`, {fighter1Id, fighter2Id, event});
      
      // Mock fighters based on IDs
      const fighters: Record<string, Fighter> = {
        'f1': {
          id: 'f1',
          name: 'Israel Adesanya',
          record: '24-2',
          weightClass: 'Middleweight'
        },
        'f2': {
          id: 'f2',
          name: 'Alex Pereira',
          record: '8-1',
          weightClass: 'Light Heavyweight'
        }
      };
      
      // If fighter IDs not in mock data, use them directly as names
      const fighter1: Fighter = fighters[fighter1Id] || { name: fighter1Id };
      const fighter2: Fighter = fighters[fighter2Id] || { name: fighter2Id };
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getUFCPrediction(
          fighter1,
          fighter2,
          event
        ) as UFCPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error('Prediction request failed');
      }
    } catch (error) {
      console.error('Error requesting prediction:', error);
      throw error;
    }
  }
  
  /**
   * Helper to log API calls (for development/debug purposes)
   */
  private logApiCall(endpoint: string, data?: unknown): void {
    console.log(`[API Call] ${endpoint}`, data ? data : '');
    // This uses the api field to prevent TypeScript error
    if (!this.api) {
      console.warn('API service not initialized');
    }
  }
}

/**
 * React hook for using the UFC service
 */
import { useApi } from './api.service';
import { useLLMPrediction } from './llm-prediction.service';

export const useUFCService = () => {
  const api = useApi();
  const llmPrediction = useLLMPrediction();
  return new UFCService(api, llmPrediction);
};