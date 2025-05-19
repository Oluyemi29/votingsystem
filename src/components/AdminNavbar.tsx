"use client";
import { Button } from "@heroui/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

type CurrentpageProps = {
  Currentpage: string;
};
const AdminNavbar = ({ Currentpage }: CurrentpageProps) => {
  return (
    <div className="my-5">
      <h1 className="text-center text-lg mb-3 font-semibold text-emerald-700">
        Admin Dashboard
      </h1>
      <div className="flex flex-row justify-center items-center gap-6">
        <Button
          as={Link}
          href="/admin"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          All User
        </Button>
        <Button
          as={Link}
          href="/admin/createelection"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          Create Election
        </Button>
        <Button
          as={Link}
          href="/admin/allelection"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          All Election
        </Button>
        <Button
          as={Link}
          href="/admin/allposition"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          All Position
        </Button>
        <Button
          as={Link}
          href="/admin/allcontestant"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          All Contestant
        </Button>
        <Button
          as={Link}
          href="/admin/allwinner"
          className="text-emerald-700 font-semibold bg-transparent border-2 border-emerald-700"
        >
          All Winner
        </Button>
        <Button onPress={() => signOut()} className="bg-red-700 text-white">
          Logout
        </Button>
      </div>
      <h1 className="text-center text-lg my-3 font-semibold text-emerald-700">
        {Currentpage}
      </h1>
    </div>
  );
};

export default AdminNavbar;
