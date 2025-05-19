import AdminNavbar from "@/components/AdminNavbar";
import AllUsers from "@/components/AllUsers";
import { Metadata } from "next";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "All Users",
};
const page = async () => {
  noStore();
  const allUsers = await prisma.user.findMany();
  return (
    <div>
      <AdminNavbar Currentpage="All User" />
      <AllUsers allUsers={allUsers} />
    </div>
  );
};

export default page;
