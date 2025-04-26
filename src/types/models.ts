/**
 * Common types for the application
 */

// Base prediction interface
export interface Prediction {
  id: string;
  sport?: SportType;
  confidence?: number; // 0-100
  status?: PredictionStatus;
  date?: string;
  timestamp?: string;
  explanation?: string;
}

// Sport-specific prediction types
export interface UFCPrediction extends Prediction {
  sport?: 'ufc';
  event: string;
  fighter1: Fighter;
  fighter2: Fighter;
  date: string;
  winner?: string;
  method?: string;
  round?: number;
  confidence?: number;
  // Keeping backward compatibility with existing code
  prediction?: {
    winner: string;
    confidence: number;
    method: string;
    round: number;
  };
  predictedWinner?: string;
  predictedMethod?: string;
  predictedRound?: number;
  timestamp?: string;
  explanation?: string;
}

export interface Formula1Prediction extends Prediction {
  sport?: 'formula1';
  grandPrix?: string;
  date: string;
  name?: string;
  predictions?: {
    pole?: Driver;
    podium?: Driver[];
    fastestLap?: Driver | null;
  };
  circuit?: string;
  circuitImageUrl?: string;
  raceDate?: string;
  location?: string;
  circuitLength?: string;
  laps?: number;
  podium?: { position: number; driver: Driver }[];
  polePosition?: Driver;
  fastestLap?: Driver;
  weatherImpact?: string;
  safetyCar?: boolean;
  timestamp?: string;
  explanation?: string;
}

export interface FootballPrediction extends Prediction {
  sport?: 'football';
  competition?: string;
  date: string;
  homeTeam: string | Team;
  awayTeam: string | Team;
  winner?: string;
  score?: string;
  // Keeping backward compatibility with existing code
  prediction?: {
    winner: string;
    confidence: number;
    score: string;
  }
}

export interface EsportsPrediction extends Prediction {
  sport?: 'esports';
  game: string;
  tournament?: string;
  date: string;
  team1: string | Team;
  team2: string | Team;
  winner?: string;
  score?: string;
  mvp?: string;
  // Keeping backward compatibility with existing code
  prediction?: {
    winner: string;
    confidence: number;
    score: string;
  }
}

// Sport entities
export interface Fighter {
  id?: string;
  name: string;
  record?: string;
  imageUrl?: string;
  team?: string;
  stats?: FighterStats;
  image?: string;
  weightClass?: string;
  age?: number;
  height?: string;
  reach?: string;
}

export interface FighterStats {
  wins: number;
  losses: number;
  draws: number;
  knockouts?: number;
  submissions?: number;
  strikingAccuracy?: number;
  takedownAccuracy?: number;
  takedownDefense?: number;
  grapplingAccuracy?: number;
}

export interface Driver {
  id?: string;
  name: string;
  team?: string;
  number?: number;
  imageUrl?: string;
  image?: string;
  nationality?: string;
  points?: number;
  podiums?: number;
  wins?: number;
  stats?: any;
}

export interface Team {
  id?: string;
  name: string;
  logoUrl?: string;
  stats?: TeamStats;
  image?: string;
}

export interface TeamStats {
  wins: number;
  losses: number;
  draws?: number;
  goalsScored?: number;
  goalsConceded?: number;
  form?: string;
  winrate?: number;
}

export interface Score {
  home?: number;
  away?: number;
  team1?: number;
  team2?: number;
}

// Enums
export type SportType = 'ufc' | 'formula1' | 'football' | 'esports';

export type PredictionStatus = 'pending' | 'correct' | 'incorrect' | 'partially-correct' | 'canceled';

// Filter options
export interface FilterOptions {
  sport?: SportType;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: PredictionStatus;
  confidenceRange?: {
    min: number;
    max: number;
  };
  searchTerm?: string;
  game?: string; // Added for esports filtering by game
  competition?: string; // Added for football filtering by competition
}

// Constructor type for Formula 1
export interface Constructor {
  id: string;
  name: string;
  points?: number;
  logo?: string;
  image?: string;  // Alternative field name used in some components
  color?: string;
  nationality?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: Pagination;
  };
  metadata?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

// Error response
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}