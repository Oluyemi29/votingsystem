"use client";
import { Select, SelectItem } from "@heroui/react";
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

type allWinnersprops = {
  allWinners: {
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
  allElections: {
    id: string;
    description: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    startTime: Date;
    endTime: Date;
  }[];
};

type winnerProps = {
  [positionId: string]: {
    name: string;
    vote: number;
    fill: string;
    positionName: string;
  }[];
};

const AllWinner = ({ allWinners, allElections }: allWinnersprops) => {
  const [election, setElection] = React.useState<string>("");
  const electionInfo = allElections.map((eachElection) => {
    return {
      key: `${eachElection.id},,,,${eachElection.title}`,
      label: eachElection.title,
    };
  });
  const electionId = election.split(",,,,")[0];

  const NeededElection = allWinners.filter((eachWinners) => {
    return eachWinners.electionId === electionId;
  });
  const ElectionWinner: winnerProps = NeededElection.reduce(
    (acc, currentContestant) => {
      if (!acc[currentContestant.positionId]) {
        acc[currentContestant.positionId] = [];
      }
      acc[currentContestant.positionId].push({
        name: currentContestant.name,
        vote: currentContestant.vote,
        fill: "",
        positionName: currentContestant.position,
      });
      return acc;
    },
    {} as winnerProps
  );

  for (const [positionId, currentContestant] of Object.entries(
    ElectionWinner
  )) {
    const VoteArray = currentContestant.map(
      (eachContestant) => eachContestant.vote
    );
    const MaxVote = Math.max(...VoteArray);
    const MinVote = Math.min(...VoteArray);
    ElectionWinner[positionId] = currentContestant.map((eachContestant) => {
      return {
        ...eachContestant,
        fill:
          MaxVote === MinVote
            ? "#FACC15"
            : eachContestant.vote === MaxVote
            ? "#10B981"
            : eachContestant.vote === MinVote
            ? "#ed1307"
            : "",
      };
    });
  }

  return (
    <div className="w-[95%] mx-auto">
      <p className="text-emerald-700">
        select the election to check the winner
      </p>
      <Select
        className="w-1/4"
        label="Select Eletion"
        placeholder="Select a Election"
        selectedKeys={[election]}
        variant="bordered"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setElection(e.target.value);
        }}
      >
        {electionInfo.map((electionDetail) => (
          <SelectItem key={electionDetail.key}>
            {electionDetail.label}
          </SelectItem>
        ))}
      </Select>
      <p className="text-small text-default-500">
        Selected: {election.split(",,,,").pop()}
      </p>
      <div className="grid grid-cols-2">
        {Object.entries(ElectionWinner).map(([index, eachWinner]) => {
          return (
            <div key={index}>
              <h1 className="text-emerald-700 ml-16 mt-10 font-semibold">{eachWinner[0].positionName} Charts</h1>

              <BarChart width={300} height={300} data={eachWinner}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vote">
                  {eachWinner.map((eachData, indexs) => {
                    return <Cell key={`cell-${indexs}`} fill={eachData.fill} />;
                  })}
                </Bar>
              </BarChart>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllWinner;
