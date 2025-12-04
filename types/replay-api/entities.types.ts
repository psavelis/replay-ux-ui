
export enum IdentifierSourceType {
    Steam = 'steam',
    Google = 'google',
}

export enum GameIDKey {
    CounterStrike2 = 'cs2',
    Valorant = 'valorant',
    LeagueOfLegends = 'lol',
    Dota2 = 'dota2',
}

export enum PlayerRole {
    AWPER = 'awper',
    Rifler = 'rifler',
    Lurker = 'lurker',
    EntryFragger = 'entry_fragger',
    IGL = 'igl',
    Support = 'support',
}

export interface User {
    id: string,
    name: string,
    profiles: Record<IdentifierSourceType, Profile>,
    created_at: Date,
    updated_at: Date
}

export interface Profile {
    id: string,
    rid_source: IdentifierSourceType,
    source_key: string,
    details: ProfileDetails,
    created_at: Date,
    updated_at: Date
}

export type ProfileDetails = any

export enum MembershipType {
    Owner = 'owner',
    Admin = 'admin',
    Member = 'member',
}

export interface Membership {
    id: string,
    type: MembershipType,
    created_at: Date,
    updated_at: Date
}

export interface SquadHistory {
    user_id: string,
    action: string,
    created_at: Date,
}

export interface Squad {
    id : string,
    group_id : string,
    game_id : GameIDKey,
    name : string,
    symbol : string,
    slug_uri?: string,
    description : string,
    members : Record<string, Membership>,
    profiles : Record<string, ProfileDetails>, // ie.: github, faceit, steam, twitter/x,
    history: SquadHistory[],
    visibility?: VisibilityType,
    created_at : Date,
    updated_at : Date
}

export enum VisibilityType {
    Public = 'public',
    Private = 'private',
    Restricted = 'restricted',
    Custom = 'custom',
}

export interface Player {
    id: string;
    user_id: string;
    nickname: string;
    avatar_url?: string;
    role?: PlayerRole;
    game_id?: GameIDKey;
    steam_id?: string;
    profiles?: Record<IdentifierSourceType, ProfileDetails>;
    created_at: Date;
    updated_at: Date;
}

export interface PlayerSearchResult {
    data: Player[];
    next_offset?: string;
    total?: number;
}

export interface CreateSquadRequest {
    game_id: GameIDKey;
    name: string;
    symbol: string;
    description?: string;
    visibility?: VisibilityType;
}

export interface SquadSearchResult {
    data: Squad[];
    next_offset?: string;
    total?: number;
}
