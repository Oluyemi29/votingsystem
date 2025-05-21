import VoteResult from "@/components/VoteResult";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const title = await prisma.election.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
    },
  });
  return {
    title: title?.title ?? "Vote Result",
  };
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  noStore();
  const id = (await params).id;
  const now = new Date();
  if (!id) {
    return redirect("/");
  }
  const checkResult = await prisma.election.findUnique({
    where: {
      id,
      endTime: {
        lt: now,
      },
    },
  });
  if (!checkResult) {
    return redirect("/");
  }
  const ContestantScore = await prisma.contestant.findMany({
    where: {
      electionId: id,
    },
  });

  return (
    <div>
      <VoteResult ContestantScore={ContestantScore} />
    </div>
  );
};

export default page;
