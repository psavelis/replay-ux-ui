export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	logoName: "TeamPRO",
	name: "TeamPRO",
	description: "Generate insights and exclusive badges from your matches!",
	navItems: [
		{
			label: "[ news ]",
			href: "/news",
		},
		// {
		// 	label: "Uploads",
		// 	href: "/uploads",
		// },
		// {
		// 	label: "Getting Started",
		// 	href: "/getting-started", // Product Landing
		// 	// sections com cada produto, para landing individuais
		// },
		{
			label: " /  start",
			href: "/match-making",
		  },
		{
			label: " /  highlights",
			href: "/blog",
			// sections, Cloud=[Replays, Config, Spray/Partn], Stats=[Highlights, Matches, Teams, Players], Supply=[Competition Items, Pass, Esports Events, Esports products]
		},
		// {
		// 	label: "Matches",
		// 	href: "/matches", // Search page (option/future features: live matches, match settings, match stats, match replays, match vault, match calendar, match blog, match about, match help-feedback)
		// },
		// {
		// 	label: "Teams",
		// 	href: "/teams", // Search page (option: new team, join team, team settings, team stats, team matches, team players, team replays, team vault, team calendar, team blog, team about, team help-feedback)
		// },
		// {
		// 	label: "Players",
		// 	href: "/players", // Search page (option: new player, player settings, player stats, player matches, player replays, player vault, player calendar, player blog, player about, player help-feedback, player logout)
		// },
		{
			label: " /  demos",
			href: "/replays",
		},
		{
			label: " / upload",
			href: "/cloud", // ProductLanding (if not logged in) / Dashboard (if logged in) (option: storage, private, privately shared, public, upgrade to pro)
		},
		{
		  label: "/ vault",
		  href: "/supply", // Product Landing (Promos, Pass etc, Landing before display product offers, only if logged in)
		},
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Team",
			href: "/team",
		},
		{
			label: "Calendar",
			href: "/calendar",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/leetgaming/nextui",
		twitter: "https://twitter.com/x",
		tech: "https://dev.leetgaming.pro",
		discord: "https://discord.gg/123",
		sponsor: "https://patreon.com/psavelis"
	},
};