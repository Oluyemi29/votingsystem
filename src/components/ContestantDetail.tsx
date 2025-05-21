"use client";
import React, { useEffect, useState } from "react";
import UserNavbar from "./UserNavbar";
import Image from "next/image";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { IoMdCheckmark } from "react-icons/io";
import { SubmitSelectedContestant } from "@/app/api/Action";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type ContestantDetailsProps = {
  ContestantDetails: {
    name: string;
    id: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    position: string;
    positionId: string;
    electionId: string;
  }[];
  ElectionDetails: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  } | null;
  AlreadyVotedUsers: {
    userId: string[];
} | null
};

type SelectedContestantProps = {
  [position: string]: string;
};
const ContestantDetail = ({
  ContestantDetails,
  ElectionDetails,
  AlreadyVotedUsers,
}: ContestantDetailsProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theTime, setTheTime] = useState("");
  const [selectedContestant, setSelectedContestant] =
    useState<SelectedContestantProps>({});
  const [hideFuntionalButton, setHideFunctionalButton] = useState(true);
  const [alreadyVoted, setAlreadyVoted] = useState(true);

  useEffect(() => {
    const result = AlreadyVotedUsers?.userId.includes(session?.user.id as string)
    setAlreadyVoted(result ? true : false);
  }, [AlreadyVotedUsers, session?.user.id]);
  useEffect(() => {
    const getElectionStartTimeCountdown = () => {
      const Interval = setInterval(() => {
        const startTime = new Date(
          ElectionDetails?.startTime as Date
        ).getTime();
        const endTime = new Date(ElectionDetails?.endTime as Date).getTime();
        const currentTime = new Date().getTime();
        const startTimeDiff = startTime - currentTime;
        const endTimeDiff = endTime - currentTime;
        if (endTimeDiff < 1) {
          clearInterval(Interval);
          setHideFunctionalButton(true);
          setTheTime(`Election Ended`);
          return;
        } else if (startTimeDiff < 1) {
          setHideFunctionalButton(false);
          const Days = Math.floor(endTimeDiff / (24 * 60 * 60 * 1000));
          const Hours = Math.floor(
            (endTimeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
          );
          const Minutes = Math.floor(
            (endTimeDiff % (60 * 60 * 1000)) / (60 * 1000)
          );
          const Seconds = Math.floor((endTimeDiff % (60 * 1000)) / 1000);
          setTheTime(
            `Election End in : ${Days}D ${Hours}H ${Minutes}M ${Seconds}S`
          );
        } else {
          setHideFunctionalButton(true);
          const Days = Math.floor(startTimeDiff / (24 * 60 * 60 * 1000));
          const Hours = Math.floor(
            (startTimeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
          );
          const Minutes = Math.floor(
            (startTimeDiff % (60 * 60 * 1000)) / (60 * 1000)
          );
          const Seconds = Math.floor((startTimeDiff % (60 * 1000)) / 1000);
          setTheTime(
            `Election start in : ${Days}D ${Hours}H ${Minutes}M ${Seconds}S`
          );
        }
      }, 1000);
      return () => clearInterval(Interval);
    };
    getElectionStartTimeCountdown();
  }, [ElectionDetails?.startTime, ElectionDetails?.endTime]);

  const handleSelected = (position: string, contestantId: string) => {
    setSelectedContestant((prevData) => {
      return {
        ...prevData,
        [position]: contestantId,
      };
    });
  };
  const SubmitAllSelected = async () => {
    setLoading(true);
    try {
      const voteToSend = Object.entries(selectedContestant);
      if (voteToSend.length < 1) {
        toast.error("Kindly pick contestant of your choice");
        setLoading(false);
        return;
      }
      const AllSelectedVote = voteToSend.map((eachVote) => {
        return {
          positionId: eachVote[0],
          contestantId: eachVote[1],
        };
      });
      const response = await SubmitSelectedContestant({
        AllSelectedVote,
        userId: session?.user.id as string,
        electId: ElectionDetails?.id as string,
      });
      if (response.success === true) {
        toast.success(response.message);
        setSelectedContestant({});
        setModalVisible(false);
        return router.push("/user");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const ClearAllSelected = () => {
    setSelectedContestant({});
  };
  return (
    <div className="w-full h-screen my-10 flex flex-col justify-center items-center">
      <div className="md:w-2/6 border-2 border-emerald-700 rounded-lg p-5 w-full">
        <UserNavbar />
        <h1 className="text-center text-emerald-700 mt-5 text-[0.8rem] font-semibold">
          Contestant Details
        </h1>
        <p className="md:text-[0.8rem] my-5 text-emerald-700 text-center">
          {theTime}
        </p>

        {ContestantDetails.length < 1 ? (
          <>
            <div className="w-full h-60 flex justify-center items-center flex-col text-center">
              <div>
                <h1 className="text-emerald-700 font-semibold">
                  No Contestant Currently
                </h1>
                <p className="text-emerald-700 text-sm">
                  Admin will soon upload contestant
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="grid h-84 py-3 overflow-y-scroll grid-cols-2 gap-5">
              {ContestantDetails.map((eachContestant, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-lg relative bg-emerald-100"
                  >
                    <Image
                      src={"/selected.png"}
                      alt="Selected"
                      width={100}
                      height={100}
                      hidden={
                        selectedContestant[eachContestant.positionId] ===
                        eachContestant.id
                          ? false
                          : true
                      }
                      className="w-auto h-auto absolute rounded-lg top-1/6 left-1/8"
                    />
                    <Image
                      src={eachContestant.image}
                      alt="vote"
                      width={100}
                      height={100}
                      priority
                      quality={95}
                      className="w-full h-48 rounded-tl-lg rounded-tr-lg"
                    />
                    <div className="p-2">
                      <h1 className="font-semibold text-emerald-700 text-[0.9rem]">
                        {eachContestant.name}
                      </h1>
                      <h1 className="text-emerald-700 text-[0.9rem]">
                        {eachContestant.position}
                      </h1>
                      <Button
                        hidden={
                          alreadyVoted || hideFuntionalButton ? true : false
                        }
                        disabled={
                          alreadyVoted || hideFuntionalButton ? true : false
                        }
                        className="text-white shadow-sm shadow-black bg-emerald-700 rounded-md mt-4 w-full"
                        size="sm"
                        onPress={() =>
                          handleSelected(
                            eachContestant.positionId,
                            eachContestant.id
                          )
                        }
                      >
                        {selectedContestant[eachContestant.positionId] ===
                        eachContestant.id ? (
                          <>
                            Selected <IoMdCheckmark size={20} />
                          </>
                        ) : (
                          <>Vote</>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
              {Object.entries(selectedContestant).length > 0 && (
                <Button
                  hidden={alreadyVoted || hideFuntionalButton ? true : false}
                  disabled={alreadyVoted || hideFuntionalButton ? true : false}
                  onPress={() => ClearAllSelected()}
                  className="bg-red-700 text-white shadow-sm shadow-black rounded-md"
                >
                  Deselect All
                </Button>
              )}

              {loading ? (
                <Button
                  disabled={true}
                  hidden={alreadyVoted || hideFuntionalButton ? true : false}
                  className={`rounded-md bg-emerald-700 text-white shadow-sm shadow-black ${
                    Object.entries(selectedContestant).length < 1 &&
                    "col-span-2"
                  }`}
                  isLoading
                >
                  Submitting...
                </Button>
              ) : (
                <Button
                  hidden={alreadyVoted || hideFuntionalButton ? true : false}
                  onPress={() => setModalVisible(true)}
                  disabled={Object.entries(selectedContestant).length < 1}
                  className={`rounded-md bg-emerald-700 text-white shadow-sm shadow-black ${
                    Object.entries(selectedContestant).length < 1 &&
                    "col-span-2"
                  }`}
                >
                  Submit Vote
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <ModalContent>
          <ModalHeader>Submit Selected Contestant</ModalHeader>
          <ModalBody>
            <p>Are you sure, you want to submit the selected contestant,</p>
            <p>
              Note that, once submitted, it cant be reversed and you can only
              vote once
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              hidden={alreadyVoted || hideFuntionalButton ? true : false}
              disabled={alreadyVoted || hideFuntionalButton ? true : false}
              onPress={() => setModalVisible(false)}
              className="text-white bg-red-700 rounded-md"
            >
              No
            </Button>
            <Button
              hidden={alreadyVoted || hideFuntionalButton ? true : false}
              disabled={alreadyVoted || hideFuntionalButton ? true : false}
              onPress={() => SubmitAllSelected()}
              className="text-white bg-emerald-700 rounded-md"
            >
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ContestantDetail;
