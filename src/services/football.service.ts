import { ApiService } from './api.service';
import { FootballPrediction, Team, ApiResponse, FilterOptions } from '../types/models';

// Mock Data
const mockFootballPredictions: FootballPrediction[] = [
  {
    id: 'fb-pred-1',
    competition: 'Champions League Final',
    date: '2025-06-01T19:00:00Z',
    homeTeam: { id: 't5', name: 'Real Madrid', image: '/zen/teams/realmadrid.png' },
    awayTeam: { id: 't6', name: 'Manchester City', image: '/zen/teams/mancity.png' },
    prediction: { winner: 'Real Madrid', confidence: 0.58, score: '2-1' },
    status: 'pending',
  },
  {
    id: 'fb-pred-2',
    competition: 'Premier League',
    date: '2025-08-17T14:00:00Z',
    homeTeam: { id: 't7', name: 'Arsenal', image: '/zen/teams/arsenal.png' },
    awayTeam: { id: 't8', name: 'Liverpool', image: '/zen/teams/liverpool.png' },
    prediction: { winner: 'Draw', confidence: 0.4, score: '1-1' },
    status: 'pending',
  },
];

const mockFootballTeams: { [key: string]: Team } = {
  't5': { id: 't5', name: 'Real Madrid', image: '/zen/teams/realmadrid.png', stats: { form: 'WWWDW'}},
  't6': { id: 't6', name: 'Manchester City', image: '/zen/teams/mancity.png', stats: { form: 'WWWLW'}},
  't7': { id: 't7', name: 'Arsenal', image: '/zen/teams/arsenal.png', stats: { form: 'WLDWW' }},
  't8': { id: 't8', name: 'Liverpool', image: '/zen/teams/liverpool.png', stats: { form: 'WDWLD'}},
};

const mockCompetitions = ['Champions League', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga'];

/**
 * Service for Football related API calls
 */
export class FootballService {
  private api: ApiService;
  private endpoint = 'football';

  constructor(apiService: ApiService) {
    this.api = apiService;
  }

  /**
   * Get all Football predictions with optional filtering
   */
  async getPredictions(filters?: FilterOptions): Promise<ApiResponse<FootballPrediction[]>> {
    console.log('Fetching Football predictions with filters:', filters);
    // Using mock implementation
    await new Promise(resolve => setTimeout(resolve, 750));
    let filteredPredictions = mockFootballPredictions;
    if (filters?.status) {
      filteredPredictions = filteredPredictions.filter(p => p.status === filters.status);
    }
    if (filters?.competition) {
      filteredPredictions = filteredPredictions.filter(p => p.competition === filters.competition);
    }
    return {
      data: filteredPredictions,
      metadata: { total: filteredPredictions.length, page: 1, limit: filteredPredictions.length }
    };
    /* Real API call disabled for now
    return this.api.get<ApiResponse<FootballPrediction[]>>(
      this.endpoint, 
      filters as Record<string, string>
    ); */
  }

  /**
   * Get a single Football prediction by ID
   */
  async getPredictionById(id: string): Promise<FootballPrediction> {
    console.log('Fetching Football prediction by ID:', id);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 400));
    const prediction = mockFootballPredictions.find(p => p.id === id);
    if (!prediction) {
      throw new Error(`Football Prediction with id ${id} not found`);
    }
    return prediction;
    // Real API call disabled for now
    // return this.api.get<FootballPrediction>(`${this.endpoint}/${id}`);
  }

  /**
   * Get upcoming matches
   */
  async getUpcomingMatches(competition?: string): Promise<ApiResponse<{ homeTeam: Team, awayTeam: Team, date: string, competition: string }[]>> {
    console.log('Fetching upcoming Football matches for competition:', competition);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 550));
    let upcoming = mockFootballPredictions
      .filter(p => p.status === 'pending')
      .map(p => ({ homeTeam: p.homeTeam, awayTeam: p.awayTeam, date: p.date, competition: p.competition }));

    if (competition) {
      upcoming = upcoming.filter(m => m.competition === competition);
    }
    return {
      data: upcoming,
      metadata: { total: upcoming.length, page: 1, limit: upcoming.length }
    };
    // Real API call disabled for now
    // const params: Record<string, string> = {};
    // if (competition) {
    //   params.competition = competition;
    // }
    // return this.api.get<ApiResponse<{homeTeam: Team, awayTeam: Team, date: string, competition: string}[]>>(`${this.endpoint}/matches/upcoming`, params);
  }

  /**
   * Get team details
   */
  async getTeamDetails(teamId: string): Promise<Team> {
    console.log('Fetching team details:', teamId);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 350));
    const team = mockFootballTeams[teamId];
    if (!team) {
      throw new Error(`Team with id ${teamId} not found`);
    }
    return team;
    // Real API call disabled for now
    // return this.api.get<Team>(`${this.endpoint}/teams/${teamId}`);
  }

  /**
   * Get available competitions
   */
  async getCompetitions(): Promise<ApiResponse<string[]>> {
    console.log('Fetching available competitions');
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 250));
    return {
      data: mockCompetitions,
      metadata: { total: mockCompetitions.length, page: 1, limit: mockCompetitions.length }
    };
    // Real API call disabled for now
    // return this.api.get<ApiResponse<string[]>>(`${this.endpoint}/competitions`);
  }

  /**
   * Get prediction for a specific match
   */
  async getPredictionForMatch(homeTeamId: string, awayTeamId: string, competition: string): Promise<FootballPrediction> {
    console.log('Fetching prediction for match:', homeTeamId, awayTeamId, competition);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 700));
    const existing = mockFootballPredictions.find(p =>
      p.homeTeam.id === homeTeamId && p.awayTeam.id === awayTeamId && p.competition === competition
    );
    if (existing) return existing;

    const homeTeam = mockFootballTeams[homeTeamId];
    const awayTeam = mockFootballTeams[awayTeamId];
    if (!homeTeam || !awayTeam) throw new Error('One or both teams not found');

    // Create a generic mock prediction
    return {
      id: `fb-custom-${Date.now()}`,
      competition: competition,
      date: new Date().toISOString(),
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      prediction: { winner: homeTeam.name, confidence: 0.51, score: '1-0' },
      status: 'pending',
    };
    // Real API call disabled for now
    // return this.api.get<FootballPrediction>(`${this.endpoint}/match-prediction`, {
    //   homeTeam: homeTeamId,
    //   awayTeam: awayTeamId,
    //   competition
    // });
  }

  /**
   * Request a new prediction for a match
   */
  async requestPrediction(homeTeamId: string, awayTeamId: string, competition: string, date: string): Promise<FootballPrediction> {
    console.log('Requesting Football prediction:', homeTeamId, awayTeamId, competition, date);
    // Use mock implementation
    await new Promise(resolve => setTimeout(resolve, 950));
    const homeTeam = mockFootballTeams[homeTeamId];
    const awayTeam = mockFootballTeams[awayTeamId];
    if (!homeTeam || !awayTeam) throw new Error('One or both teams not found');

    const newPrediction: FootballPrediction = {
      id: `fb-req-${Date.now()}`,
      competition: competition,
      date: date || new Date().toISOString(),
      homeTeam: homeTeam,
      awayTeam: awayTeam,
      prediction: { winner: homeTeam.name, confidence: Math.random() * 0.4 + 0.3, score: '1-0' }, // Random confidence
      status: 'pending',
    };
    mockFootballPredictions.push(newPrediction); // Add to mock data (won't persist)
    return newPrediction;
    // Real API call disabled for now
    // return this.api.post<FootballPrediction>(`${this.endpoint}/predictions/request`, {
    //   homeTeamId,
    //   awayTeamId,
    //   competition,
    //   date
    // });
  }
}

/**
 * React hook for using the Football service
 */
import { useApi } from './api.service';

export const useFootballService = () => {
  const api = useApi();
  return new FootballService(api);
};