"use client"
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown';
import { Button, Link, Spacer, User } from '@nextui-org/react';
import { DeleteDocumentIcon, LogOutIcon, Logo, PlusIcon, PowerButtonIcon, UserIcon } from './icons';
import { logo } from './primitives';
import { button as buttonStyles } from "@nextui-org/theme";
import { useSession, signIn, signOut } from "next-auth/react"
import { VerticalDotsIcon } from '@/app/replays/VerticalDotsIcon';
import BattleButton from './filters/ctas/battle-button/battle-button';
import { useTheme } from 'next-themes';

export default function SessionButton() {
  const { data: session } = useSession();
  const { theme } = useTheme()

  return (
    <div className='flex relative' >
      <Link href="/replays" style={{ borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold" }}>
        <BattleButton variant="light" disableRipple endContent={<VerticalDotsIcon width={undefined} height={undefined} />}>Console</BattleButton>
      </Link>
      <Spacer x={4} />
   
      <BattleButton variant="light" disableRipple endContent={<PowerButtonIcon />} onClick={() => signOut()}>Logout</BattleButton>
    </div>
  );
}

