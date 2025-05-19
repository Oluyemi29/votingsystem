"use client";
import React from "react";
import UserNavbar from "./UserNavbar";
import Link from "next/link";
import { FaUserCheck } from "react-icons/fa6";

type VoteResultProps = {
  VoteResult: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }[];
};
const Result = ({ VoteResult }: VoteResultProps) => {
  return (
    <div className="w-full h-screen md:my-10 flex flex-col justify-center items-center">
      <div className="md:w-2/6 w-full border-2 border-emerald-700 rounded-lg p-5">
        <UserNavbar />
        <h1 className="text-center font-semibold my-5  text-emerald-700">
          View Results
        </h1>
        <div className="flex flex-col h-60 overflow-y-scroll gap-5">
          {VoteResult.length > 0 ? (
            <>
              {VoteResult.map((eachResult, index) => {
                return (
                  <Link key={index} href={`/user/result/${eachResult.id}`}>
                    <div className="w-full bg-emerald-100 py-5 px-5 rounded-lg text-emerald-700">
                      <div className="flex flex-row justify-between w-full text-emerald-700">
                        <div className="w-[70%]">
                          <h1 className="text-medium line-clamp-1">
                            {eachResult.title}
                          </h1>
                          <p className="text-[0.7rem]  line-clamp-1 text-emerald-700">
                            {eachResult.description}
                          </p>
                        </div>
                        <FaUserCheck size={24} />
                      </div>
                      <div className="flex mt-2 flex-row justify-between w-full text-emerald-700">
                        <div>
                          <p className="text-[0.6rem]">Start Time</p>
                          <p className="text-[0.6rem]">
                            {eachResult.startTime.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[0.6rem]">Start End</p>
                          <p className="text-[0.6rem]">
                            {eachResult.endTime.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </>
          ) : (
            <>
              <div className="w-full flex flex-col h-full justify-center items-center">
                <h1 className="text-sm text-emerald-700">
                  No Vote Results available currently
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
