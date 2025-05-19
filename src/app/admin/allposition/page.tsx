import AdminNavbar from "@/components/AdminNavbar";
import AllPosition from "@/components/AllPosition";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "All Position",
};

const page = async () => {
  noStore();
  const allPosition = await prisma.position.findMany({
    include: {
      Election: true,
    },
  });
  const allElection = await prisma.election.findMany();
  return (
    <div>
      <AdminNavbar Currentpage="All Position"/>
      <AllPosition allPosition={allPosition} allElection={allElection} />
    </div>
  );
};

export default page;
