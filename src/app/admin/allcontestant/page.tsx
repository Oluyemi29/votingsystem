import AdminNavbar from "@/components/AdminNavbar";
import AllContestant from "@/components/AllContestant";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "All Contestant",
};

const page = async () => {
  noStore();
  
  const [allContestant, allPosition, allElection] = await Promise.all([
    await prisma.contestant.findMany({
      include: {
        Position: true,
        Election: true,
      },
    }),
    await prisma.position.findMany({
      include: {
        Election: true,
      },
    }),
    await prisma.election.findMany(),
  ]);
  return (
    <div>
      <AdminNavbar Currentpage="All Contestant" />
      <AllContestant
        allElection={allElection}
        allPosition={allPosition}
        allContestant={allContestant}
      />
    </div>
  );
};

export default page;
