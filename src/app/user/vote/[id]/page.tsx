import ContestantDetail from "@/components/ContestantDetail";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contestant Details",
};

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const [ContestantDetails, ElectionDetails, AlreadyVotedUsers] =
    await Promise.all([
      await prisma.contestant.findMany({
        where: {
          electionId: id,
        },
      }),
      await prisma.election.findUnique({
        where: {
          id: id,
        },
      }),
      await prisma.election.findUnique({
        where:{
          id
        },
        select: {
          userId: true,
        },
      }),
    ]);

  return (
    <div>
      <ContestantDetail
        ContestantDetails={ContestantDetails}
        ElectionDetails={ElectionDetails}
        AlreadyVotedUsers={AlreadyVotedUsers}
      />
    </div>
  );
};

export default page;
