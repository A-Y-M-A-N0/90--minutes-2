import { useState, useEffect } from "react";
import { getMatches, getPastMatches, MatchesResponse } from "@/services/footballApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface Match {
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
}

const MatchesPage = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState<boolean>(true);
  const [loadingPast, setLoadingPast] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      setLoadingUpcoming(true);
      const today = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(today.getMonth() + 3);
      
      const dateFrom = today.toISOString().split('T')[0];
      const dateTo = threeMonthsLater.toISOString().split('T')[0];
      
      const result = await getMatches('SCHEDULED', dateFrom, dateTo);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setUpcomingMatches(result.data.matches || []);
      }
      setLoadingUpcoming(false);
    };

    const fetchPastMatches = async () => {
      setLoadingPast(true);
      const result = await getPastMatches();
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setPastMatches(result.data.matches || []);
      }
      setLoadingPast(false);
    };

    fetchUpcomingMatches();
    fetchPastMatches();
  }, []);

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const renderMatchList = (matches: Match[], loading: boolean) => {
    if (loading) {
      return (
        <div className="p-4 space-y-6">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <p>Please try again later or check your API key.</p>
        </div>
      );
    }
    
    if (matches.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">No matches found.</p>
        </div>
      );
    }
    
    // Group matches by matchday
    const groupedMatches: Record<string, Match[]> = {};
    
    matches.forEach(match => {
      const key = `Matchday ${match.matchday}`;
      if (!groupedMatches[key]) {
        groupedMatches[key] = [];
      }
      groupedMatches[key].push(match);
    });
    
    return (
      <div className="space-y-6 p-4">
        {Object.entries(groupedMatches).map(([matchday, matchesList]) => (
          <div key={matchday}>
            <h3 className="font-bold text-lg mb-4">{matchday}</h3>
            <div className="space-y-4">
              {matchesList.map(match => (
                <div key={match.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="text-xs text-gray-500 mb-2">{formatMatchDate(match.utcDate)}</div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      {match.homeTeam.crest && (
                        <img
                          src={match.homeTeam.crest}
                          alt={`${match.homeTeam.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      )}
                      <span className="font-medium">{match.homeTeam.name}</span>
                    </div>
                    
                    <div className="px-4">
                      {match.status === 'FINISHED' ? (
                        <div className="text-xl font-bold mx-2">
                          {match.score.fullTime.home} - {match.score.fullTime.away}
                        </div>
                      ) : (
                        <div className="text-sm font-medium bg-premier-light px-3 py-1 rounded">
                          vs
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 justify-end flex-1">
                      <span className="font-medium">{match.awayTeam.name}</span>
                      {match.awayTeam.crest && (
                        <img
                          src={match.awayTeam.crest}
                          alt={`${match.awayTeam.name} logo`}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-premier-purple mb-2">Matches</h1>
        <p className="text-gray-600">Premier League Fixtures and Results</p>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Upcoming Matches</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader className="bg-premier-purple text-white">
              <CardTitle>Upcoming Fixtures</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderMatchList(upcomingMatches, loadingUpcoming)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader className="bg-premier-purple text-white">
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderMatchList(pastMatches, loadingPast)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Data provided by the Football-Data.org API</p>
      </div>
    </div>
  );
};

export default MatchesPage;
