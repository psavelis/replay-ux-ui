

import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/dropdown'
import { MailIcon, SteamIcon } from './icons'
import { logo } from './primitives'
import { signIn } from 'next-auth/react'
import { GoogleIcon } from './signup/social'
import { Link, Spacer } from '@nextui-org/react'
import { DefaultLogoOnlyIcon } from './logo/logo-default-only-icon'
import BattleButton from './filters/ctas/material-button/battle-button';
import { useTheme } from 'next-themes'

export const LoginButton = () => {
  const { theme } = useTheme()
  return (
    <div className="flex">
      <Link style={{ borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold", color: theme === "dark" ? "#f5f0e1" : "#34445C"}} href="/signup">[ sign-up ]</Link>
      <Spacer x={4} />
      <Dropdown>
        <DropdownTrigger>
          <BattleButton style={{ height: "64px", width: "100px", borderRadius: "0", borderColor: "none", borderStyle: "solid", borderWidth: "0px", fontWeight: "bold", color: "#F5F5F5", marginRight: "-25px"}}>
            / sign-in
          </BattleButton>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Sign-In Options">
          <DropdownSection title="Try For Free" showDivider>
            <DropdownItem
              key="pro"
              // className="text-success"
              shortcut="⌘T"
              description="30-day free trial. No credit card required."
              // startContent={<FlashIcon />}
              startContent={<DefaultLogoOnlyIcon />}
              href="/signup"
            >
              <small>Try </small> <em><span className={logo({ color: "blue" })}>PRO</span></em>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Sign-in using your OpenID provider" showDivider>
            <DropdownItem
              key="steam"
              shortcut="⌘S"
              description="Sign in with your Steam account"
              onClick={() => signIn(["steam"] as any)}
              startContent={<SteamIcon />}
            >
              Steam
            </DropdownItem>
            <DropdownItem
              key="google"
              shortcut="⌘G"
              description="Sign in with your Google account"
              onClick={() => signIn(["google"] as any)}
              startContent={<div><GoogleIcon /><Spacer x={9} /></div>}
            >
              Google
            </DropdownItem>
            {/* <DropdownItem
                  key="copy"
                  shortcut="⌘C"
                  description="Copy the file link"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                >
                  Copy link
                </DropdownItem>
                <DropdownItem
                  key="edit"
                  shortcut="⌘⇧E"
                  description="Allows you to edit the file"
                  startContent={<EditDocumentIcon className={iconClasses} />}
                >
                  Edit file
                </DropdownItem> */}
          </DropdownSection>
          <DropdownSection title="Passwordless Sign-In">
            <DropdownItem
              key="register"
              // className="text-success"
              shortcut="⌘R"
              description="Receive a verification code via email"
              // startContent={<FlashIcon />}
              startContent={<MailIcon height={"1.7em"} width={"1.7em"} />}
              href="/signup"

            >
              <span>Sign-in with email</span>
            </DropdownItem>
          </DropdownSection>

        </DropdownMenu>
      </Dropdown>
    </div>
  )
}