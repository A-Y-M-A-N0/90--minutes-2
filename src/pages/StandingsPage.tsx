
import { useState, useEffect } from "react";
import { getStandings } from "@/services/footballApiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface StandingsTeam {
  position: number;
  team: {
    id: number;
    name: string;
    crestUrl?: string;
    crest?: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

const StandingsPage = () => {
  const [standings, setStandings] = useState<StandingsTeam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true);
      const result = await getStandings();
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        // Extract the standings from the API response
        const standingsData = result.data.standings?.[0]?.table || [];
        setStandings(standingsData);
      }
      setLoading(false);
    };

    fetchStandings();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl font-bold text-premier-purple mb-2">Premier League Table</h1>
        <p className="text-gray-600">2023/2024 Season Standings</p>
      </div>

      <Card>
        <CardHeader className="bg-premier-purple text-white">
          <CardTitle>League Table</CardTitle>
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
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">MP</TableHead>
                  <TableHead className="text-center">W</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">L</TableHead>
                  <TableHead className="text-center">GF</TableHead>
                  <TableHead className="text-center">GA</TableHead>
                  <TableHead className="text-center">GD</TableHead>
                  <TableHead className="text-center">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.map((row) => (
                  <TableRow key={row.team.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{row.position}</TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                      {(row.team.crest || row.team.crestUrl) && (
                        <img 
                          src={row.team.crest || row.team.crestUrl} 
                          alt={`${row.team.name} logo`} 
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      )}
                      {row.team.name}
                    </TableCell>
                    <TableCell className="text-center">{row.playedGames}</TableCell>
                    <TableCell className="text-center">{row.won}</TableCell>
                    <TableCell className="text-center">{row.draw}</TableCell>
                    <TableCell className="text-center">{row.lost}</TableCell>
                    <TableCell className="text-center">{row.goalsFor}</TableCell>
                    <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                    <TableCell className="text-center">{row.goalDifference}</TableCell>
                    <TableCell className="text-center font-bold">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Data provided by the Football-Data.org API</p>
      </div>
    </div>
  );
};

export default StandingsPage;
