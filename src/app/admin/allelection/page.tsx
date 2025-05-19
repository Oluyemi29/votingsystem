import AdminNavbar from "@/components/AdminNavbar";
import AllElection from "@/components/AllElection";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import React from "react";

export const metadata: Metadata = {
  title: "All Election",
};

const page = async () => {
  noStore();
  const allElection = await prisma.election.findMany();
  return (
    <div>
      <AdminNavbar Currentpage="All Election" />
      <AllElection allElection={allElection} />
    </div>
  );
};

export default page;
