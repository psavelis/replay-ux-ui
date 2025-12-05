'use client';

import { Link } from '@nextui-org/react'
import EsportsButton from './ui/esports-button'

export const LoginButton = () => {
  return (
    <div className="flex items-center h-full">
      <Link href="/signin" className="h-full flex items-center">
        <EsportsButton
          variant="primary"
          size="md"
          glow
          className="h-full min-h-[2.75rem]"
        >
          <span className="text-inherit font-black tracking-wider">&gt;_</span>
          <span>SIGN IN</span>
        </EsportsButton>
      </Link>
    </div>
  )
}