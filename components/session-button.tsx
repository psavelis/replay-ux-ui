"use client"
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown';
import { Button, Link, Spacer, User } from '@nextui-org/react';
import { DeleteDocumentIcon, LogOutIcon, Logo, PlusIcon, PowerButtonIcon, UserIcon } from './icons';
import { logo } from './primitives';
import { button as buttonStyles } from "@nextui-org/theme";
import { useSession, signIn, signOut } from "next-auth/react"
import { VerticalDotsIcon } from "@/components/files/replays-table/VerticalDotsIcon";
import BattleButton from './filters/ctas/battle-button/battle-button';
import { useTheme } from 'next-themes';
import { Icon } from '@iconify/react';

export default function SessionButton() {
  const { data: session } = useSession();
  const { theme } = useTheme()

  return (
    <div className='flex relative' >
      {/* <Link href="/home5" style={{ borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold" }}>
        <BattleButton variant="light" disableRipple endContent={<VerticalDotsIcon width={undefined} height={undefined} />}>PRO</BattleButton>
      </Link>
      <Spacer x={4} />
      <BattleButton variant="light" disableRipple endContent={<PowerButtonIcon />} onClick={() => signOut()}>Logout</BattleButton> */}

{/* <Link style={{ borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold", color: theme === "dark" ? "#f5f0e1" : "#34445C"}} href="/home5">[ console ]</Link>
      <Spacer x={4} /> */}

      <div style={{ borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold"}}>
      <BattleButton onClick={() => signOut()} style={{ height: "64px", width: "100px", borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold", color: "#F5F5F5", marginRight: "-25px"}}>
       / sign-out
       {/* <strong className={logo({ color: "battleLime" })}><b>&gt;_</b></strong> */}
      </BattleButton>
      </div>
    </div>
  );
}

