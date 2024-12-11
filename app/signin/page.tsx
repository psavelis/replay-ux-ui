"use client"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SignIn from '@/components/signin/app-blurred-test';
import { Progress } from '@nextui-org/react';

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
      router.push('/home4');
    }
  }, [isMounted, status, router]);

  if (status === 'loading') {
    return <div className="flex relative justify-center items-center w-full" >
      <span>Loading...</span>
      <Progress isIndeterminate aria-label="Your request is being processed..." className="max-w-md" size="lg" />;
    </div>;
  }

  if (status === 'authenticated') {
    <div className="flex relative justify-center items-center w-full" >
    <span>Authenticated successfully. Redirecting...</span>
    <Progress isIndeterminate aria-label="Your request is being processed..." className="max-w-md" size="lg" />;
  </div>;
  }

  return <SignIn />;
}
