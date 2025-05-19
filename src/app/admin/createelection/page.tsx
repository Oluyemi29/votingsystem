import AdminNavbar from "@/components/AdminNavbar";
import CreateElection from "@/components/CreateElection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create Election",
};
const page = () => {
  return (
    <div>
      <AdminNavbar Currentpage="Create Election Details" />
      <CreateElection />
    </div>
  );
};

export default page;
