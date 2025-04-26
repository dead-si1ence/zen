import { ApiService } from './api.service';
import { LLMPredictionService } from './llm-prediction.service';
import { EsportsPrediction, ApiResponse, FilterOptions } from '../types/models';

/**
 * Service for Esports related API calls
 */
export class EsportsService {
  private api: ApiService;
  private endpoint = 'esports';
  private llmService: LLMPredictionService;

  constructor(apiService: ApiService, llmService: LLMPredictionService) {
    this.api = apiService;
    this.llmService = llmService;
  }

  /**
   * Get all esports predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<EsportsPrediction[]>> {
    console.log('Fetching esports predictions with filters:', filters);
    try {
      // For demo purposes, generate predictions using LLM
      this.logApiCall(`GET ${this.endpoint}`, filters);
      
      // Mock data with LLM-generated predictions
      const mockPredictions: EsportsPrediction[] = [];
      
      try {
        const prediction = await this.llmService.getEsportsPrediction(
          'League of Legends',
          'T1',
          'G2 Esports'
        ) as EsportsPrediction;
        
        mockPredictions.push(prediction);
        
        // Add a second prediction
        const prediction2 = await this.llmService.getEsportsPrediction(
          'Counter-Strike',
          'Natus Vincere',
          'FaZe Clan'
        ) as EsportsPrediction;
        
        mockPredictions.push(prediction2);
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        
        // Fallback data if LLM fails
        mockPredictions.push({
          id: '1',
          team1: 'T1',
          team2: 'G2 Esports',
          game: 'League of Legends',
          winner: 'T1',
          score: '3-1',
          confidence: 75,
          date: '2025-05-18',
          mvp: 'Faker'
        });
      }
      
      return {
        data: mockPredictions,
        metadata: { total: mockPredictions.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching esports predictions:', error);
      throw error;
    }
  }

  /**
   * Get a single esports prediction by ID
   */
  async getPredictionById(id: string): Promise<EsportsPrediction> {
    console.log('Fetching esports prediction by ID:', id);
    try {
      this.logApiCall(`GET ${this.endpoint}/${id}`);
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getEsportsPrediction(
          'Dota 2',
          'Team Secret',
          'OG'
        ) as EsportsPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Esports prediction with id ${id} not found`);
      }
    } catch (error) {
      console.error('Error fetching esports prediction by ID:', error);
      throw error;
    }
  }

  /**
   * Get all supported esports games
   */
  async getGames(): Promise<ApiResponse<string[]>> {
    console.log('Fetching supported esports games');
    try {
      this.logApiCall(`GET ${this.endpoint}/games`);
      
      // Mock games list
      const games = [
        'League of Legends',
        'Dota 2',
        'Counter-Strike',
        'Valorant',
        'Call of Duty',
        'Overwatch'
      ];
      
      return {
        data: games,
        metadata: { total: games.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching esports games:', error);
      throw error;
    }
  }

  /**
   * Get tournaments for a specific game
   */
  async getTournaments(game: string): Promise<ApiResponse<string[]>> {
    console.log('Fetching tournaments for game:', game);
    try {
      this.logApiCall(`GET ${this.endpoint}/games/${game}/tournaments`);
      
      // Mock tournaments for different games
      const tournaments: Record<string, string[]> = {
        'League of Legends': ['World Championship', 'Mid-Season Invitational', 'LCS', 'LEC', 'LCK'],
        'Counter-Strike': ['Major Championship', 'ESL Pro League', 'BLAST Premier', 'IEM'],
        'Dota 2': ['The International', 'ESL One', 'DreamLeague', 'WePlay AniMajor'],
        'Valorant': ['Champions Tour', 'Masters', 'Challengers']
      };
      
      // Normalize game name to match keys (case insensitive)
      const normalizedGame = Object.keys(tournaments).find(
        g => g.toLowerCase() === game.toLowerCase()
      ) || game;
      
      const gameTournaments = tournaments[normalizedGame] || [];
      
      return {
        data: gameTournaments,
        metadata: { total: gameTournaments.length, page: 1, limit: 10 }
      };
    } catch (error) {
      console.error('Error fetching tournaments for game:', error);
      throw error;
    }
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(): Promise<ApiResponse<string[]>> {
    console.log('Fetching upcoming esports matches');
    try {
      this.logApiCall(`GET ${this.endpoint}/matches/upcoming`);
      
      // Mock upcoming matches
      const upcomingMatches = [
        'T1 vs G2 Esports - League of Legends',
        'Natus Vincere vs FaZe Clan - Counter-Strike',
        'Team Secret vs OG - Dota 2',
        'Sentinels vs Fnatic - Valorant',
        'Dallas Empire vs Atlanta FaZe - Call of Duty'
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
  async getPredictionForMatchup(game: string, team1: string, team2: string): Promise<EsportsPrediction> {
    console.log('Fetching prediction for match:', team1, 'vs', team2, 'in', game);
    try {
      this.logApiCall(`GET ${this.endpoint}/matchup`, { game, team1, team2 });
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getEsportsPrediction(
          game,
          team1,
          team2
        ) as EsportsPrediction;
        
        return prediction;
      } catch (e) {
        console.warn('Failed to get LLM prediction, using fallback data');
        throw new Error(`Prediction for ${team1} vs ${team2} not found`);
      }
    } catch (error) {
      console.error('Error fetching matchup prediction:', error);
      throw error;
    }
  }

  /**
   * Request a new prediction for a match
   */
  async requestPrediction(game: string, team1: string, team2: string, date: string): Promise<EsportsPrediction> {
    console.log('Requesting esports prediction:', team1, 'vs', team2, 'in', game, date);
    try {
      this.logApiCall(`POST ${this.endpoint}/predictions/request`, { game, team1, team2, date });
      
      // Get LLM prediction
      try {
        const prediction = await this.llmService.getEsportsPrediction(
          game,
          team1,
          team2
        ) as EsportsPrediction;
        
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
   * Get team statistics for a specific game
   */
  async getTeamStats(game: string, team: string): Promise<any> {
    console.log('Fetching team stats:', team, 'in', game);
    try {
      this.logApiCall(`GET ${this.endpoint}/stats/${game}/teams/${team}`);
      
      // Mock team stats for different games
      const teamStats: Record<string, Record<string, any>> = {
        'league-of-legends': {
          't1': {
            team: 'T1',
            wins: 25,
            losses: 4,
            winRate: 86.2,
            championships: 4,
            players: ['Faker', 'Zeus', 'Oner', 'Gumayusi', 'Keria']
          }
        },
        'counter-strike': {
          'natus-vincere': {
            team: 'Natus Vincere',
            wins: 150,
            losses: 37,
            winRate: 80.2,
            championships: 3,
            players: ['s1mple', 'electronic', 'b1t', 'Perfecto', 'sdy']
          }
        }
      };
      
      const gameKey = game.toLowerCase().replace(' ', '-');
      const teamKey = team.toLowerCase().replace(' ', '-');
      
      const stats = teamStats[gameKey]?.[teamKey];
      if (stats) return stats;
      
      throw new Error(`Stats for ${team} in ${game} not found`);
    } catch (error) {
      console.error('Error fetching team stats:', error);
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
 * React hook for using the Esports service
 */
import { useApi } from './api.service';
import { useLLMPrediction } from './llm-prediction.service';

export const useEsportsService = () => {
  const api = useApi();
  const llmPrediction = useLLMPrediction();
  return new EsportsService(api, llmPrediction);
};