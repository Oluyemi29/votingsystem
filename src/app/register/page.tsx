import Register from "@/components/Register";
import { Metadata } from "next";
import React from "react";

export const metadata : Metadata={
  title : "Register"
}

const page = () => {
  
  return (
    <div>
      <Register />
    </div>
  );
};

export default page;
