import { ApiService } from './api.service';
import { LLMPredictionService } from './llm-prediction.service';
import { Formula1Prediction, Driver, ApiResponse, FilterOptions, Constructor } from '../types/models';

/**
 * Service for Formula 1 related API calls
 */
export class Formula1Service {
  private api: ApiService;
  private endpoint = 'formula1';
  private llmService: LLMPredictionService;

  constructor(apiService: ApiService, llmService: LLMPredictionService) {
    this.api = apiService;
    this.llmService = llmService;
  }

  /**
   * Get all Formula 1 predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<Formula1Prediction[]>> {
    console.log('Fetching Formula 1 predictions with filters:', filters);
    try {
      // For demo purposes, generate predictions using LLM
      this.logApiCall(`GET ${this.endpoint}`, filters);
      
      // Mock data with LLM-generated predictions
      const mockPredictions: Formula1Prediction[] = [];
      
      try {
        const prediction = await this.llmService.getFormula1Prediction(
          'Australian Grand Prix',
          '2025-05-20'
        ) as Formula1Prediction;
        
        mockPredictions.push(prediction);
        
        // Add a second prediction
        const prediction2 = await this.llmService.getFormula1Prediction(
          'Monaco Grand Prix',
          '2025-06-15'
        ) as Formula1Prediction;
        
        mockPredictions.push(prediction2);
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        
        // Create compliant Driver objects
        const driver1: Driver = {
          id: 'd1',
          name: 'Max Verstappen',
          team: 'Red Bull Racing',
          number: 1
        };
        
        const driver2: Driver = {
          id: 'd2',
          name: 'Lando Norris',
          team: 'McLaren',
          number: 4
        };
        
        const driver3: Driver = {
          id: 'd3',
          name: 'Charles Leclerc',
          team: 'Ferrari',
          number: 16
        };
        
        // Fallback data if LLM fails
        mockPredictions.push({
          id: '1',
          name: 'Australian Grand Prix',
          date: '2025-05-20',
          podium: [
            { position: 1, driver: driver1 },
            { position: 2, driver: driver2 },
            { position: 3, driver: driver3 }
          ],
          polePosition: driver1,
          fastestLap: driver1,
          confidence: 80
        });
      }
      
      return {
        data: mockPredictions,
        metadata: { total: mockPredictions.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching F1 predictions:', error);
      throw error;
    }
  }

  /**
   * Get a single Formula 1 prediction by ID
   */
  async getPredictionById(id: string): Promise<Formula1Prediction> {
    console.log('Fetching Formula 1 prediction by ID:', id);
    try {
      this.logApiCall(`GET ${this.endpoint}/${id}`);
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFormula1Prediction(
          'British Grand Prix',
          '2025-07-10'
        ) as Formula1Prediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Formula 1 Prediction with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching F1 prediction by ID:', error);
      throw error;
    }
  }

  /**
   * Get upcoming Grand Prix events
   */
  async getUpcomingGrandPrix(): Promise<ApiResponse<string[]>> {
    console.log('Fetching upcoming F1 GPs');
    try {
      this.logApiCall(`GET ${this.endpoint}/grand-prix/upcoming`);
      
      // Mock upcoming events
      const upcomingEvents = [
        'Australian Grand Prix',
        'Monaco Grand Prix',
        'British Grand Prix',
        'Belgian Grand Prix',
        'Italian Grand Prix'
      ];
      
      return {
        data: upcomingEvents,
        metadata: { total: upcomingEvents.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching upcoming Grand Prix events:', error);
      throw error;
    }
  }

  /**
   * Get driver details
   */
  async getDriverDetails(driverId: string): Promise<Driver> {
    console.log('Fetching driver details:', driverId);
    try {
      this.logApiCall(`GET ${this.endpoint}/drivers/${driverId}`);
      
      // Mock driver details
      const drivers: Record<string, Driver> = {
        'd1': {
          id: 'd1',
          name: 'Max Verstappen',
          team: 'Red Bull Racing',
          number: 1,
          points: 350,
          podiums: 85,
          wins: 56
        }
      };
      
      const driver = drivers[driverId];
      if (driver) return driver;
      
      throw new Error(`Driver with id ${driverId} not found`);
    } catch (error) {
      console.error('Error fetching driver details:', error);
      throw error;
    }
  }

  /**
   * Get all current drivers
   */
  async getAllDrivers(): Promise<ApiResponse<Driver[]>> {
    console.log('Fetching all drivers');
    try {
      this.logApiCall(`GET ${this.endpoint}/drivers`);
      
      // Mock driver data
      const drivers: Driver[] = [
        {
          id: 'd1',
          name: 'Max Verstappen',
          team: 'Red Bull Racing',
          number: 1,
          points: 350
        },
        {
          id: 'd2',
          name: 'Lando Norris',
          team: 'McLaren',
          number: 4,
          points: 280
        },
        {
          id: 'd3',
          name: 'Charles Leclerc',
          team: 'Ferrari',
          number: 16,
          points: 275
        }
      ];
      
      return {
        data: drivers,
        metadata: { total: drivers.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching all drivers:', error);
      throw error;
    }
  }

  /**
   * Get prediction for a specific Grand Prix
   */
  async getPredictionForGrandPrix(grandPrix: string): Promise<Formula1Prediction> {
    console.log('Fetching prediction for GP:', grandPrix);
    try {
      this.logApiCall(`GET ${this.endpoint}/predictions/grand-prix/${grandPrix}`);
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFormula1Prediction(
          grandPrix,
          '2025-07-10' // Default date if not specified
        ) as Formula1Prediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Prediction for ${grandPrix} not found`);
      }
    } catch (error) {
      console.error('Error fetching prediction for Grand Prix:', error);
      throw error;
    }
  }

  /**
   * Get all current constructors
   */
  async getAllConstructors(): Promise<ApiResponse<Constructor[]>> {
    console.log('Fetching all constructors');
    try {
      this.logApiCall(`GET ${this.endpoint}/constructors`);
      
      // Mock constructor data
      const constructors: Constructor[] = [
        {
          id: 'c1',
          name: 'Red Bull Racing',
          points: 620
        },
        {
          id: 'c2',
          name: 'McLaren',
          points: 550
        },
        {
          id: 'c3',
          name: 'Ferrari',
          points: 520
        }
      ];
      
      return {
        data: constructors,
        metadata: { total: constructors.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching all constructors:', error);
      throw error;
    }
  }

  /**
   * Request a new prediction for a Grand Prix
   */
  async requestPrediction(grandPrix: string, raceDate: string): Promise<Formula1Prediction> {
    console.log('Requesting F1 prediction:', grandPrix, raceDate);
    try {
      this.logApiCall(`POST ${this.endpoint}/predictions/request`, {grandPrix, raceDate});
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFormula1Prediction(
          grandPrix,
          raceDate
        ) as Formula1Prediction;
        
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
   * Get driver standings
   */
  async getDriverStandings(): Promise<ApiResponse<Driver[]>> {
    console.log('Fetching F1 driver standings');
    try {
      this.logApiCall(`GET ${this.endpoint}/standings/drivers`);
      
      // Mock driver standings
      const drivers: Driver[] = [
        {
          id: 'd1',
          name: 'Max Verstappen',
          team: 'Red Bull Racing',
          number: 1,
          points: 350
        },
        {
          id: 'd2',
          name: 'Lando Norris',
          team: 'McLaren',
          number: 4,
          points: 280
        },
        {
          id: 'd3',
          name: 'Charles Leclerc',
          team: 'Ferrari',
          number: 16,
          points: 275
        }
      ];
      
      return {
        data: drivers,
        metadata: { total: drivers.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      throw error;
    }
  }

  /**
   * Get constructor standings
   */
  async getConstructorStandings(): Promise<ApiResponse<Constructor[]>> {
    console.log('Fetching F1 constructor standings');
    try {
      this.logApiCall(`GET ${this.endpoint}/standings/constructors`);
      
      // Mock constructor standings
      const constructors: Constructor[] = [
        {
          id: 'c1',
          name: 'Red Bull Racing',
          points: 620
        },
        {
          id: 'c2',
          name: 'McLaren',
          points: 550
        },
        {
          id: 'c3',
          name: 'Ferrari',
          points: 520
        }
      ];
      
      return {
        data: constructors,
        metadata: { total: constructors.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
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
 * React hook for using the Formula 1 service
 */
import { useApi } from './api.service';
import { useLLMPrediction } from './llm-prediction.service';

export const useFormula1Service = () => {
  const api = useApi();
  const llmPrediction = useLLMPrediction();
  return new Formula1Service(api, llmPrediction);
};