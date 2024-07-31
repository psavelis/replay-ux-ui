import { CSFilters } from './searchable'
import { ReplayApiSettingsMock } from './settings'

export class ReplayApiClient {
    constructor(readonly rid: string) {}

    getRounds(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.round, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }
    
    getMatches(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.match, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getPlayers(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.player, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getTeams(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.teams, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getHighlights(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.highlight, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getEvents(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.event, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getReplays(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.replay, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getGames(params: CSFilters) {
        const url = this.getSearchUrl(ReplayApiSettingsMock.resources.game, params)
        return fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-reso-id': this.rid,
            },
          });
    }

    getSearchUrl(resource: string, params: CSFilters) {
        const url = new URL(resource, ReplayApiSettingsMock.baseUrl)
        const parameters = (Object.keys(params) as Array<keyof CSFilters>)
        for (const name of parameters) {
            const hasValue = (params[name] !== null && params[name] !== undefined && params[name] !== "")
            const emptyArray = (Array.isArray(params[name]) && (params[name] as []).length === 0)
            if (hasValue && !emptyArray) {
                url.searchParams.append(name, encodeURIComponent(params[name]!.toString()))
            }
        }

        return url
    }
}