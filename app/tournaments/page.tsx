'use client';

/**
 * Tournaments Page
 * Browse and register for competitive tournaments
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Tabs,
  Tab,
  Image,
  Progress,
  Divider,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { PageContainer } from '@/components/layouts/centered-content';

interface Tournament {
  id: string;
  name: string;
  game: string;
  type: 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss';
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed';
  image: string;
  description: string;
  prize_pool: number;
  entry_fee: number;
  max_teams: number;
  registered_teams: number;
  start_date: string;
  end_date: string;
  region: string;
  format: string; // e.g., "5v5", "1v1"
  organizer: {
    name: string;
    logo?: string;
  };
}

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'LeetGaming Pro Series - Winter 2024',
    game: 'CS2',
    type: 'single-elimination',
    status: 'registration',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    description: 'Premium CS2 tournament with top prize pool. 16 teams battle for glory.',
    prize_pool: 10000,
    entry_fee: 50,
    max_teams: 16,
    registered_teams: 12,
    start_date: '2024-02-15',
    end_date: '2024-02-18',
    region: 'North America',
    format: '5v5',
    organizer: {
      name: 'LeetGaming.PRO',
      logo: '/logo.png',
    },
  },
  {
    id: '2',
    name: 'Community Cup #12',
    game: 'CS2',
    type: 'double-elimination',
    status: 'ongoing',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800',
    description: 'Free-to-enter community tournament. All skill levels welcome!',
    prize_pool: 500,
    entry_fee: 0,
    max_teams: 32,
    registered_teams: 32,
    start_date: '2024-01-20',
    end_date: '2024-01-22',
    region: 'Global',
    format: '5v5',
    organizer: {
      name: 'Community Events',
    },
  },
  {
    id: '3',
    name: '1v1 Aim Championship',
    game: 'CS2',
    type: 'single-elimination',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800',
    description: 'Pure aim duel tournament. Show off your mechanical skills.',
    prize_pool: 2000,
    entry_fee: 10,
    max_teams: 64,
    registered_teams: 45,
    start_date: '2024-02-01',
    end_date: '2024-02-03',
    region: 'Europe',
    format: '1v1',
    organizer: {
      name: 'Aim Masters',
    },
  },
  {
    id: '4',
    name: 'December Championship Finals',
    game: 'CS2',
    type: 'single-elimination',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    description: 'Season finale tournament featuring the best teams.',
    prize_pool: 25000,
    entry_fee: 100,
    max_teams: 16,
    registered_teams: 16,
    start_date: '2023-12-20',
    end_date: '2023-12-23',
    region: 'Global',
    format: '5v5',
    organizer: {
      name: 'LeetGaming.PRO',
    },
  },
];

export default function TournamentsPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all');

  const filteredTournaments =
    selectedTab === 'all'
      ? mockTournaments
      : mockTournaments.filter((t) => t.status === selectedTab);

  const renderTournamentCard = (tournament: Tournament) => {
    const registrationProgress = (tournament.registered_teams / tournament.max_teams) * 100;

    const statusColor = {
      upcoming: 'primary' as const,
      registration: 'success' as const,
      ongoing: 'warning' as const,
      completed: 'default' as const,
    };

    const statusLabel = {
      upcoming: 'Upcoming',
      registration: 'Open Registration',
      ongoing: 'In Progress',
      completed: 'Completed',
    };

    return (
      <Card
        key={tournament.id}
        isPressable
        className="hover:scale-[1.02] transition-transform"
        onPress={() => (window.location.href = `/tournaments/${tournament.id}`)}
      >
        <CardHeader className="absolute z-10 top-4 flex-col items-start bg-black/60 backdrop-blur-sm m-2 rounded-large">
          <Chip size="sm" color={statusColor[tournament.status]} variant="flat">
            {statusLabel[tournament.status]}
          </Chip>
          <h3 className="text-white font-bold text-xl mt-2">{tournament.name}</h3>
        </CardHeader>
        <Image
          removeWrapper
          alt={tournament.name}
          className="z-0 w-full h-full object-cover"
          src={tournament.image}
          height={250}
        />
        <CardBody className="pt-4">
          <p className="text-sm text-default-700 mb-4">{tournament.description}</p>

          {/* Tournament Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon icon="solar:cup-star-bold" width={18} className="text-warning" />
              <div>
                <div className="text-xs text-default-500">Prize Pool</div>
                <div className="font-semibold text-warning">${tournament.prize_pool.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:ticket-bold" width={18} className="text-primary" />
              <div>
                <div className="text-xs text-default-500">Entry Fee</div>
                <div className="font-semibold">
                  {tournament.entry_fee === 0 ? 'Free' : `$${tournament.entry_fee}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:calendar-bold" width={18} className="text-secondary" />
              <div>
                <div className="text-xs text-default-500">Start Date</div>
                <div className="font-semibold">{new Date(tournament.start_date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:map-point-bold" width={18} className="text-success" />
              <div>
                <div className="text-xs text-default-500">Region</div>
                <div className="font-semibold">{tournament.region}</div>
              </div>
            </div>
          </div>

          {/* Registration Progress */}
          {tournament.status === 'registration' && (
            <>
              <Divider className="my-3" />
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-default-600">Teams Registered</span>
                  <span className="font-semibold">
                    {tournament.registered_teams}/{tournament.max_teams}
                  </span>
                </div>
                <Progress value={registrationProgress} color="success" />
              </div>
            </>
          )}
        </CardBody>
        <CardFooter>
          <div className="flex gap-2 w-full">
            {tournament.status === 'registration' && (
              <Button color="primary" className="flex-1" startContent={<Icon icon="solar:user-plus-bold" width={20} />}>
                Register Now
              </Button>
            )}
            {tournament.status === 'ongoing' && (
              <Button color="warning" className="flex-1" startContent={<Icon icon="solar:eye-bold" width={20} />}>
                Watch Live
              </Button>
            )}
            {tournament.status === 'completed' && (
              <Button variant="flat" className="flex-1" startContent={<Icon icon="solar:chart-bold" width={20} />}>
                View Results
              </Button>
            )}
            {tournament.status === 'upcoming' && (
              <Button variant="bordered" className="flex-1" startContent={<Icon icon="solar:bell-bold" width={20} />}>
                Set Reminder
              </Button>
            )}
            <Button variant="bordered" isIconOnly>
              <Icon icon="solar:info-circle-bold" width={20} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <PageContainer
      title="Tournaments"
      description="Compete in competitive tournaments and win prizes"
      maxWidth="7xl"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardBody className="text-center py-6">
            <Icon icon="solar:cup-star-bold" width={32} className="mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold">{mockTournaments.length}</div>
            <div className="text-sm text-default-500">Total Tournaments</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <Icon icon="solar:ticket-bold" width={32} className="mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold">
              {mockTournaments.filter((t) => t.status === 'registration').length}
            </div>
            <div className="text-sm text-default-500">Open Registration</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <Icon icon="solar:play-circle-bold" width={32} className="mx-auto mb-2 text-warning" />
            <div className="text-2xl font-bold">
              {mockTournaments.filter((t) => t.status === 'ongoing').length}
            </div>
            <div className="text-sm text-default-500">In Progress</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <Icon icon="solar:dollar-bold" width={32} className="mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">
              ${mockTournaments.reduce((sum, t) => sum + t.prize_pool, 0).toLocaleString()}
            </div>
            <div className="text-sm text-default-500">Total Prize Pool</div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Tabs
        aria-label="Tournament filters"
        size="lg"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-6"
      >
        <Tab key="all" title="All Tournaments" />
        <Tab key="registration" title="Open Registration" />
        <Tab key="ongoing" title="Live" />
        <Tab key="upcoming" title="Upcoming" />
        <Tab key="completed" title="Past" />
      </Tabs>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTournaments.map(renderTournamentCard)}
      </div>

      {/* No Results */}
      {filteredTournaments.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <Icon icon="solar:cup-linear" width={64} className="mx-auto mb-4 text-default-400" />
            <h3 className="text-xl font-semibold mb-2">No tournaments found</h3>
            <p className="text-default-600 mb-4">
              {selectedTab === 'all'
                ? 'No tournaments available at the moment.'
                : `No ${selectedTab} tournaments available.`}
            </p>
            <Button color="primary" onClick={() => setSelectedTab('all')}>
              View All Tournaments
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Create Tournament CTA */}
      <Card className="mt-8 bg-gradient-to-r from-primary-500 to-secondary-500">
        <CardBody className="text-center py-8">
          <Icon icon="solar:cup-star-bold" width={48} className="mx-auto mb-4 text-white" />
          <h3 className="text-2xl font-bold text-white mb-2">Want to host your own tournament?</h3>
          <p className="text-white/80 mb-6">
            Create and manage tournaments for your community with our easy-to-use tools
          </p>
          <div className="flex gap-3 justify-center">
            <Button color="default" variant="solid" className="bg-white text-primary font-semibold">
              Create Tournament
            </Button>
            <Button variant="bordered" className="border-white text-white">
              Learn More
            </Button>
          </div>
        </CardBody>
      </Card>
    </PageContainer>
  );
}
