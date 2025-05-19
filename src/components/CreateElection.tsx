"use client";
import {
  CreateContestant,
  CreateElectionInfo,
  CreatePosition,
  GetAllElection,
  GetAllPostion,
} from "@/app/api/Action";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ElectionProps = {
  id: string;
  title: string;
}[];
type PositionProps = {
  name: string;
  electionId: string;
  id: string;
}[];

const CreateElection = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const now = new Date().toISOString().slice(0, 16);
  const [election, setElection] = useState("");
  const [description, setDescription] = useState("");
  const [electionLoading, setElectionLoading] = useState(false);
  const [positionLoading, setPositionLoading] = useState(false);
  const [contestantLoading, setContestantLoading] = useState(false);
  const [allElection, setAllElection] = useState<ElectionProps>([]);
  const [allPosition, setAllPosition] = useState<PositionProps>([]);
  const [position, setPosition] = useState("");
  const [electionId, setElectionId] = useState("");
  const [contestantElectionId, setContestantElectionId] = useState("");
  const [contestantPositionId, setContestantPositionId] = useState("");

  const [preview, setPreview] = useState(
    "https://i.pinimg.com/736x/be/08/14/be0814aceac7a4103c3c77ddebfdda28.jpg"
  );
  const [imageFile, setImageFile] = useState<Blob | null>(null);

  const ElectionFormart = allElection.map((eachElection) => {
    const details = {
      key: eachElection.id,
      label: eachElection.title,
    };
    return details;
  });
  // const PositionNeeded = allPosition.filter
  const PositionFormart = allPosition
    .filter((eachPosition) => {
      return eachPosition.electionId === contestantElectionId;
    })
    .map((eachPosition) => {
      const details = {
        key: `${eachPosition.id},,,,${eachPosition.name}`,
        label: eachPosition.name,
      };
      return details;
    });

  const formSchema = z.object({
    contestantname: z
      .string()
      .min(2, { message: "Minimum of 2 character" })
      .max(50, { message: "Maximum of 50 character" }),
    contestantelection: z
      .string()
      .min(2, { message: "Minimum of 2 character" })
      .max(50, { message: "Maximum of 50 character" }),
    contestantposition: z
      .string()
      .min(2, { message: "Minimum of 2 character" })
      .max(50, { message: "Maximum of 50 character" }),
  });

  type formSchemaType = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const handleCreateElection = async () => {
    setElectionLoading(true);
    try {
      const startTime = new Date(start);
      const endTime = new Date(end);
      if (!election || !description || !startTime || !endTime) {
        toast.error("All field are required");
        return;
      }
      const response = await CreateElectionInfo({
        election,
        description,
        endTime,
        startTime,
      });
      if (response.success === true) {
        toast.success(response.message);
        GetElection();
        setElection("");
        setStart("");
        setEnd("");
        setDescription("");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setElectionLoading(false);
    }
  };

  const GetElection = async () => {
    const response = await GetAllElection();
    setAllElection(response);
  };
  const GetPosition = async () => {
    const response = await GetAllPostion();
    setAllPosition(response);
  };

  useEffect(() => {
    GetElection();
    GetPosition();
  }, []);

  const handleCreatePosition = async () => {
    setPositionLoading(true);
    try {
      if (!position || !electionId) {
        toast.error("All field are required");
        return;
      }
      const response = await CreatePosition({ position, electionId });
      if (response.success === true) {
        toast.success(response.message);
        GetPosition();
        setPosition("");
        setElectionId("");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPositionLoading(false);
    }
  };
  const handleCreateContestant = async (value: formSchemaType) => {
    setContestantLoading(true);
    try {
      const contestantimage = await GetImageLink();
      const { contestantelection, contestantname, contestantposition } = value;
      if (!contestantimage) {
        toast.error("All field are required");
        return;
      }
      const contestantPositionName = contestantposition
        .split(",,,,")
        .pop() as string;
      const response = await CreateContestant({
        contestantelection,
        contestantname,
        contestantPositionName,
        contestantimage,
        contestantPositionId,
      });
      if (response.success === true) {
        toast.success(response.message);
        setPreview(
          "https://i.pinimg.com/736x/be/08/14/be0814aceac7a4103c3c77ddebfdda28.jpg"
        );
      } else {
        toast.error(response.message);
      }

      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setContestantLoading(false);
    }
  };

  const handleImageUploader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setPreview(URL.createObjectURL(files[0]));
      setImageFile(files[0]);
    }
  };
  const GetImageLink = async () => {
    const imageData = new FormData();
    imageData.append("file", imageFile as Blob);
    imageData.append("upload_preset", "votingsite");
    imageData.append("folder", "ayede");

    const request = await fetch(
      "https://api.cloudinary.com/v1_1/devoluyemi/image/upload",
      {
        method: "POST",
        body: imageData,
      }
    );
    const response = await request.json();
    return response.secure_url as string;
  };
  return (
    <div>
      <div className="flex flex-row gap-5">
        <div className="w-full flex flex-col gap-5 ">
          {/* Election Form  */}
          <div className="w-[80%] mx-auto p-4 flex flex-col border-2 border-emerald-700 rounded-lg justify-center items-center">
            <h1 className="text-emerald-700 font-semibold mb-3">
              Create Election
            </h1>
            <form method="post" className="w-full  flex flex-col gap-5">
              <Input
                className="w-full"
                label="Create Election"
                placeholder="Create Election"
                value={election}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setElection(e.target.value);
                }}
              />
              <Input
                className="w-full"
                label="Election Description"
                placeholder="Election Description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDescription(e.target.value);
                }}
              />
              <div>
                <p className="text-[0.7rem] mb-1">Start Time</p>
                <input
                  type="datetime-local"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStart(e.target.value);
                  }}
                  value={start}
                  name="startTime"
                  min={now}
                  className="w-full h-14 rounded-lg bg-gray-100 px-3 cursor-pointer"
                />
              </div>
              <div>
                <p className="text-[0.7rem] mb-1">End Time</p>

                <input
                  type="datetime-local"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setEnd(e.target.value);
                  }}
                  value={end}
                  name="endTime"
                  min={start}
                  className="w-full h-14 rounded-lg bg-gray-100 px-3 cursor-pointer"
                />
              </div>
              {electionLoading ? (
                <Button
                  type="button"
                  disabled
                  isLoading
                  className="w-full h-12 bg-emerald-700 text-white mt-14 font-semibold"
                >
                  Processing...
                </Button>
              ) : (
                <Button
                  type="button"
                  onPress={() => handleCreateElection()}
                  className="w-full h-12 bg-emerald-700 text-white mt-14 font-semibold"
                >
                  Submit
                </Button>
              )}
            </form>
          </div>

          {/* Position form */}
          <div className="w-[80%] mx-auto p-4 flex flex-col border-2 border-emerald-700 rounded-lg justify-center items-center">
            <h1 className="text-emerald-700 font-semibold mb-3">
              Election Position
            </h1>
            <form className="w-full flex flex-col gap-5" method="post">
              <Input
                label="Election Position"
                placeholder="Election Position"
                value={position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPosition(e.target.value);
                }}
              />
              <Select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setElectionId(e.target.value)
                }
                selectedKeys={[electionId]}
                className="w-full"
                label="Select Election"
              >
                {ElectionFormart.map((election) => (
                  <SelectItem key={election.key}>{election.label}</SelectItem>
                ))}
              </Select>
              {positionLoading ? (
                <Button
                  disabled
                  isLoading
                  className="w-full h-12 bg-emerald-700 text-white mt-12 font-semibold"
                >
                  Processing...
                </Button>
              ) : (
                <Button
                  onPress={() => handleCreatePosition()}
                  className="w-full h-12 bg-emerald-700 text-white mt-12 font-semibold"
                >
                  Submit
                </Button>
              )}
            </form>
          </div>
        </div>

        {/* other side  */}
        <div className="w-full">
          <div className="w-[80%] mx-auto border-2 border-emerald-700 rounded-lg p-4 flex flex-col justify-center items-center">
            <h1 className="mb-3 font-semibold text-emerald-700">
              Create Contestant
            </h1>
            <form
              onSubmit={handleSubmit(handleCreateContestant)}
              className="w-full flex flex-col gap-5 mx-auto"
            >
              <div className="flex flex-col justify-center items-center">
                <p className="text-[0.6rem] text-center">
                  Upload contestant picture
                </p>

                <label className="w-max mx-auto cursor-pointer">
                  <Image
                    src={preview}
                    alt="contestant"
                    width={100}
                    height={100}
                    priority
                    quality={95}
                    className="w-28 h-28 border-2 border-emerald-700 rounded-xl"
                  />
                  <input
                    type="file"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleImageUploader(e);
                    }}
                    accept=".jpg, .png, .jpeg"
                    hidden
                  />
                </label>
              </div>
              <Input
                className="w-full"
                label="Contestant Name"
                placeholder="Contestant Name"
                {...register("contestantname")}
                errorMessage={errors.contestantname?.message}
                isInvalid={!!errors.contestantname}
              />
              <Controller
                control={control}
                name="contestantelection"
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      onChange={onChange}
                      onSelectionChange={(e) =>
                        setContestantElectionId(e.anchorKey as string)
                      }
                      value={value}
                      className="w-full"
                      label="Select Election"
                      isInvalid={!!errors.contestantelection}
                      errorMessage={errors.contestantelection?.message}
                    >
                      {ElectionFormart.map((election) => (
                        <SelectItem key={election.key}>
                          {election.label}
                        </SelectItem>
                      ))}
                    </Select>
                  );
                }}
              />
              <Controller
                control={control}
                name="contestantposition"
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      onChange={onChange}
                      value={value}
                      onSelectionChange={(e) => {
                        setContestantPositionId(
                          e.anchorKey?.split(",,,,")[0] as string
                        );
                      }}
                      className="w-full"
                      label="Select Position"
                    >
                      {PositionFormart.map((position) => (
                        <SelectItem key={position.key}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </Select>
                  );
                }}
              />
              {contestantLoading ? (
                <Button
                  type="button"
                  disabled
                  isLoading
                  className="w-full h-12 bg-emerald-700 text-white mt-20 font-semibold"
                >
                  Processing...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-12 bg-emerald-700 text-white mt-20 font-semibold"
                >
                  Submit
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;
