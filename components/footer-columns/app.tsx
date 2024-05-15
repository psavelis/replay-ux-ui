"use client";

import type {IconProps} from "@iconify/react";

import React from "react";
import {Chip, Divider, Link, Spacer} from "@nextui-org/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "./social";
import ThemeSwitch from "./theme-switch";
import DefautLogo from '../logo/logo-default';

type SocialIconProps = Omit<IconProps, "icon">;

const footerNavigation = {
  resources: [
    { name: "Game Guides", href: "#" },
    { name: "Pro Player Tips", href: "#" },
    { name: "Match Analysis", href: "#" },
    { name: "Replay Database", href: "#" },
  ],
  community: [
    { name: "Forums", href: "#" },
    { name: "Tournaments", href: "#" },
    { name: "Leaderboards", href: "#" },
    { name: "Partnerships", href: "#" }, // Potential for sponsorships/teams
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Blog", href: "#" }, // Content related to eSports and improvement
    { name: "Contact Us", href: "#" },
    { name: "FAQ", href: "#" }, 
  ],
  legal: [ // Keep these as they are essential
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
  social: [ // Focus on platforms relevant to gamers and eSports
    {
      name: "Discord",
      href: "#",
      icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:discord" />,
    },
    {
      name: "Twitch",
      href: "#",
      icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:twitch" />,
    },
    {
      name: "Twitter",
      href: "#",
      icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:twitter" />,
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: SocialIconProps) => <Icon {...props} icon="fontisto:youtube-play" />,
    },
  ],
};


export default function FooterColumns() {
  const renderList = React.useCallback(
    ({title, items}: {title: string; items: {name: string; href: string}[]}) => (
      <div>
        <h3 className="text-small font-semibold text-default-600">{title}</h3>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.name}>
              <Link className="text-default-400" href={item.href} size="sm">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ),
    [],
  );

  return (
    <footer className="flex w-full flex-col">
      <div className="w-full px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 md:pr-8">
            <div className="flex items-center justify-start">
              <DefautLogo />
            </div>
            <p className="text-small text-default-500">
              Crush Your Competition, One Replay at a Time.
              <Spacer y={4}/>
              <span className="font-medium">“</span>
              <em>Outthink. Outplay. Outlast.</em>
              <span className="font-medium">”</span>

              {/* Don&apost Dream of Victory, Analyze It. */}
              
              {/* Your Potential is <strong>Limitless.</strong> */}
            </p>
            
            <div className="flex space-x-6">
              {footerNavigation.social.map((item) => (
                <Link key={item.name} isExternal className="text-default-400" href={item.href}>
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="w-6" />
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>{renderList({title: "Resources", items: footerNavigation.resources})}</div>
              <div className="mt-10 md:mt-0">
                {renderList({title: "Community", items: footerNavigation.community})}
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>{renderList({title: "Company", items: footerNavigation.company})}</div>
              <div className="mt-10 md:mt-0">
                {renderList({title: "Legal", items: footerNavigation.legal})}
              </div>
            </div>
          </div>
        </div>
        <Divider className="mt-16 sm:mt-20 lg:mt-24" />
        <div className="flex flex-wrap justify-between gap-2 pt-8">
          <p className="text-small text-default-400">&copy; 2024 Leet Gaming Pro Inc. All rights reserved.</p>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  );
}
