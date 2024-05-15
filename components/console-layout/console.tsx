"use client";

import React from "react";
import { Avatar, Button, ScrollShadow, Tooltip, Spacer, User, Link, LinkIcon } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";

import { AcmeLogo } from "./acme";
import { sectionItemsWithTeams } from "./sidebar-items";
import { cn } from "./cn";
import { LoginButton } from '../login-button';
import Sidebar from "./sidebar";

import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Providers } from '../default-layout/providers';
import Box from '../default-layout/box';
import { logo } from '../primitives';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import DefaultLogo from '../logo/logo-default';

import DefaultLogoOnlyIcon from '../logo/logo-default-only-icon';
import DefaultLogoNoIcon from '../logo/logo-default-no-icon';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: 'device-width',
  initialScale: 1,
};

// Exporting this way to avoid NextJs 14 type error
export { viewport };

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession()


  const isCompact = useMediaQuery("(max-width: 768px)");
  const [isHidden, setIsHidden] = React.useState(false);

  const sessionAvatar = (): React.ReactNode => {
    if (session?.user) {
      return (
        <div>
          <Avatar
            isBordered
            className="flex-none"
            size="sm"
            src={session?.user?.image || ""}
          />
        </div>)
    }

    return (<div></div>)
  }

  return (
    <Box>
      <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>

        <div className="flex h-dvh w-full">
          <div
            className={cn(
              "relative flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
              {
                "w-16 items-center px-2 py-6": isCompact,
              },
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 px-3",

                {
                  "justify-center gap-0": isCompact,
                },
              )}
            >
              <div className="flex h-8 w-2 items-center justify-center rounded-full">
                <div style={{
                  transform: "scale(1.2)",
                  transformOrigin: "right",
                }}>

                  <DefaultLogoOnlyIcon />
                </div>

              </div>
              <span
                style={{
                  transform: "scale(1.8)",
                  transformOrigin: "left",
                }}
                className={cn("text-small font-bold opacity-100", {
                  "w-0 opacity-0": isCompact,
                  "transform -scale": !isCompact,
                })}
              >
                <DefaultLogoNoIcon tag={false}></DefaultLogoNoIcon>
              </span>
            </div>
            <Spacer y={8} />
            <div className="flex items-center gap-3 px-3">
              {sessionAvatar()}
              <div className={cn("flex max-w-full flex-col", { hidden: isCompact })}>
                <p className="truncate text-small font-medium text-default-600">{session?.user?.name || LoginButton()}</p>
                <p className="truncate text-tiny text-default-400">{session?.user?.email || ""}</p>
              </div>
            </div>
            <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
              <Sidebar defaultSelectedKey="home" isCompact={isCompact} items={sectionItemsWithTeams} />
            </ScrollShadow>
            <Spacer y={2} />
            <div
              className={cn("mt-auto flex flex-col", {
                "items-center": isCompact,
              })}
            >
              <Tooltip content="Help & Feedback" isDisabled={!isCompact} placement="right">
                <Button
                  fullWidth
                  className={cn(
                    "justify-start truncate text-default-500 data-[hover=true]:text-foreground",
                    {
                      "justify-center": isCompact,
                    },
                  )}
                  isIconOnly={isCompact}
                  startContent={
                    isCompact ? null : (
                      <Icon
                        className="flex-none text-default-500"
                        icon="solar:info-circle-line-duotone"
                        width={24}
                      />
                    )
                  }
                  variant="light"
                >
                  {isCompact ? (
                    <Icon
                      className="text-default-500"
                      icon="solar:info-circle-line-duotone"
                      width={24}
                    />
                  ) : (
                    "Help & Information"
                  )}
                </Button>
              </Tooltip>
              <Tooltip content="Log Out" isDisabled={!isCompact} placement="right">
                <Button
                  className={cn("justify-start text-default-500 data-[hover=true]:text-foreground", {
                    "justify-center": isCompact,
                  })}
                  isIconOnly={isCompact}
                  onClick={() => signOut()}
                  startContent={
                    isCompact ? null : (
                      <Icon
                        className="flex-none rotate-180 text-default-500"
                        icon="solar:minus-circle-line-duotone"
                        width={24}
                      />
                    )
                  }
                  variant="light"
                >
                  {isCompact ? (
                    <Icon
                      className="rotate-180 text-default-500"
                      icon="solar:minus-circle-line-duotone"
                      width={24}
                    />
                  ) : (
                    "Log Out"
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="w-full flex-1 flex-col p-4">
            <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
              <h2 className="text-medium font-medium text-default-700">Overview</h2>
            </header>
            <main className="mt-4 h-full w-full overflow-visible">
              <div className="flex h-[90%] w-full flex-col gap-4 rounded-medium border-small border-divider">
                {children}
              </div>
            </main>
          </div>
        </div>
      </Providers>
    </Box>
  );
}
