"use client";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <HeroUIProvider><SessionProvider >{children}</SessionProvider></HeroUIProvider>;
};

export default Provider;
