
import { useState, useEffect } from "react";
import { getTopScorers, ScorersResponse } from "@/services/footballApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Scorer {
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
}

const PlayersPage = () => {
  const [topScorers, setTopScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopScorers = async () => {
      setLoading(true);
      const result = await getTopScorers();

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setTopScorers(result.data.scorers || []);
      }
      setLoading(false);
    };

    fetchTopScorers();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-premier-purple mb-2">Top Players</h1>
        <p className="text-gray-600">Premier League 2023/2024 Statistics</p>
      </div>

      <Tabs defaultValue="scorers" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="scorers">Top Scorers</TabsTrigger>
          <TabsTrigger value="assists">Top Assists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scorers">
          <Card>
            <CardHeader className="bg-premier-purple text-white">
              <CardTitle>Top Goalscorers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-4">
                  {Array(10).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-500">{error}</p>
                  <p>Please try again later or check your API key.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-premier-light">
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Matches</TableHead>
                      <TableHead className="text-center">Goals</TableHead>
                      {topScorers.some(s => s.penalties) && (
                        <TableHead className="text-center">Penalties</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topScorers.map((scorer, index) => (
                      <TableRow key={scorer.player.id} className="hover:bg-gray-50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {scorer.player.name}
                          {scorer.player.nationality && (
                            <span className="text-xs text-gray-500 block">
                              {scorer.player.nationality}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {scorer.team.crest && (
                            <img
                              src={scorer.team.crest}
                              alt={`${scorer.team.name} logo`}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          {scorer.team.name}
                        </TableCell>
                        <TableCell className="text-center">{scorer.playedMatches}</TableCell>
                        <TableCell className="text-center font-bold">{scorer.goals}</TableCell>
                        {topScorers.some(s => s.penalties) && (
                          <TableCell className="text-center">{scorer.penalties || 0}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assists">
          <Card>
            <CardHeader className="bg-premier-purple text-white">
              <CardTitle>Top Assists</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-gray-500">Assists data will be available soon.</p>
              </div>
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

export default PlayersPage;
