"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignIn from '@/components/signin/app-blurred-test';
import { Progress } from '@nextui-org/react';
import { logo } from '@/components/primitives';

export default function SignUpApp() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && status === 'authenticated') {
      // Show a loading message
      // console.log('Authenticated successfully. Redirecting...');
      // Redirect to /home4 after authentication
      router.push('/landing');
    }
  }, [isMounted, status, router]);

  if (status === 'loading') {
    return <div className="flex flex-col relative justify-center items-center w-full h-full py-44" style={{
      // backgroundImage: `url('/dark_bg_tailwind.jpg')`,
      // backgroundSize: "cover",
      // backgroundColor: "rgba(0, 0, 0, 0.5)",
    }}>
      <span style={{ fontSize: "24px"}} className={`${logo({color: "battleOrange"})}`}><span className="shadow-lg">Loading...</span></span>
      <Progress color="warning" isIndeterminate aria-label="Your request is being processed..." className="max-w-md" size="lg" />
      <span>Your request is being processed...</span>
    </div>;
  }

  if (status === 'authenticated') {
    <div style={{
      // backgroundImage: `url('/dark_bg_tailwind.jpg')`,
      // backgroundSize: "cover",
      // backgroundColor: "rgba(0, 0, 0, 0.5)",
    }} className="flex relative justify-center items-center w-full h-full py-44" >
    <span>Authenticated successfully. Redirecting...</span>
    <Progress color="success" isIndeterminate aria-label="Authenticated successfully. Redirecting..." className="max-w-md" size="lg" />
  </div>;
  }

  return <SignIn />;
}
