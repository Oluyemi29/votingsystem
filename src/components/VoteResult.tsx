"use client";
import dynamic from "next/dynamic";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import UserNavbar from "./UserNavbar";

type ContestantScoreProps = {
  ContestantScore: {
    name: string;
    id: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    position: string;
    vote: number;
    positionId: string;
    electionId: string;
  }[];
};

type RechartGrouped = {
  [positionId: string]: {
    name: string;
    vote: number;
    fill: string;
    posiName: string;
  }[];
};

const VoteResult = ({ ContestantScore }: ContestantScoreProps) => {
  const GroupedContestant: RechartGrouped = ContestantScore.reduce(
    (acc, currentContestant) => {
      if (!acc[currentContestant.positionId]) {
        acc[currentContestant.positionId] = [];
      }
      acc[currentContestant.positionId].push({
        name: currentContestant.name,
        vote: currentContestant.vote,
        fill: "",
        posiName: currentContestant.position,
      });

      return acc;
    },
    {} as RechartGrouped
  );

  for (const [position, contestant] of Object.entries(GroupedContestant)) {
    const voteArray = contestant.map((eachContest) => eachContest.vote);
    const MaxVote = Math.max(...voteArray);
    const MinVote = Math.min(...voteArray);

    GroupedContestant[position] = contestant.map((eachContest) => ({
      ...eachContest,
      fill:
        MaxVote === MinVote
          ? "#FACC15"
          : eachContest.vote === MaxVote
          ? "#10B981"
          : eachContest.vote === MinVote
          ? "#ed1307"
          : "",
    }));
  }
  
  return (
    <div className="w-full h-screen md:my-5 flex flex-col justify-center items-center">
      <div className="md:w-2/6 bg-white border-2 border-emerald-700 rounded-lg p-5 w-full">
        <UserNavbar />
        <h1 className="text-center my-3 text-[0.9rem] text-emerald-700 font-semibold">
          Vote Result
        </h1>
        <div className="flex flex-col gap-5 w-full h-80 overflow-x-scroll">
          {ContestantScore.length > 0 ? (
            <>
              {Object.entries(GroupedContestant).map(([index, data]) => {
                return (
                  <div key={index}>
                    <h1 className="text-center font-semibold text-[0.9rem] text-emerald-700">
                      {data[0].posiName}
                    </h1>
                    <BarChart width={300} height={250} data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="vote">
                        {data.map((eachData, index) => {
                          return (
                            <Cell key={`cell-${index}`} fill={eachData.fill} />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <div className="flex flex-col w-full h-full justify-center items-center">
                <h1 className="text-emerald-700 text-sm">
                  No Result to display
                </h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(VoteResult), {
  ssr: false,
});
