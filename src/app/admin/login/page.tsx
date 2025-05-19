import AdminLogin from "@/components/AdminLogin";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Login",
};

const page = () => {
  return (
    <div>
      <AdminLogin />
    </div>
  );
};

export default page;
