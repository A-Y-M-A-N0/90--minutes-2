
import { toast } from "sonner";

const API_KEY = '96e05374116a40d4b5de59f5eed18488';
const BASE_URL = 'https://api.football-data.org/v4';

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
  return fetchFromAPI('/competitions/PL/standings');
};

// Get upcoming matches
export const getMatches = (status = 'SCHEDULED', dateFrom?: string, dateTo?: string) => {
  let endpoint = `/competitions/PL/matches?status=${status}`;
  
  if (dateFrom) endpoint += `&dateFrom=${dateFrom}`;
  if (dateTo) endpoint += `&dateTo=${dateTo}`;
  
  return fetchFromAPI(endpoint);
};

// Get finished matches (past matches)
export const getPastMatches = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const dateFrom = oneMonthAgo.toISOString().split('T')[0];
  const dateTo = today.toISOString().split('T')[0];
  
  return fetchFromAPI(`/competitions/PL/matches?status=FINISHED&dateFrom=${dateFrom}&dateTo=${dateTo}`);
};

// Get top scorers
export const getTopScorers = () => {
  return fetchFromAPI('/competitions/PL/scorers?limit=10');
};

// Get team information
export const getTeamInfo = (teamId: number) => {
  return fetchFromAPI(`/teams/${teamId}`);
};
