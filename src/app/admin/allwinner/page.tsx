import AdminNavbar from "@/components/AdminNavbar";
import AllWinner from "@/components/AllWinner";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "All Winner",
};

const page = async () => {
  noStore();
  const now = new Date();
  const [allWinners, allElections] = await Promise.all([
    await prisma.contestant.findMany({
      where: {
        Election: {
          endTime: {
            lte: now,
          },
        },
      },
    }),
    await prisma.election.findMany({
      where: {
        endTime: {
          lte: now,
        },
      },
    }),
  ]);
  return (
    <div>
      <AdminNavbar Currentpage="All Winner" />
      <AllWinner allWinners={allWinners} allElections={allElections} />
    </div>
  );
};

export default page;
