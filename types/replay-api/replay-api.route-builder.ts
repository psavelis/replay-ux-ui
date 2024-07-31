import { ApiResource, ReplayApiResourceType, ReplayApiSettings } from "./settings";

// interface Loggable {
//   // TODO: 
// }

export type Loggable = any // TODO: implementar

export interface ResultOptions {
  offset?: string | number,
  sort?: string | string[]
}

export type ReplayApiAction = [string, ReplayApiResourceType, ({
  [key: string]: string;
} | undefined)?]

export class RouteBuilder<T extends Object> { // TODO: criar interface (generica) para retornos
  private pathSegments: string[] = [];
  private params: { [key: string]: string } = {};

  constructor(readonly settings: ReplayApiSettings, readonly logger: Loggable) { }

  forGame(gameId: string): RouteBuilder<T> {
    return this.filter(ReplayApiResourceType.Game, { gameId });
  }

  forMatch(matchId: string): RouteBuilder<T> {
    return this.filter(ReplayApiResourceType.Match, { matchId });
  }

  forRound(roundId: string | number): RouteBuilder<T> {
    return this.filter(ReplayApiResourceType.Round, { roundId: typeof roundId !== "string" ? roundId.toString() : roundId});
  }

  forPlayer(playerId: string): RouteBuilder<T> {
    return this.filter(ReplayApiResourceType.Player, { playerId });
  }

  forTeam(teamId: string): RouteBuilder<T> {
    return this.filter(ReplayApiResourceType.Team, { teamId });
  }

  async get(resourceLeaf: ReplayApiResourceType, resultOptions?: ResultOptions): Promise<T | undefined> {
    const url = this.buildUrl(resourceLeaf, resultOptions)

    console.log('fetch(url)', url)

    const res: Response = await fetch(url, {
      method: 'GET',
    })

    const content: T | undefined = await res.json().catch((e) => {
      this.logger.error(e)
      return undefined
    })

    if (!res.ok) {
      const msg = `Status: ${res.status}. Description: ${res.statusText}. (JSON: ${content}))`

      throw new Error(msg)
    }

    return content
  }

  filter(
    resourceType: ReplayApiResourceType,
    params?: { [key: string]: string }
  ): RouteBuilder<T> {
    const resource = this.findResource(resourceType, this.settings.resources);
    if (!resource) {
      throw new Error(`Resource not found: ${resourceType}`);
    }

    this.pathSegments.push(this.buildPath(resource, params));
    return this;
  }

  fromAction(...actions: ReplayApiAction[]): RouteBuilder<T>  {
    for (const [action, resourceType, params] of actions) {
      if (!params) {
        continue
      }

      if (action === "with") {
        this.filter(resourceType, params);
      } else if (action.startsWith("for")) {
        for (const k of Object.keys(params)) {
          this[action as keyof RouteBuilder<T>](params[k] as any); 
        }
      }
    }

    return this
  }
  private buildQueryStrings(resultOptions?: ResultOptions): URLSearchParams {
    const params = new URLSearchParams();
    if (resultOptions) {
      for (const [key, value] of Object.entries(resultOptions)) {
        if (value !== undefined) {
          params.append(key, value.toString()); // Ensure value is a string
        }
      }
    }
    return params;
  }

  private buildPath(resource: ApiResource, params?: { [key: string]: string }): string {
    let path = resource.path;

    if (resource.dynamic && resource.paramName && params && params[resource.paramName]) {
      path = path.replace(`:${resource.paramName}`, encodeURIComponent(params[resource.paramName]));
      delete params[resource.paramName];
    }

    this.params = { ...this.params, ...params };
    return path;
  }

  public buildUrl(resourceLeaf: ReplayApiResourceType, resultOptions?: ResultOptions, omitBaseUrl = false): string {
    const pathSegments = [...this.pathSegments, resourceLeaf];
    const url = new URL(pathSegments.join('/'), this.settings.baseUrl);

    url.search = this.buildQueryStrings(resultOptions).toString();

    if (url.pathname.includes(":")) {
      throw new Error(`Missing required parameters in the route (${url.pathname})`);
    }

    return omitBaseUrl ? url.pathname + url.search : url.toString();
  }

  private findResource(
    resourceType: ReplayApiResourceType,
    resources: ApiResource[]
  ): ApiResource | null {
    for (const res of resources) {
      if (res.type === resourceType) return res;
      if (res.children) {
        const found = this.findResource(resourceType, res.children);
        if (found) return found;
      }
    }
    return null;
  }
}