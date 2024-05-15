'use client'; // Make sure to enable Client Components for next/link

import {
  Image,
  Button,
  Spacer,
  Divider,
  Card,
  Link,
} from "@nextui-org/react";
import DefautLogo from '@/components/logo/logo-default';
import { title, subtitle, logo } from "@/components/primitives";
import DemoFilters from './filter';

export default function Uploads() {
  return (
      <DemoFilters />
  );
}
