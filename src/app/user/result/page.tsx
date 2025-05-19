import Result from "@/components/Result";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vote Result",
};

const page = async () => {

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
