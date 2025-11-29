"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Chip,
  Button,
  Select,
  SelectItem,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { title, subtitle } from "@/components/primitives";
import { ReplayAPISDK } from "@/types/replay-api/sdk";
import { ReplayApiSettingsMock } from "@/types/replay-api/settings";
import { logger } from "@/lib/logger";
import { PlayerCreationModal } from "@/components/players/player-creation-modal";
import { useDisclosure } from "@nextui-org/react";
import { PageContainer } from "@/components/layout/page-container";

const sdk = new ReplayAPISDK(ReplayApiSettingsMock, logger);

interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: string;
  rating: number;
  country: string;
  game: string;
  role: string;
  team?: string;
  wins: number;
  losses: number;
  winRate: number;
  kd: number;
  achievements: number;
  isVerified: boolean;
  isLookingForTeam: boolean;
}

const MOCK_PLAYERS: Player[] = [
  {
    id: "1",
    name: "s1mple",
    avatar: "https://i.pravatar.cc/150?img=1",
    rank: "Challenger",
    rating: 4850,
    country: "UA",
    game: "CS2",
    role: "AWPer",
    team: "Natus Vincere",
    wins: 342,
    losses: 128,
    winRate: 72.8,
    kd: 1.42,
    achievements: 24,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "2",
    name: "ZywOo",
    avatar: "https://i.pravatar.cc/150?img=2",
    rank: "Challenger",
    rating: 4720,
    country: "FR",
    game: "CS2",
    role: "AWPer",
    team: "Vitality",
    wins: 318,
    losses: 145,
    winRate: 68.7,
    kd: 1.38,
    achievements: 21,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "3",
    name: "NiKo",
    avatar: "https://i.pravatar.cc/150?img=3",
    rank: "Challenger",
    rating: 4680,
    country: "BA",
    game: "CS2",
    role: "Rifler",
    team: "G2 Esports",
    wins: 305,
    losses: 152,
    winRate: 66.7,
    kd: 1.35,
    achievements: 19,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "4",
    name: "TenZ",
    avatar: "https://i.pravatar.cc/150?img=4",
    rank: "Grandmaster",
    rating: 4540,
    country: "CA",
    game: "Valorant",
    role: "Duelist",
    team: "Sentinels",
    wins: 298,
    losses: 160,
    winRate: 65.1,
    kd: 1.45,
    achievements: 16,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "5",
    name: "aspas",
    avatar: "https://i.pravatar.cc/150?img=5",
    rank: "Grandmaster",
    rating: 4510,
    country: "BR",
    game: "Valorant",
    role: "Duelist",
    team: "LOUD",
    wins: 285,
    losses: 168,
    winRate: 62.9,
    kd: 1.52,
    achievements: 14,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "6",
    name: "donk",
    avatar: "https://i.pravatar.cc/150?img=6",
    rank: "Grandmaster",
    rating: 4420,
    country: "RU",
    game: "CS2",
    role: "Rifler",
    team: "Spirit",
    wins: 276,
    losses: 175,
    winRate: 61.2,
    kd: 1.27,
    achievements: 12,
    isVerified: true,
    isLookingForTeam: false,
  },
  {
    id: "7",
    name: "ProPlayer_123",
    avatar: "https://i.pravatar.cc/150?img=7",
    rank: "Master",
    rating: 3850,
    country: "US",
    game: "CS2",
    role: "Support",
    wins: 189,
    losses: 142,
    winRate: 57.1,
    kd: 1.12,
    achievements: 8,
    isVerified: false,
    isLookingForTeam: true,
  },
  {
    id: "8",
    name: "EliteGamer",
    avatar: "https://i.pravatar.cc/150?img=8",
    rank: "Master",
    rating: 3720,
    country: "DE",
    game: "Valorant",
    role: "Controller",
    wins: 176,
    losses: 155,
    winRate: 53.2,
    kd: 1.08,
    achievements: 6,
    isVerified: false,
    isLookingForTeam: true,
  },
  {
    id: "9",
    name: "frozen",
    avatar: "https://i.pravatar.cc/150?img=9",
    rank: "Grandmaster",
    rating: 4380,
    country: "SK",
    game: "CS2",
    role: "Entry Fragger",
    team: "MOUZ",
    wins: 268,
    losses: 182,
    winRate: 59.6,
    kd: 1.24,
    achievements: 15,
    isVerified: true,
    isLookingForTeam: false,
  },
];

export default function PlayersPage() {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");
  const [showOnlyLFT, setShowOnlyLFT] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        setError(null);

        const filters: any = {};
        if (selectedGame !== "all") {
          filters.game_id = selectedGame;
        }

        const playersData = await sdk.playerProfiles.searchPlayerProfiles(filters);
        
        // Convert API data to Player interface
        const mappedPlayers: Player[] = (playersData || []).map((p: any) => ({
          id: p.player_id || p.id,
          name: p.nickname || p.name || "Unknown",
          avatar: p.avatar_uri || `https://i.pravatar.cc/150?u=${p.player_id}`,
          rank: p.rank || "Unranked",
          rating: p.rating || 0,
          country: p.country || "XX",
          game: p.game_id?.toUpperCase() || "CS2",
          role: p.roles?.[0] || "Player",
          team: p.team_name,
          wins: p.stats?.wins || 0,
          losses: p.stats?.losses || 0,
          winRate: p.stats?.win_rate || 0,
          kd: p.stats?.kd_ratio || 0,
          achievements: p.achievements?.length || 0,
          isVerified: p.verified || false,
          isLookingForTeam: p.looking_for_team || false,
        }));

        // Use real data or fallback to mock if empty
        setPlayers(mappedPlayers.length > 0 ? mappedPlayers : MOCK_PLAYERS);
      } catch (err: any) {
        logger.error("Failed to fetch players", err);
        setError(err.message || "Failed to load players");
        // Fallback to mock data on error
        setPlayers(MOCK_PLAYERS);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [selectedGame]);

  // Memoize filtered players to avoid re-computing on every render
  // Global search (navbar) handles text search - page only filters by dropdowns
  const filteredPlayers = React.useMemo(() => {
    return players.filter((player) => {
      const matchesGame = selectedGame === "all" || player.game.toLowerCase() === selectedGame.toLowerCase();
      const matchesRole = selectedRole === "all" || player.role.toLowerCase() === selectedRole.toLowerCase();
      const matchesLFT = !showOnlyLFT || player.isLookingForTeam;

      return matchesGame && matchesRole && matchesLFT;
    });
  }, [players, selectedGame, selectedRole, showOnlyLFT]);

  // Paginate filtered results
  const totalPages = Math.ceil(filteredPlayers.length / ITEMS_PER_PAGE);
  const paginatedPlayers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPlayers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPlayers, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGame, selectedRole, showOnlyLFT]);

  return (
    <PageContainer maxWidth="7xl" padding="md">
      <div className="flex w-full flex-col items-center gap-8 py-8">
        {/* Header */}
        <div className="flex w-full flex-col items-center text-center gap-2">
          <h2 className="text-secondary font-medium">Competitive Community</h2>
          <h1 className={title({ size: "lg" })}>Player Profiles</h1>
          <p className={subtitle({ class: "mt-2 max-w-2xl" })}>
            Discover talented players, find teammates, and connect with the competitive gaming community.
          </p>
        </div>

        {/* Filters */}
        <Card className="w-full max-w-7xl">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <Select
              label="Game"
              selectedKeys={[selectedGame]}
              onSelectionChange={(keys) => setSelectedGame(Array.from(keys)[0] as string)}
              className="w-full md:w-48"
              variant="bordered"
            >
              <SelectItem key="all" value="all">All Games</SelectItem>
              <SelectItem key="cs2" value="cs2">CS2</SelectItem>
              <SelectItem key="valorant" value="valorant">Valorant</SelectItem>
              <SelectItem key="csgo" value="csgo">CS:GO</SelectItem>
            </Select>
            <Select
              label="Role"
              selectedKeys={[selectedRole]}
              onSelectionChange={(keys) => setSelectedRole(Array.from(keys)[0] as string)}
              className="w-full md:w-48"
              variant="bordered"
            >
              <SelectItem key="all" value="all">All Roles</SelectItem>
              <SelectItem key="awper" value="awper">AWPer</SelectItem>
              <SelectItem key="rifler" value="rifler">Rifler</SelectItem>
              <SelectItem key="support" value="support">Support</SelectItem>
              <SelectItem key="entry fragger" value="entry fragger">Entry Fragger</SelectItem>
              <SelectItem key="duelist" value="duelist">Duelist</SelectItem>
              <SelectItem key="controller" value="controller">Controller</SelectItem>
            </Select>
            <Button
              color={showOnlyLFT ? "primary" : "default"}
              variant={showOnlyLFT ? "shadow" : "bordered"}
              onPress={() => setShowOnlyLFT(!showOnlyLFT)}
              startContent={<Icon icon="mdi:account-search" width={20} />}
              className="w-full md:w-auto"
            >
              Looking for Team
            </Button>
            <p className="text-tiny text-default-400 hidden md:block">
              Use ⌘+` to search players
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="w-full max-w-7xl flex justify-center py-12">
          <Spinner size="lg" label="Loading players..." color="primary" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="w-full max-w-md">
          <CardBody className="text-center">
            <Icon icon="mdi:alert-circle" className="text-danger mx-auto mb-4" width={48} />
            <p className="text-danger font-semibold mb-2">Error loading players</p>
            <p className="text-default-500 mb-4">{error}</p>
            <p className="text-xs text-default-400 mb-4">Showing cached data</p>
          </CardBody>
        </Card>
      )}

      {/* Players Grid */}
      {!loading && (
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-4">
            <p className="text-default-500">
              Showing {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredPlayers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Icon icon="mdi:account-off" className="text-6xl text-default-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No players found</h3>
              <p className="text-default-500">
                Try adjusting your filters or search query
              </p>
            </CardBody>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPlayers.map((player) => (
              <Card key={player.id} className="hover:shadow-lg hover:border-primary/50 transition-all">
                <CardHeader className="flex flex-col gap-3 p-6">
                  <div className="flex w-full justify-between items-start">
                    <Avatar
                      src={player.avatar}
                      className="w-20 h-20"
                      isBordered
                      color="primary"
                    />
                    <div className="flex flex-col items-end gap-2">
                      {player.isVerified && (
                        <Chip
                          size="sm"
                          variant="flat"
                          color="primary"
                          startContent={<Icon icon="mdi:check-decagram" width={16} />}
                        >
                          Verified
                        </Chip>
                      )}
                      {player.isLookingForTeam && (
                        <Chip
                          size="sm"
                          variant="flat"
                          color="success"
                          startContent={<Icon icon="mdi:account-search" width={16} />}
                        >
                          LFT
                        </Chip>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold">{player.name}</h3>
                      <span className="text-xs text-default-500">{player.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Chip size="sm" variant="flat" color="warning">
                        {player.rank}
                      </Chip>
                      <Chip size="sm" variant="flat">
                        {player.rating}
                      </Chip>
                    </div>
                  </div>
                </CardHeader>

                <Divider />

                <CardBody className="p-6 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Game</span>
                      <span className="font-semibold">{player.game}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Role</span>
                      <span className="font-semibold">{player.role}</span>
                    </div>
                    {player.team && (
                      <div className="flex flex-col col-span-2">
                        <span className="text-xs text-default-500">Team</span>
                        <span className="font-semibold">{player.team}</span>
                      </div>
                    )}
                  </div>

                  <Divider />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Win Rate</span>
                      <span className="font-bold text-success">{player.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">K/D Ratio</span>
                      <span className="font-bold">{player.kd.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Matches</span>
                      <span className="font-semibold">{player.wins + player.losses}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-default-500">Achievements</span>
                      <span className="font-semibold">{player.achievements}</span>
                    </div>
                  </div>
                </CardBody>

                <Divider />

                <CardFooter className="p-4 gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    className="flex-1"
                    startContent={<Icon icon="mdi:account" width={18} />}
                  >
                    View Profile
                  </Button>
                  <Button
                    color="default"
                    variant="bordered"
                    isIconOnly
                  >
                    <Icon icon="mdi:message" width={20} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                isIconOnly
                variant="flat"
                isDisabled={currentPage === 1}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <Icon icon="mdi:chevron-left" width={20} />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, current page, and last page with ellipsis
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      size="sm"
                      variant={currentPage === pageNum ? "solid" : "flat"}
                      color={currentPage === pageNum ? "primary" : "default"}
                      onPress={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                isIconOnly
                variant="flat"
                isDisabled={currentPage === totalPages}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <Icon icon="mdi:chevron-right" width={20} />
              </Button>
            </div>
          )}
        </>
        )}
        </div>
      )}

      {/* CTA Card */}
      <Card className="w-full bg-gradient-to-r from-primary-50 to-secondary-50">
        <CardBody className="text-center py-8">
          <Icon icon="mdi:account-plus" className="text-4xl mx-auto mb-2 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Create Your Player Profile</h3>
          <p className="text-default-600 mb-4">
            Join our community and showcase your skills to teams and players worldwide
          </p>
          <Button color="primary" variant="shadow" size="lg" onPress={onOpen}>
            Create Profile
          </Button>
        </CardBody>
      </Card>

        {/* Player Creation Modal */}
        <PlayerCreationModal isOpen={isOpen} onClose={onClose} />
      </div>
    </PageContainer>
  );
}
