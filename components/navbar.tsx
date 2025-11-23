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
import { electrolize } from "@/config/fonts";
import { Chip } from "@nextui-org/react";
import { NotificationCenter } from '@/components/notifications/notification-center';

export const Navbar = () => {

  let { theme, setTheme } = useTheme();

  if (theme === null || theme === undefined) {
    theme = "dark";
  }

  let SessionArea;

  const { data: session } = useSession()

  // console.log('##session##', JSON.stringify(session))
  if (session) {
    SessionArea = SessionButton;
  } else {
    SessionArea = LoginButton;
  }

  const searchInput = SearchInput();

  return (
    <NextUINavbar
      maxWidth="full"
      height="3.5rem"
      position="sticky"
      isBordered={false}
      isBlurred={true}
      className="border-b border-divider/30 backdrop-blur-md backdrop-saturate-150"
      classNames={{
        wrapper: "px-4 lg:px-6 max-w-full",
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="max-w-fit">
          <NextLink className="flex items-center gap-2" href="/">
            <DefaultLogo onClick={() => window.location.href = "/"} />
          </NextLink>
        </NavbarBrand>

        <ul className="hidden lg:flex items-center gap-1 ml-4">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  "relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-lg",
                  "hover:bg-default-100 hover:text-foreground",
                  "data-[active=true]:text-primary data-[active=true]:bg-primary/10",
                  electrolize.className
                )}
                href={item.href}
                style={{
                  ...(item.href === "/match-making" && {
                    background: "linear-gradient(135deg, #DCFF37 0%, #B8D930 100%)",
                    color: "#1a1a1a",
                    fontWeight: "600",
                  }),
                  ...(item.href === "/cloud" && {
                    background: "linear-gradient(135deg, #4A5568 0%, #2D3748 100%)",
                    color: "#F5F5F5",
                  }),
                }}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>

        <NavbarItem className="hidden sm:flex gap-1.5 items-center">
          <NotificationCenter enableRealtime={true} />
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden lg:flex">
          <SessionArea />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-4 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href={item.href}
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
