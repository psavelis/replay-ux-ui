import React from "react";
import { Avatar, Listbox, ListboxItem, ListboxSection, ScrollShadow, Spinner } from "@nextui-org/react";
import { SteamIcon } from "@/components/icons";
import { Player, PlayerRole } from "@/types/replay-api/entities.types";

interface SearchResultsProps {
    players: Player[];
    isLoading: boolean;
    hasSearched: boolean;
    onPlayerSelect: (player: Player) => void;
    onClose: () => void;
}

const getRoleDisplayName = (role?: PlayerRole): string => {
    if (!role) return "";
    const roleMap: Record<PlayerRole, string> = {
        [PlayerRole.AWPER]: "AWPER",
        [PlayerRole.Rifler]: "Rifler",
        [PlayerRole.Lurker]: "Lurker",
        [PlayerRole.EntryFragger]: "Entry Fragger",
        [PlayerRole.IGL]: "IGL",
        [PlayerRole.Support]: "Support",
    };
    return roleMap[role] || role;
};

const SearchResults: React.FC<SearchResultsProps> = ({
    players,
    isLoading,
    hasSearched,
    onPlayerSelect,
    onClose,
}) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[200px]">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (!hasSearched) {
        return (
            <div className="flex justify-center items-center h-[200px] text-default-400">
                Type to search for players...
            </div>
        );
    }

    if (players.length === 0) {
        return (
            <div className="flex justify-center items-center h-[200px] text-default-400">
                No players found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
            <div>
                <ScrollShadow className="w-full h-[400px]">
                    <Listbox
                        aria-label="Player search results"
                        selectionMode="single"
                        onAction={(key) => {
                            const player = players.find(p => p.id === key);
                            if (player) {
                                onPlayerSelect(player);
                                onClose();
                            }
                        }}
                    >
                        <ListboxSection title="Players">
                            {players.map((player: Player) => (
                                <ListboxItem
                                    key={player.id}
                                    startContent={
                                        player.avatar_url ? (
                                            <Avatar
                                                src={player.avatar_url}
                                                size="sm"
                                                className="flex-shrink-0"
                                            />
                                        ) : (
                                            <SteamIcon
                                                height={40}
                                                width={40}
                                                style={{ borderRadius: "1.5em", padding: "0.2em" }}
                                            />
                                        )
                                    }
                                    description={player.role ? getRoleDisplayName(player.role) : undefined}
                                >
                                    {player.nickname}
                                </ListboxItem>
                            ))}
                        </ListboxSection>
                    </Listbox>
                </ScrollShadow>
            </div>
        </div>
    );
};

export default SearchResults;
