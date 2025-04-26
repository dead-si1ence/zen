import { ApiService } from './api.service';
import { LLMPredictionService } from './llm-prediction.service';
import { FootballPrediction, ApiResponse, FilterOptions } from '../types/models';

/**
 * Service for Football related API calls
 */
export class FootballService {
  private api: ApiService;
  private endpoint = 'football';
  private llmService: LLMPredictionService;

  constructor(apiService: ApiService, llmService: LLMPredictionService) {
    this.api = apiService;
    this.llmService = llmService;
  }

  /**
   * Get all football predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<FootballPrediction[]>> {
    console.log('Fetching football predictions with filters:', filters);
    try {
      // For demo purposes, generate predictions using LLM
      this.logApiCall(`GET ${this.endpoint}`, filters);
      
      // Mock data with LLM-generated predictions
      const mockPredictions: FootballPrediction[] = [];
      
      try {
        const prediction = await this.llmService.getFootballPrediction(
          'FC Barcelona',
          'Real Madrid'
        ) as FootballPrediction;
        
        mockPredictions.push(prediction);
        
        // Add a second prediction
        const prediction2 = await this.llmService.getFootballPrediction(
          'Manchester City',
          'Liverpool'
        ) as FootballPrediction;
        
        mockPredictions.push(prediction2);
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        
        // Fallback data if LLM fails
        mockPredictions.push({
          id: '1',
          homeTeam: 'FC Barcelona',
          awayTeam: 'Real Madrid',
          winner: 'FC Barcelona',
          score: '2-1',
          confidence: 65,
          date: '2025-05-10'
        });
      }
      
      return {
        data: mockPredictions,
        metadata: { total: mockPredictions.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching football predictions:', error);
      throw error;
    }
  }

  /**
   * Get a single football prediction by ID
   */
  async getPredictionById(id: string): Promise<FootballPrediction> {
    console.log('Fetching football prediction by ID:', id);
    try {
      this.logApiCall(`GET ${this.endpoint}/${id}`);
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFootballPrediction(
          'Bayern Munich',
          'Borussia Dortmund'
        ) as FootballPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Football prediction with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching football prediction by ID:', error);
      throw error;
    }
  }

  /**
   * Get all available football competitions/leagues
   */
  async getCompetitions(): Promise<ApiResponse<string[]>> {
    console.log('Fetching available football competitions');
    try {
      this.logApiCall(`GET ${this.endpoint}/competitions`);
      
      // Mock competitions list
      const competitions = [
        'UEFA Champions League',
        'English Premier League',
        'La Liga',
        'Bundesliga',
        'Serie A',
        'Ligue 1',
        'MLS'
      ];
      
      return {
        data: competitions,
        metadata: { total: competitions.length, page: 1, limit: 20 }
      };
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw error;
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(): Promise<ApiResponse<string[]>> {
    console.log('Fetching upcoming football matches');
    try {
      this.logApiCall(`GET ${this.endpoint}/matches/upcoming`);
      
      // Mock upcoming matches
      const upcomingMatches = [
        'FC Barcelona vs Real Madrid',
        'Manchester City vs Liverpool',
        'Bayern Munich vs Borussia Dortmund',
        'PSG vs Marseille',
        'Juventus vs Inter Milan'
      ];
      
      return {
        data: upcomingMatches,
        metadata: { total: upcomingMatches.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  }

  /**
   * Get prediction for a specific match
   */
  async getPredictionForMatchup(homeTeam: string, awayTeam: string): Promise<FootballPrediction> {
    console.log('Fetching prediction for match:', homeTeam, 'vs', awayTeam);
    try {
      this.logApiCall(`GET ${this.endpoint}/matchup`, { homeTeam, awayTeam });
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFootballPrediction(
          homeTeam,
          awayTeam
        ) as FootballPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Prediction for ${homeTeam} vs ${awayTeam} not found`);
      }
    } catch (error) {
      console.error('Error fetching match prediction:', error);
      throw error;
    }
  }

  /**
   * Request a new prediction for a match
   */
  async requestPrediction(homeTeam: string, awayTeam: string, date: string): Promise<FootballPrediction> {
    console.log('Requesting football prediction:', homeTeam, 'vs', awayTeam, date);
    try {
      this.logApiCall(`POST ${this.endpoint}/predictions/request`, { homeTeam, awayTeam, date });
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getFootballPrediction(
          homeTeam,
          awayTeam
        ) as FootballPrediction;
        
        // Add the requested date to the prediction
        prediction.date = date;
        
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
   * Get team standings for a specific league
   */
  async getLeagueStandings(league: string): Promise<ApiResponse<any[]>> {
    console.log('Fetching standings for league:', league);
    try {
      this.logApiCall(`GET ${this.endpoint}/standings/${league}`);
      
      // Mock standings data for different leagues
      const standings: Record<string, any[]> = {
        'laliga': [
          { position: 1, team: 'FC Barcelona', points: 80, goalDifference: 45 },
          { position: 2, team: 'Real Madrid', points: 78, goalDifference: 40 },
          { position: 3, team: 'Atletico Madrid', points: 70, goalDifference: 25 }
        ],
        'premier-league': [
          { position: 1, team: 'Manchester City', points: 85, goalDifference: 55 },
          { position: 2, team: 'Liverpool', points: 82, goalDifference: 50 },
          { position: 3, team: 'Arsenal', points: 75, goalDifference: 35 }
        ]
      };
      
      const leagueKey = league.toLowerCase().replace(' ', '-');
      const leagueStandings = standings[leagueKey] || [];
      
      return {
        data: leagueStandings,
        metadata: { total: leagueStandings.length, page: 1, limit: 20 }
      };
    } catch (error) {
      console.error('Error fetching league standings:', error);
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
 * React hook for using the Football service
 */
import { useApi } from './api.service';
import { useLLMPrediction } from './llm-prediction.service';

export const useFootballService = () => {
  const api = useApi();
  const llmPrediction = useLLMPrediction();
  return new FootballService(api, llmPrediction);
};