import Vote from "@/components/Vote";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "Vote",
};

const page = async () => {
  noStore();
  const AvailableVote = await prisma.election.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div>
      <Vote AvailableVote={AvailableVote}/>
    </div>
  );
};

export default page;
