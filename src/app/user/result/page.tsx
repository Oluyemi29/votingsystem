import Result from "@/components/Result";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "Vote Result",
};

const page = async () => {
  noStore();
  const now = new Date();

  const VoteResult = await prisma.election.findMany({
    where: {
      endTime: {
        lt: now,
      },
    },
  });

  return (
    <div>
      <Result VoteResult={VoteResult} />
    </div>
  );
};

export default page;
