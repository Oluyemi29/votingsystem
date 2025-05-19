import AdminRegister from "@/components/AdminRegister";
import { Metadata } from "next";
import React from "react";

export const metadata : Metadata ={
  title:"Admin Register"
}

const page = () => {
  return (
    <div>
      <AdminRegister />
    </div>
  );
};

export default page;
