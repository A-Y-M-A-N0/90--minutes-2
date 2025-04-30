
import { toast } from "sonner";

const API_KEY = '9e5f354e6088bb300046c7a2ffbaa7e36be102b893bcfda77bac6d50b2be9028';
const BASE_URL = 'https://api.football-data.org/v4';

// Define the API response types
export interface StandingsResponse {
  standings: Array<{
    table: Array<{
      position: number;
      team: {
        id: number;
        name: string;
        crest?: string;
        crestUrl?: string;
      };
      playedGames: number;
      won: number;
      draw: number;
      lost: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalDifference: number;
    }>;
  }>;
}

export interface MatchesResponse {
  matches: Array<{
    id: number;
    utcDate: string;
    status: string;
    matchday: number;
    stage: string;
    homeTeam: {
      id: number;
      name: string;
      crest?: string;
    };
    awayTeam: {
      id: number;
      name: string;
      crest?: string;
    };
    score: {
      fullTime: {
        home: number | null;
        away: number | null;
      };
    };
  }>;
}

export interface ScorersResponse {
  scorers: Array<{
    player: {
      id: number;
      name: string;
      nationality?: string;
    };
    team: {
      id: number;
      name: string;
      crest?: string;
    };
    playedMatches: number;
    goals: number;
    assists?: number;
    penalties?: number;
  }>;
}

export interface TeamInfoResponse {
  id: number;
  name: string;
  crest: string;
  // Add other team properties as needed
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const headers = {
  'X-Auth-Token': API_KEY,
};

// Helper function to handle API calls
async function fetchFromAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
    
    if (!response.ok) {
      // Handle rate limiting or other API errors
      if (response.status === 429) {
        toast.error("API rate limit exceeded. Please try again later.");
      }
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Get Premier League standings
export const getStandings = () => {
  return fetchFromAPI<StandingsResponse>('/competitions/PL/standings');
};

// Get upcoming matches
export const getMatches = (status = 'SCHEDULED', dateFrom?: string, dateTo?: string) => {
  let endpoint = `/competitions/PL/matches?status=${status}`;
  
  if (dateFrom) endpoint += `&dateFrom=${dateFrom}`;
  if (dateTo) endpoint += `&dateTo=${dateTo}`;
  
  return fetchFromAPI<MatchesResponse>(endpoint);
};

// Get finished matches (past matches)
export const getPastMatches = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const dateFrom = oneMonthAgo.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  
  return fetchFromAPI<MatchesResponse>(`/competitions/PL/matches?status=FINISHED&dateFrom=${dateFrom}&dateTo=${dateTo}`);
};

// Get top scorers
export const getTopScorers = () => {
  return fetchFromAPI<ScorersResponse>('/competitions/PL/scorers?limit=10');
};

// Get team information
export const getTeamInfo = (teamId: number) => {
  return fetchFromAPI<TeamInfoResponse>(`/teams/${teamId}`);
};
