import { ApiService } from './api.service';
import { EsportsPrediction, Team, ApiResponse, FilterOptions } from '../types/models';

// Mock Data
const mockEsportsPredictions: EsportsPrediction[] = [
  {
    id: 'esports-pred-1',
    game: 'League of Legends',
    tournament: 'LEC Summer Finals',
    date: '2025-08-20T16:00:00Z',
    team1: { id: 't1', name: 'G2 Esports', image: '/zen/teams/g2.png' },
    team2: { id: 't2', name: 'Fnatic', image: '/zen/teams/fnatic.png' },
    prediction: { winner: 'G2 Esports', confidence: 0.6, score: '3-1' },
    status: 'pending',
  },
  {
    id: 'esports-pred-2',
    game: 'CS2',
    tournament: 'IEM Cologne',
    date: '2025-07-30T18:00:00Z',
    team1: { id: 't3', name: 'FaZe Clan', image: '/zen/teams/faze.png' },
    team2: { id: 't4', name: 'Natus Vincere', image: '/zen/teams/navi.png' },
    prediction: { winner: 'FaZe Clan', confidence: 0.55, score: '2-1' },
    status: 'pending',
  },
  {
    id: 'esports-pred-3',
    game: 'Valorant',
    tournament: 'VCT Champions',
    date: '2025-09-15T17:30:00Z',
    team1: { id: 't5', name: 'Sentinels', image: '/zen/teams/sentinels.png' },
    team2: { id: 't6', name: 'Cloud9', image: '/zen/teams/cloud9.png' },
    prediction: { winner: 'Sentinels', confidence: 0.62, score: '3-2' },
    status: 'pending',
  }
];

const mockTeams: { [key: string]: Team } = {
  't1': { id: 't1', name: 'G2 Esports', image: '/zen/teams/g2.png', stats: { winrate: 0.7, recentForm: 'WWLWW' } },
  't2': { id: 't2', name: 'Fnatic', image: '/zen/teams/fnatic.png', stats: { winrate: 0.65, recentForm: 'LWWLW' } },
  't3': { id: 't3', name: 'FaZe Clan', image: '/zen/teams/faze.png', stats: { winrate: 0.75, recentForm: 'WWWWW' } },
  't4': { id: 't4', name: 'Natus Vincere', image: '/zen/teams/navi.png', stats: { winrate: 0.68, recentForm: 'WLWLW' } },
  't5': { id: 't5', name: 'Sentinels', image: '/zen/teams/sentinels.png', stats: { winrate: 0.72, recentForm: 'WWWLW' } },
  't6': { id: 't6', name: 'Cloud9', image: '/zen/teams/cloud9.png', stats: { winrate: 0.67, recentForm: 'WLWWW' } },
};

const mockGames = ['League of Legends', 'CS2', 'Dota 2', 'Valorant'];
const mockTournaments: { [key: string]: string[] } = {
    'League of Legends': ['LEC Summer Finals', 'Worlds', 'MSI'],
    'CS2': ['IEM Cologne', 'PGL Major', 'BLAST Premier'],
    'Dota 2': ['The International', 'Riyadh Masters'],
    'Valorant': ['VCT Champions', 'VCT Masters'],
};

/**
 * Service for Esports related API calls
 */
export class EsportsService {
  private api: ApiService;
  private endpoint = 'esports';

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  /**
   * Get all Esports predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<EsportsPrediction[]>> {
    console.log('Fetching Esports predictions with filters:', filters);
    // Using mock implementation instead of real API call
    await new Promise(resolve => setTimeout(resolve, 750));
    let filteredPredictions = mockEsportsPredictions;
    if (filters?.game) {
      filteredPredictions = filteredPredictions.filter(p => p.game === filters.game);
    }
    if (filters?.status) {
      filteredPredictions = filteredPredictions.filter(p => p.status === filters.status);
    }
    return {
      data: filteredPredictions,
      metadata: { total: filteredPredictions.length, page: 1, limit: filteredPredictions.length }
    };
  }

  /**
   * Get a single Esports prediction by ID
   */
  async getPredictionById(id: string): Promise<EsportsPrediction> {
    console.log('Fetching Esports prediction by ID:', id);
    // Using mock implementation
    await new Promise(resolve => setTimeout(resolve, 580));
    const prediction = mockEsportsPredictions.find(p => p.id === id);
    if (!prediction) {
      throw new Error(`Esports Prediction with id ${id} not found`);
    }
    return prediction;
    // Real API call disabled for now
    // return this.api.get<EsportsPrediction>(`${this.endpoint}/${id}`);
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(game?: string): Promise<ApiResponse<{ team1: Team, team2: Team, date: string, game: string }[]>> {
    console.log('Fetching upcoming Esports matches for game:', game);
    // Using mock implementation
    await new Promise(resolve => setTimeout(resolve, 600));
    let upcoming = mockEsportsPredictions
      .filter(p => p.status === 'pending')
      .map(p => ({ team1: p.team1, team2: p.team2, date: p.date, game: p.game }));

    if (game) {
      upcoming = upcoming.filter(m => m.game === game);
    }
    return {
      data: upcoming,
      metadata: { total: upcoming.length, page: 1, limit: upcoming.length }
    };
    // Real API call disabled for now
    // const params: Record<string, string> = {};
    // if (game) {
    //   params.game = game;
    // }
    // return this.api.get<ApiResponse<{team1: Team, team2: Team, date: string, game: string}[]>>(`${this.endpoint}/matches/upcoming`, params);
  }

  /**
   * Get team details (Mock Implementation)
   */
  async getTeamDetails(teamId: string): Promise<Team> {
    console.log('Fetching mock team details:', teamId);
    await new Promise(resolve => setTimeout(resolve, 280));
    const team = mockTeams[teamId];
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }
    return team;
    // Original API call commented out
    // return this.api.get<Team>(`${this.endpoint}/teams/${teamId}`);
  }

  /**
   * Get available games (Mock Implementation)
   */
  async getGames(): Promise<ApiResponse<string[]>> {
    console.log('Fetching mock available games');
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
        data: mockGames,
        metadata: { total: mockGames.length, page: 1, limit: mockGames.length }
    };
    // Original API call commented out
    // return this.api.get<ApiResponse<string[]>>(`${this.endpoint}/games`);
  }

  /**
   * Get available tournaments for a game (Mock Implementation)
   */
  async getTournaments(game: string): Promise<ApiResponse<string[]>> {
    console.log('Fetching mock tournaments for game:', game);
    await new Promise(resolve => setTimeout(resolve, 220));
    const tournaments = mockTournaments[game] || [];
    return {
        data: tournaments,
        metadata: { total: tournaments.length, page: 1, limit: tournaments.length }
    };
    // Original API call commented out
    // return this.api.get<ApiResponse<string[]>>(`${this.endpoint}/tournaments`, { game });
  }

  /**
   * Get prediction for a specific match (Mock Implementation)
   */
  async getPredictionForMatch(team1Id: string, team2Id: string, game: string, tournament: string): Promise<EsportsPrediction> {
    console.log('Fetching mock prediction for match:', team1Id, team2Id, game, tournament);
    await new Promise(resolve => setTimeout(resolve, 620));
    const existing = mockEsportsPredictions.find(p =>
        p.team1.id === team1Id && p.team2.id === team2Id && p.game === game && p.tournament === tournament
    );
    if (existing) return existing;

    const team1 = mockTeams[team1Id];
    const team2 = mockTeams[team2Id];
    if (!team1 || !team2) throw new Error('One or both teams not found');

    // Create a generic mock prediction
    return {
        id: `esports-custom-${Date.now()}`,
        game: game,
        tournament: tournament,
        date: new Date().toISOString(),
        team1: team1,
        team2: team2,
        prediction: { winner: team1.name, confidence: 0.52, score: '2-1' },
        status: 'pending',
    };
    // Original API call commented out
    // return this.api.get<EsportsPrediction>(`${this.endpoint}/match-prediction`, {
    //   team1: team1Id,
    //   team2: team2Id,
    //   game,
    //   tournament
    // });
  }

  /**
   * Request a new prediction for a match (Mock Implementation)
   */
  async requestPrediction(team1Id: string, team2Id: string, game: string, tournament: string, date: string): Promise<EsportsPrediction> {
    console.log('Requesting mock Esports prediction:', team1Id, team2Id, game, tournament, date);
    await new Promise(resolve => setTimeout(resolve, 1050));
    const team1 = mockTeams[team1Id];
    const team2 = mockTeams[team2Id];
    if (!team1 || !team2) throw new Error('One or both teams not found');

    const newPrediction: EsportsPrediction = {
        id: `esports-req-${Date.now()}`,
        game: game,
        tournament: tournament,
        date: date || new Date().toISOString(),
        team1: team1,
        team2: team2,
        prediction: { winner: team1.name, confidence: Math.random() * 0.4 + 0.3, score: '2-1' }, // Random confidence
        status: 'pending',
     };
     mockEsportsPredictions.push(newPrediction); // Add to mock data (won't persist)
     return newPrediction;
    // Original API call commented out
    // return this.api.post<EsportsPrediction>(`${this.endpoint}/predictions/request`, {
    //   team1Id,
    //   team2Id,
    //   game,
    //   tournament,
    //   date
    // });
  }
}

/**
 * React hook for using the Esports service
 */
import { useApi } from './api.service';

export const useEsportsService = () => {
  const api = useApi();
  return new EsportsService(api);
};