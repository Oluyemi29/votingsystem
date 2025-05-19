import UserDashboard from "@/components/UserDashboard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};
const page = () => {
  return (
    <div>
      <UserDashboard />
    </div>
  );
};

export default page;
