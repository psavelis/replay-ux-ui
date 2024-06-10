import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchIcon,
  Logo,
  SteamIcon,
  LogOutIcon,
  HeartFilledIcon,
  StarredIcon,
} from "@/components/icons";

import { logo, title } from './primitives';
import { LoginButton } from './login-button';
import SessionButton from './session-button';
import { useSession } from 'next-auth/react';
import SearchInput from "./search/search-modal/search-modal";

import DefaultLogo from './logo/logo-default';
import { useTheme } from "next-themes";
import NavBarSection from "./navbar_section";
import { GameIconsArrowScope, GameIconsCamera, GameIconsChest, GameIconsCloud, GameIconsMouse } from "./logo/icons/arrow-scope";
import { GameIconsLaurelCrown } from "./logo/icons/laurel-crown";
import { GameIconsPerpendicularRings } from "./logo/icons/perpendicular-rings";
import { GameIconsFireDash } from "./logo/icons/fire-dash";
import { GameIconsAerodynamicHarpoon } from "./logo/icons/aerodynamic-harpoon";
import { Kbd } from "@nextui-org/kbd";

export const Navbar = () => {

  let { theme, setTheme } = useTheme();

  if (theme === null || theme === undefined) {
    theme = "dark";
  }

  let SessionArea;

  const { data: session } = useSession()

  console.log('##session##', JSON.stringify(session))
  if (session) {
    SessionArea = SessionButton;
  } else {
    SessionArea = LoginButton;
  }

  const searchInput = SearchInput();

  return (
    <NextUINavbar maxWidth="full" height={62} position="sticky" isBordered={true} isBlurred={true}       style={{
      // backgroundImage: `url('/dark_bg_tailwind.jpg')`,
      // backgroundSize: "cover",
    }}>
      <NavbarContent className="basis-1/5 sm:basis-full">
        <NavbarBrand as="li" className=" max-w-fit">
          <NextLink className="lg:flex flex justify-left items-left align-left" href="/">
            {/* <Logo /> */}

            <DefaultLogo />
            {/* <Chip
              variant="shadow"
              classNames={{
                base: "bg-gradient-to-br from-red-500 to-violet-500 border-small border-white/50 shadow-red-500/30",
                content: "drop-shadow shadow-black text-white",
              }}

              style={{ fontSize: "0.6rem", margin: "0.0rem 0.2rem", height: "0.9rem", maxWidth: "0.2rem"}}
            >
             <strong>Beta</strong>
              
            </Chip> */}

          </NextLink>
          {/* <NavBarSection /> */}
        </NavbarBrand>
        <ul className="hidden lg:flex justify-start ml-2 h-16 justify-center align-items align-center">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}
            style={{
              height: "100%",
              backgroundColor: item.href === "/match-making" ? "#DCFF37" : (item.href === "/supply" ? "#34445C" : ""),
              minWidth: "105px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              
            }}
            >
              <NextLink
                className={clsx(
                  "data-[active=true]:text-primary data-[active=true]:font-medium justify-center align-items align-center w-full text-center"
                )}
                href={item.href}
              >
                { item.href === "/match-making" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: "#34445C"}}><GameIconsArrowScope className="flex w-full "/> {item.label} <small> <Kbd>w</Kbd></small></span>}
                { item.href === "/replays" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: theme === "dark" ? "#f5f0e1" : "#34445C"}}><GameIconsCamera className="flex w-full"/> {item.label} <small> <Kbd>q</Kbd></small></span>}
                { item.href === "/blog" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: theme === "dark" ? "#f5f0e1" : "#34445C"}}> <GameIconsLaurelCrown className="flex w-full"/> <span className="ml-2">{item.label}</span><small> <Kbd>d</Kbd></small></span>}
                { item.href === "/cloud" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: theme === "dark" ? "#f5f0e1" : "#34445C"}}><GameIconsCloud className="flex w-full"/> {item.label} <small> <Kbd>s</Kbd></small></span>}
                { item.href === "/supply" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: "#f5f0e1"}}><GameIconsChest className="flex w-full"/> {item.label} <small> <Kbd>b</Kbd></small></span>}
                { item.href === "/stats" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: "#f5f0e1"}}><GameIconsChest className="flex w-full"/> {item.label}</span>}
                { item.href === "/news" && <span className="text-center w-full" style={{justifyContent: "center", fontWeight: "bold", color: "#f5f0e1"}}><GameIconsPerpendicularRings width={"1.8em"} height={"1.8em"} className="flex w-full"/> {item.label}</span>}
                

                { !["/replays", "/match-making", "/blog", "/cloud", "/supply", "/news" ].includes(item.href) && item.label}
                
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/* <Link isExternal href={siteConfig.links.twitter} aria-label="Twitter">
            <TwitterIcon className="text-default-500" />
          </Link> */}
          {/* <Link isExternal href={siteConfig.links.discord} aria-label="Discord">
            <DiscordIcon className="text-default-500" />
          </Link> */}
          {/* <Link isExternal href={siteConfig.links.github} aria-label="Github">
            <GithubIcon className="text-default-500" />
          </Link> */}
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>


        {/* sponsor button! */}
        {/* <NavbarItem className="hidden md:flex">
					<Button
            isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						href={siteConfig.links.sponsor}
						startContent={<HeartFilledIcon className="text-danger" />}
						variant="flat"
					>
						Sponsor
					</Button>
				</NavbarItem>  */}


        <NavbarItem className="hidden lg:flex">
          <SessionArea />
        </NavbarItem>


      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1" justify="end">
        <Link isExternal href={siteConfig.links.github} aria-label="Github">
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`} className="h-full">
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
