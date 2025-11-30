'use client';

/**
 * Team Detail Page
 * Team profile, members, statistics, and match history
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Divider,
  Progress,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { PageContainer } from '@/components/layouts/centered-content';
import { ShareButton } from '@/components/share/share-button';
import { ReplayAPISDK } from '@/types/replay-api/sdk';
import { ReplayApiSettingsMock } from '@/types/replay-api/settings';
import { logger } from '@/lib/logger';

const sdk = new ReplayAPISDK(ReplayApiSettingsMock, logger);

interface TeamMember {
  id: string;
  nickname: string;
  avatar: string;
  role: string;
  join_date: string;
  stats: {
    matches: number;
    wins: number;
    kd: number;
  };
}

interface TeamProfile {
  id: string;
  name: string;
  tag: string;
  logo: string;
  description: string;
  founded: string;
  region: string;
  status: 'recruiting' | 'full' | 'inactive';
  members: TeamMember[];
  stats: {
    matches_played: number;
    wins: number;
    losses: number;
    win_streak: number;
    ranking: number;
    rating: number;
  };
  recent_matches: Array<{
    id: string;
    date: string;
    opponent: string;
    result: 'win' | 'loss' | 'tie';
    score: string;
    map: string;
  }>;
}

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  const [team, setTeam] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for fallback
  const getMockTeam = (): TeamProfile => ({
    id: teamId,
    name: 'Elite Gamers',
    tag: '[EG]',
    logo: `https://i.pravatar.cc/200?u=team-${teamId}`,
    description:
      'Competitive CS2 team looking to dominate the esports scene. We focus on strategy, teamwork, and continuous improvement.',
    founded: '2023-03-15',
    region: 'North America',
    status: 'recruiting',
    members: [
      {
        id: '1',
        nickname: 'Captain_Alpha',
        avatar: 'https://i.pravatar.cc/100?u=1',
        role: 'Captain / IGL',
        join_date: '2023-03-15',
        stats: { matches: 156, wins: 98, kd: 1.32 },
      },
      {
        id: '2',
        nickname: 'FragMaster',
        avatar: 'https://i.pravatar.cc/100?u=2',
        role: 'Entry Fragger',
        join_date: '2023-03-20',
        stats: { matches: 142, wins: 89, kd: 1.45 },
      },
      {
        id: '3',
        nickname: 'AWP_God',
        avatar: 'https://i.pravatar.cc/100?u=3',
        role: 'AWPer',
        join_date: '2023-04-01',
        stats: { matches: 138, wins: 84, kd: 1.28 },
      },
      {
        id: '4',
        nickname: 'Support_Pro',
        avatar: 'https://i.pravatar.cc/100?u=4',
        role: 'Support',
        join_date: '2023-04-10',
        stats: { matches: 135, wins: 82, kd: 1.12 },
      },
    ],
    stats: {
      matches_played: 156,
      wins: 98,
      losses: 58,
      win_streak: 5,
      ranking: 42,
      rating: 1825,
    },
    recent_matches: [
      { id: '1', date: '2024-01-15', opponent: 'Team Fortress', result: 'win', score: '16-12', map: 'de_inferno' },
      { id: '2', date: '2024-01-14', opponent: 'Cyber Warriors', result: 'win', score: '16-10', map: 'de_mirage' },
      { id: '3', date: '2024-01-13', opponent: 'Pro Legends', result: 'loss', score: '14-16', map: 'de_dust2' },
      { id: '4', date: '2024-01-12', opponent: 'Night Hawks', result: 'win', score: '16-8', map: 'de_nuke' },
      { id: '5', date: '2024-01-11', opponent: 'Steel Titans', result: 'win', score: '16-13', map: 'de_ancient' },
    ],
  });

  useEffect(() => {
    async function fetchTeamProfile() {
      try {
        setLoading(true);
        setError(null);

        // Fetch squad from API
        const squadData = await sdk.squads.getSquad(teamId);

        if (squadData) {
          // Map API response to TeamProfile interface
          const apiTeam: TeamProfile = {
            id: squadData.squad_id || teamId,
            name: squadData.name || 'Unknown Team',
            tag: squadData.tag || `[${squadData.name?.slice(0, 3).toUpperCase()}]`,
            logo: squadData.logo_uri || `https://i.pravatar.cc/200?u=team-${teamId}`,
            description: squadData.description || 'A competitive esports team.',
            founded: squadData.created_at || new Date().toISOString(),
            region: squadData.region || 'Global',
            status: squadData.visibility === 'public' ? 'recruiting' : 'full',
            members: (squadData.members || []).map((m: any, idx: number) => ({
              id: m.player_id || `member-${idx}`,
              nickname: m.nickname || m.name || `Player ${idx + 1}`,
              avatar: m.avatar_uri || `https://i.pravatar.cc/100?u=${m.player_id || idx}`,
              role: m.role || 'Member',
              join_date: m.joined_at || squadData.created_at || new Date().toISOString(),
              stats: {
                matches: m.stats?.matches || 0,
                wins: m.stats?.wins || 0,
                kd: m.stats?.kd_ratio || 1.0,
              },
            })),
            stats: {
              matches_played: squadData.stats?.matches_played || 0,
              wins: squadData.stats?.wins || 0,
              losses: squadData.stats?.losses || 0,
              win_streak: squadData.stats?.win_streak || 0,
              ranking: squadData.stats?.ranking || 0,
              rating: squadData.rating || 1500,
            },
            recent_matches: getMockTeam().recent_matches, // Match history would need separate API
          };
          setTeam(apiTeam);
        } else {
          // Fallback to mock data
          setTeam(getMockTeam());
        }
      } catch (err: any) {
        logger.error('Failed to load team profile', err);
        setError('Failed to load team profile');
        // Fallback to mock data on error
        setTeam(getMockTeam());
      } finally {
        setLoading(false);
      }
    }

    fetchTeamProfile();
  }, [teamId]);

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

  if (error || !team) {
    return (
      <PageContainer maxWidth="7xl">
        <Card>
          <CardBody className="text-center py-12">
            <Icon icon="solar:ghost-linear" width={64} className="mx-auto mb-4 text-danger" />
            <p className="text-lg text-danger">{error || 'Team not found'}</p>
            <Button className="mt-4" color="primary" onClick={() => (window.location.href = '/teams')}>
              Back to Teams
            </Button>
          </CardBody>
        </Card>
      </PageContainer>
    );
  }

  const winRate = ((team.stats.wins / team.stats.matches_played) * 100).toFixed(1);

  return (
    <PageContainer maxWidth="7xl">
      {/* Header Card */}
      <Card className="mb-6 bg-gradient-to-r from-primary-500/20 to-secondary-500/20">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar src={team.logo} className="w-32 h-32" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {team.tag} {team.name}
                </h1>
                <Chip
                  color={team.status === 'recruiting' ? 'success' : team.status === 'full' ? 'warning' : 'default'}
                  variant="flat"
                >
                  {team.status === 'recruiting' ? 'Recruiting' : team.status === 'full' ? 'Full Roster' : 'Inactive'}
                </Chip>
              </div>
              <p className="text-default-600 mb-4">{team.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-default-500">
                <div className="flex items-center gap-1">
                  <Icon icon="solar:calendar-bold" width={16} />
                  <span>Founded {new Date(team.founded).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:map-point-bold" width={16} />
                  <span>{team.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:users-group-rounded-bold" width={16} />
                  <span>{team.members.length} Members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon icon="solar:ranking-bold" width={16} />
                  <span>Rank #{team.stats.ranking}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {team.status === 'recruiting' && (
                <Button color="primary" startContent={<Icon icon="solar:user-plus-bold" width={20} />}>
                  Apply to Join
                </Button>
              )}
              <Button variant="bordered" startContent={<Icon icon="solar:chat-round-bold" width={20} />}>
                Contact
              </Button>
              <ShareButton
                contentType="team"
                contentId={teamId}
                title={`${team.tag} ${team.name}`}
                description={team.description}
                variant="bordered"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardBody className="text-center py-6">
            <div className="text-3xl font-bold text-primary">{team.stats.matches_played}</div>
            <div className="text-sm text-default-500">Matches</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <div className="text-3xl font-bold text-success">{winRate}%</div>
            <div className="text-sm text-default-500">Win Rate</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <div className="text-3xl font-bold text-warning">{team.stats.win_streak}</div>
            <div className="text-sm text-default-500">Win Streak</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <div className="text-3xl font-bold text-secondary">{team.stats.ranking}</div>
            <div className="text-sm text-default-500">Global Rank</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <div className="text-3xl font-bold text-primary">{team.stats.rating}</div>
            <div className="text-sm text-default-500">ELO Rating</div>
          </CardBody>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs aria-label="Team tabs" size="lg">
        <Tab key="roster" title="Roster">
          <Card>
            <CardBody>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <Card
                    key={member.id}
                    isPressable
                    className="hover:bg-default-100"
                    onPress={() => (window.location.href = `/players/${member.id}`)}
                  >
                    <CardBody>
                      <div className="flex items-center gap-4">
                        <Avatar src={member.avatar} size="lg" />
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{member.nickname}</div>
                          <div className="text-sm text-default-500">{member.role}</div>
                          <div className="text-xs text-default-400 mt-1">
                            Joined {new Date(member.join_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-lg font-semibold">{member.stats.matches}</div>
                              <div className="text-xs text-default-500">Matches</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-success">{member.stats.wins}</div>
                              <div className="text-xs text-default-500">Wins</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-primary">{member.stats.kd}</div>
                              <div className="text-xs text-default-500">K/D</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
              {team.status === 'recruiting' && (
                <>
                  <Divider className="my-6" />
                  <div className="text-center py-6">
                    <Icon icon="solar:user-plus-bold" width={48} className="mx-auto mb-3 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">We&apos;re recruiting!</h3>
                    <p className="text-default-500 mb-4">Looking for skilled players to join our roster</p>
                    <Button color="primary" size="lg">
                      Apply Now
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab key="matches" title="Match History">
          <Card>
            <CardBody>
              <div className="space-y-3">
                {team.recent_matches.map((match) => (
                  <Card key={match.id} isPressable className="hover:bg-default-100">
                    <CardBody>
                      <div className="flex items-center gap-4">
                        <Chip
                          color={match.result === 'win' ? 'success' : match.result === 'loss' ? 'danger' : 'default'}
                          variant="flat"
                          size="lg"
                        >
                          {match.result.toUpperCase()}
                        </Chip>
                        <div className="flex-1">
                          <div className="font-semibold">vs {match.opponent}</div>
                          <div className="text-sm text-default-500">
                            {new Date(match.date).toLocaleDateString()} • {match.map}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{match.score}</div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
            <CardFooter>
              <Button variant="flat" className="w-full">
                Load More Matches
              </Button>
            </CardFooter>
          </Card>
        </Tab>

        <Tab key="stats" title="Statistics">
          <Card>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Overall Win Rate</span>
                        <span className="font-semibold">{winRate}%</span>
                      </div>
                      <Progress value={parseFloat(winRate)} color="success" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Current Form (Last 10 matches)</span>
                        <span className="font-semibold">70%</span>
                      </div>
                      <Progress value={70} color="warning" />
                    </div>
                  </div>
                </div>
                <Divider />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Map Performance</h3>
                  <div className="text-center py-8">
                    <Icon icon="solar:chart-2-bold" width={64} className="mx-auto mb-4 text-default-400" />
                    <p className="text-default-600">Detailed map statistics coming soon</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </PageContainer>
  );
}
