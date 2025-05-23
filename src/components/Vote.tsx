"use client";
import React from "react";
import UserNavbar from "./UserNavbar";
import { FaUserCheck } from "react-icons/fa";
import Link from "next/link";

type AvailableVoteProps = {
  AvailableVote: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }[];
};
const Vote = ({ AvailableVote }: AvailableVoteProps) => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="md:w-2/6 bg-white w-full border-2 border-emerald-700 rounded-lg p-5">
        <UserNavbar />
        <h1 className="text-center font-semibold my-5  text-emerald-700">
          Votes
        </h1>
        <div className="flex flex-col h-60 overflow-y-scroll gap-5">
          {AvailableVote.length > 0?<>
          
          {AvailableVote.map((eachVote, index) => {
            return (
              <Link key={index} href={`/user/vote/${eachVote.id}`}>
                <div className="w-full bg-emerald-100 py-5 px-5 rounded-lg text-emerald-700">
                  <div className="flex flex-row justify-between w-full text-emerald-700">
                    <div className="w-[70%]">
                      <h1 className="text-medium line-clamp-1">
                        {eachVote.title}
                      </h1>
                      <p className="text-[0.7rem]  line-clamp-1 text-emerald-700">
                        {eachVote.description}
                      </p>
                    </div>
                    <FaUserCheck size={24} />
                  </div>
                  <div className="flex mt-2 flex-row justify-between w-full text-emerald-700">
                    <div>
                      <p className="text-[0.6rem]">Start Time</p>
                      <p className="text-[0.6rem]">
                        {eachVote.startTime.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[0.6rem]">End Time</p>
                      <p className="text-[0.6rem]">
                        {eachVote.endTime.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          </>:<>
          <div className="flex flex-col w-full h-full justify-center items-center">
            <h1 className="text-emerald-700 text-sm">No Vote Available currently</h1>
          </div>
          </>}
        </div>
      </div>
    </div>
  );
};

export default Vote;
