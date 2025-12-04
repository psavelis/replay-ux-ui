import { Loggable } from "@/lib/logger";
import { RouteBuilder } from "./replay-api.route-builder";
import { ReplayApiSettings, ReplayApiResourceType, ReplayApiSettingsMock } from "./settings";
import { Player, PlayerSearchResult, CreatePlayerProfileRequest, PlayerProfile } from "./entities.types";

export interface PlayerApiClientConfig {
  settings?: ReplayApiSettings;
  logger: Loggable;
}

export class PlayerApiClient {
  private routeBuilder: RouteBuilder;
  private settings: ReplayApiSettings;
  private logger: Loggable;

  constructor(config: PlayerApiClientConfig) {
    this.settings = config.settings || {
      ...ReplayApiSettingsMock,
      baseUrl: process.env.NEXT_PUBLIC_REPLAY_API_URL || process.env.REPLAY_API_URL || 'http://localhost:8080',
    };
    this.logger = config.logger;
    this.routeBuilder = new RouteBuilder(this.settings, this.logger);
  }

  async createPlayer(request: CreatePlayerProfileRequest, authToken: string): Promise<PlayerProfile | undefined> {
    return this.routeBuilder.post<CreatePlayerProfileRequest, PlayerProfile>(
      ReplayApiResourceType.Players,
      request,
      authToken
    );
  }

  async searchPlayers(query: string, authToken?: string): Promise<PlayerSearchResult | undefined> {
    return this.routeBuilder.search<PlayerSearchResult>(
      ReplayApiResourceType.Players,
      query,
      authToken
    );
  }

  async getPlayer(playerId: string, authToken?: string): Promise<Player | undefined> {
    return new RouteBuilder(this.settings, this.logger)
      .route(ReplayApiResourceType.Player, { playerId })
      .get<Player>(ReplayApiResourceType.Player);
  }
}
