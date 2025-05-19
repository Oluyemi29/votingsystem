import { Button } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserNavbar = () => {
  const { data: session } = useSession();
  return (
    <div className="w-full flex flex-row justify-between items-center">
      <Link href={"/user"}>
        <Image
          src={
            session?.user.image ??
            "https://i.pinimg.com/736x/aa/0b/a0/aa0ba04d7b5c534acbcf55de2dd51b85.jpg"
          }
          alt="user"
          width={30}
          height={30}
          priority
          quality={95}
          className="w-9 h-9 border-2 border-emerald-700 rounded-full"
        />
      </Link>
      <Button
        onPress={() => signOut()}
        className="bg-red-700 text-white"
        size="sm"
      >
        Logout
      </Button>
    </div>
  );
};

export default UserNavbar;
