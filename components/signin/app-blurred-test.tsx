"use client";

import type {InputProps} from "@nextui-org/react";

import React from "react";
import {Input, Checkbox, Link, Divider} from "@nextui-org/react";
import {Icon} from "@iconify/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SteamIcon } from "../icons";
import { GoogleIcon } from "./social";
import EsportsButton from "../ui/esports-button";

export default function SignInBlurreds() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('email-password', {
        email,
        password,
        action: 'login',
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error);
      } else if (result?.ok) {
        router.push('/match-making');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses: InputProps["classNames"] = {
    inputWrapper:
      "border-transparent bg-default-50/40 dark:bg-default-50/20 group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20 !rounded-none",
    input: "!rounded-none",
    base: "!rounded-none",
  };

  return (
    <div
    className="flex h-screen w-screen items-center justify-center overflow-hidden bg-content1 p-2 sm:p-4 lg:p-8"
    style={{
      backgroundImage:
        "url('/blur-glow-pry-gh.svg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
      {/* Angular card container with diagonal cut */}
      <div
        className="flex w-full max-w-sm flex-col gap-4 bg-background/60 px-8 pb-10 pt-6 shadow-2xl backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50 border border-foreground/10"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)",
        }}
      >
        <div className="text-center pb-2">
          <h1 className="text-2xl font-bold tracking-tight uppercase">Welcome Back</h1>
          <p className="text-sm text-foreground/60 mt-1 uppercase tracking-wider">Sign in to your account</p>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleEmailSignIn}>
          {error && (
            <div className="bg-danger-50 dark:bg-danger-900/20 p-3 text-sm text-danger" style={{clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)"}}>
              {error}
            </div>
          )}
          <Input
            classNames={inputClasses}
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isLoading}
            radius="none"
          />
          <Input
            classNames={inputClasses}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDisabled={isLoading}
            radius="none"
          />
          <div className="flex items-center justify-between px-1 py-2">
            <Checkbox
              classNames={{
                wrapper: "before:border-foreground/50 rounded-none",
              }}
              name="remember"
              size="sm"
              radius="none"
            >
              <span className="text-sm uppercase tracking-wide">Remember me</span>
            </Checkbox>
            <Link className="text-foreground/50 uppercase text-xs tracking-wider" href="#" size="sm">
              Forgot password?
            </Link>
          </div>
          <EsportsButton
            variant="primary"
            size="lg"
            fullWidth
            glow
            type="submit"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'SIGNING IN...' : 'LOG IN'}
          </EsportsButton>
        </form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500 uppercase tracking-widest">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <EsportsButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => signIn("steam", { callbackUrl: "/match-making" })}
          >
            <SteamIcon />
            <span>CONTINUE WITH STEAM</span>
          </EsportsButton>
          <EsportsButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => signIn("google", { callbackUrl: "/match-making" })}
          >
            <GoogleIcon width={24} />
            <span>CONTINUE WITH GOOGLE</span>
          </EsportsButton>
        </div>
        <p className="text-center text-sm text-foreground/60 uppercase tracking-wide">
          Need to create an account?{" "}
          <Link color="foreground" href="/signup" size="sm" className="font-bold uppercase">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
