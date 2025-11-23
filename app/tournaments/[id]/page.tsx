'use client';

/**
 * Tournament Detail Page
 * View tournament details, bracket, and matches
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
  Tabs,
  Tab,
  Divider,
  Progress,
  Skeleton,
  Image,
  Avatar,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { PageContainer } from '@/components/layouts/centered-content';
import { TournamentBracket, BracketMatch } from '@/components/tournaments/tournament-bracket';

interface TournamentDetail {
  id: string;
  name: string;
  game: string;
  type: 'single-elimination' | 'double-elimination';
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed';
  image: string;
  description: string;
  prize_pool: number;
  prize_distribution: { place: string; amount: number }[];
  entry_fee: number;
  max_teams: number;
  registered_teams: number;
  start_date: string;
  end_date: string;
  region: string;
  format: string;
  rules: string[];
  organizer: {
    name: string;
    logo?: string;
  };
  participants: Array<{
    id: string;
    name: string;
    logo?: string;
    members?: string[];
  }>;
  matches: BracketMatch[];
  rounds: number;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournament() {
      try {
        // In production, fetch from API
        // Mock data for now
        const mockTournament: TournamentDetail = {
          id: tournamentId,
          name: 'LeetGaming Pro Series - Winter 2024',
          game: 'CS2',
          type: 'single-elimination',
          status: 'ongoing',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
          description:
            'Premium CS2 tournament featuring 16 of the best teams. Battle through single-elimination bracket for a $10,000 prize pool.',
          prize_pool: 10000,
          prize_distribution: [
            { place: '1st Place', amount: 5000 },
            { place: '2nd Place', amount: 3000 },
            { place: '3rd-4th Place', amount: 1000 },
          ],
          entry_fee: 50,
          max_teams: 16,
          registered_teams: 16,
          start_date: '2024-01-20',
          end_date: '2024-01-22',
          region: 'North America',
          format: '5v5',
          rules: [
            'All matches are Best of 3 (BO3)',
            'Finals are Best of 5 (BO5)',
            'Map pool: Inferno, Mirage, Dust2, Nuke, Ancient, Overpass, Anubis',
            'Team roster lock 24 hours before tournament start',
            'Maximum 1 substitute per team',
            'No cheating or exploits allowed',
            'All players must be registered on LeetGaming.PRO',
          ],
          organizer: {
            name: 'LeetGaming.PRO',
            logo: '/logo.png',
          },
          participants: generateMockParticipants(),
          matches: generateMockMatches(),
          rounds: 4, // 16 teams = 4 rounds
        };

        setTimeout(() => {
          setTournament(mockTournament);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load tournament');
        setLoading(false);
      }
    }

    fetchTournament();
  }, [tournamentId]);

  if (loading) {
    return (
      <PageContainer maxWidth="7xl">
        <div className="space-y-6">
          <Skeleton className="w-full h-64 rounded-xl" />
          <Skeleton className="w-full h-96 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (error || !tournament) {
    return (
      <PageContainer maxWidth="7xl">
        <Card>
          <CardBody className="text-center py-12">
            <Icon icon="solar:cup-linear" width={64} className="mx-auto mb-4 text-danger" />
            <p className="text-lg text-danger">{error || 'Tournament not found'}</p>
            <Button className="mt-4" color="primary" onClick={() => (window.location.href = '/tournaments')}>
              Back to Tournaments
            </Button>
          </CardBody>
        </Card>
      </PageContainer>
    );
  }

  const registrationProgress = (tournament.registered_teams / tournament.max_teams) * 100;

  return (
    <PageContainer maxWidth="7xl">
      {/* Header Banner */}
      <Card className="mb-6 bg-gradient-to-r from-primary-500/20 to-secondary-500/20">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={tournament.image}
              alt={tournament.name}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold">{tournament.name}</h1>
                <Chip
                  color={
                    tournament.status === 'completed'
                      ? 'default'
                      : tournament.status === 'ongoing'
                      ? 'warning'
                      : 'success'
                  }
                  variant="flat"
                >
                  {tournament.status === 'completed'
                    ? 'Completed'
                    : tournament.status === 'ongoing'
                    ? 'In Progress'
                    : 'Open Registration'}
                </Chip>
              </div>
              <p className="text-default-700 mb-4">{tournament.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Icon icon="solar:cup-star-bold" width={18} className="inline mr-2 text-warning" />
                  <span className="text-default-500">Prize:</span>{' '}
                  <span className="font-semibold">${tournament.prize_pool.toLocaleString()}</span>
                </div>
                <div>
                  <Icon icon="solar:calendar-bold" width={18} className="inline mr-2 text-primary" />
                  <span className="text-default-500">Dates:</span>{' '}
                  <span className="font-semibold">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <Icon icon="solar:users-group-rounded-bold" width={18} className="inline mr-2 text-secondary" />
                  <span className="text-default-500">Teams:</span>{' '}
                  <span className="font-semibold">
                    {tournament.registered_teams}/{tournament.max_teams}
                  </span>
                </div>
                <div>
                  <Icon icon="solar:map-point-bold" width={18} className="inline mr-2 text-success" />
                  <span className="text-default-500">Region:</span>{' '}
                  <span className="font-semibold">{tournament.region}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-center">
              {tournament.status === 'registration' && (
                <Button color="primary" size="lg" startContent={<Icon icon="solar:user-plus-bold" width={20} />}>
                  Register Team
                </Button>
              )}
              {tournament.status === 'ongoing' && (
                <Button color="warning" size="lg" startContent={<Icon icon="solar:eye-bold" width={20} />}>
                  Watch Live
                </Button>
              )}
              <Button variant="bordered" startContent={<Icon icon="solar:share-bold" width={20} />}>
                Share
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs aria-label="Tournament tabs" size="lg" className="mb-6">
        <Tab key="bracket" title="Bracket">
          <Card>
            <CardBody className="p-6">
              <TournamentBracket
                matches={tournament.matches}
                type={tournament.type}
                rounds={tournament.rounds}
                title="Tournament Bracket"
                onMatchClick={(match) => console.log('Match clicked:', match)}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="participants" title="Participants">
          <Card>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tournament.participants.map((team) => (
                  <Card key={team.id} isPressable className="hover:bg-default-100">
                    <CardBody className="p-4">
                      <div className="flex items-center gap-3">
                        {team.logo ? (
                          <Avatar src={team.logo} size="lg" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <Icon icon="solar:users-group-rounded-bold" width={24} className="text-primary" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{team.name}</h4>
                          <p className="text-xs text-default-500">{team.members?.length || 5} members</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="prizes" title="Prizes">
          <Card>
            <CardBody>
              <div className="space-y-4">
                {tournament.prize_distribution.map((prize, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-default-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-warning/20 text-warning'
                            : index === 1
                            ? 'bg-default-300'
                            : 'bg-default-200'
                        }`}
                      >
                        <Icon
                          icon={
                            index === 0
                              ? 'solar:cup-star-bold'
                              : index === 1
                              ? 'solar:medal-star-bold'
                              : 'solar:medal-ribbons-star-bold'
                          }
                          width={24}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{prize.place}</h4>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-success">${prize.amount.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="rules" title="Rules">
          <Card>
            <CardBody>
              <div className="space-y-3">
                {tournament.rules.map((rule, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-default-700">{rule}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="info" title="Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold">Tournament Details</h3>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-default-500 mb-1">Format</h4>
                  <p className="font-medium">{tournament.format} - {tournament.type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-default-500 mb-1">Entry Fee</h4>
                  <p className="font-medium">
                    {tournament.entry_fee === 0 ? 'Free' : `$${tournament.entry_fee} per team`}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-default-500 mb-1">Schedule</h4>
                  <p className="font-medium">
                    {new Date(tournament.start_date).toLocaleDateString()} -{' '}
                    {new Date(tournament.end_date).toLocaleDateString()}
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-xl font-bold">Organizer</h3>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex items-center gap-4">
                  <Avatar src={tournament.organizer.logo} size="lg" />
                  <div>
                    <h4 className="font-semibold text-lg">{tournament.organizer.name}</h4>
                    <p className="text-sm text-default-500">Tournament Organizer</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </PageContainer>
  );
}

// Helper functions to generate mock data
function generateMockParticipants() {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `Team ${i + 1}`,
    logo: `https://i.pravatar.cc/100?u=team-${i + 1}`,
    members: Array.from({ length: 5 }, (_, j) => `Player ${j + 1}`),
  }));
}

function generateMockMatches(): BracketMatch[] {
  const matches: BracketMatch[] = [];

  // Round 1 - 8 matches
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: `r1-m${i + 1}`,
      round: 1,
      position: i + 1,
      team1: { id: `team-${i * 2 + 1}`, name: `Team ${i * 2 + 1}`, score: Math.random() > 0.5 ? 2 : 0 },
      team2: { id: `team-${i * 2 + 2}`, name: `Team ${i * 2 + 2}`, score: Math.random() > 0.5 ? 2 : 0 },
      winner: Math.random() > 0.5 ? `team-${i * 2 + 1}` : `team-${i * 2 + 2}`,
      status: 'completed',
      playedAt: new Date().toISOString(),
    });
  }

  // Round 2 - 4 matches
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: `r2-m${i + 1}`,
      round: 2,
      position: i + 1,
      team1: { id: `team-w${i * 2 + 1}`, name: `Winner R1-${i * 2 + 1}`, score: Math.random() > 0.5 ? 2 : 1 },
      team2: { id: `team-w${i * 2 + 2}`, name: `Winner R1-${i * 2 + 2}`, score: Math.random() > 0.5 ? 2 : 1 },
      winner: Math.random() > 0.5 ? `team-w${i * 2 + 1}` : `team-w${i * 2 + 2}`,
      status: i < 2 ? 'completed' : 'ongoing',
      scheduledAt: new Date().toISOString(),
    });
  }

  // Round 3 - 2 matches (Semi-finals)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: `r3-m${i + 1}`,
      round: 3,
      position: i + 1,
      team1: { id: `team-sf${i * 2 + 1}`, name: `SF Team ${i * 2 + 1}` },
      team2: { id: `team-sf${i * 2 + 2}`, name: `SF Team ${i * 2 + 2}` },
      status: 'pending',
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Round 4 - 1 match (Final)
  matches.push({
    id: 'r4-m1',
    round: 4,
    position: 1,
    team1: undefined,
    team2: undefined,
    status: 'pending',
    scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  });

  return matches;
}
