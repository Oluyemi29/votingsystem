"use client";
import { DeleteContestant, EditContestant } from "@/app/api/Action";
import {
  Button,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
type AllContestantProps = {
  allContestant: {
    name: string;
    id: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    position: string;
    vote: number;
    positionId: string;
    electionId: string;
    Election: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
    };
    Position: {
      name: string;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      electionId: string;
    };
  }[];
  allPosition: {
    Election: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      description: string;
      startTime: Date;
      endTime: Date;
    };
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    electionId: string;
  }[];
  allElection: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
  }[];
};
type EditProps = {
  id: string;
  name: string;
  image: string;
  positionName: string;
  positionId: string;
  electionStart: string;
  electionEnd: string;
  vote: number;
  electionId: string;
  electionName: string;
};
type DeleteProps = {
  id: string;
  name: string;
  positionName: string;
  electionStart: string;
  electionEnd: string;
  vote: number;
  electionName: string;
};
const AllContestant = ({
  allPosition,
  allElection,
  allContestant,
}: AllContestantProps) => {
  const [loading, setLoading] = useState(false);
  const [contestantElectionId, setContestantElectionId] = useState("");
  const [contestantPositionId, setContestantPositionId] = useState("");
  const [editModal, setEditModal] = useState({
    visible: false,
    id: "",
    name: "",
    image: "",
    positionName: "",
    positionId: "",
    electionStart: "",
    electionEnd: "",
    vote: 0,
    electionId: "",
    electionName: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: "",
    name: "",
    positionName: "",
    electionStart: "",
    electionEnd: "",
    vote: 0,
    electionName: "",
  });
  const [preview, setPreview] = useState(
    editModal.image ??
      "https://i.pinimg.com/736x/ec/24/1b/ec241b8218d6fa02be5e76dea9d0e3ce.jpg"
  );
  const [imageFile, setImageFile] = useState<Blob | null>(null);
  const rows = allContestant.map((eachContestant, index) => {
    const { Election, name, id, image, Position, vote } = eachContestant;
    const details = {
      key: index,
      image: (
        <div>
          <Image
            src={image}
            alt="contestant"
            width={50}
            height={50}
            className="w-10 h-10 rounded-full"
          />
        </div>
      ),
      name: name,
      title: Election.title,
      position: Position.name,
      startTime: new Date(Election.startTime).toLocaleString(),
      endTime: new Date(Election.endTime).toLocaleString(),
      action: (
        <div className="flex flex-row gap-5">
          <Button
            onPress={() =>
              handleEdit({
                electionEnd: Election.startTime.toLocaleString(),
                electionId: Election.id,
                electionName: Election.title,
                electionStart: Election.startTime.toLocaleString(),
                id,
                image,
                name,
                positionId: Position.id,
                positionName: Position.name,
                vote,
              })
            }
            className="bg-emerald-700 text-white text-medium"
          >
            Edit
          </Button>
          <Button
            onPress={() =>
              handleDelete({
                id,
                name,
                electionName: Election.title,
                electionStart: Election.startTime.toLocaleString(),
                electionEnd: Election.endTime.toLocaleString(),
                positionName: Position.name,
                vote,
              })
            }
            className="bg-red-700 text-white text-medium"
          >
            Delete
          </Button>
        </div>
      ),
    };
    return details;
  });

  const ElectionFormart = allElection.map((eachElection) => {
    const details = {
      key: eachElection.id,
      label: eachElection.title,
    };
    return details;
  });

  const PositionFormat = allPosition
    .filter((eachPosition) => {
      return eachPosition.electionId === contestantElectionId;
    })
    .map((PositionInfo) => {
      return {
        key: `${PositionInfo.id},,,,${PositionInfo.name}`,
        label: PositionInfo.name,
      };
    });

  const columns = [
    {
      key: "image",
      label: "CONTESTANT IMAGE",
    },
    {
      key: "name",
      label: "CONTESTANT NAME",
    },
    {
      key: "position",
      label: "POSITION NAME",
    },
    {
      key: "title",
      label: "ELECTION TITLE",
    },
    {
      key: "startTime",
      label: "START TIME",
    },
    {
      key: "endTime",
      label: "END TIME",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const handleEdit = ({
    id,
    name,
    image,
    vote,
    electionEnd,
    electionId,
    electionName,
    electionStart,
    positionId,
    positionName,
  }: EditProps) => {
    setEditModal((prevData) => {
      return {
        ...prevData,
        name,
        id,
        vote,
        electionEnd,
        visible: true,
        electionId,
        electionName,
        electionStart,
        image,
        positionId,
        positionName,
      };
    });
  };

  const handleDelete = ({
    id,
    name,
    vote,
    positionName,
    electionName,
    electionStart,
    electionEnd,
  }: DeleteProps) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        name,
        electionName,
        electionStart,
        electionEnd,
        positionName,
        id,
        vote,
        visible: true,
      };
    });
  };

  const DeleteThisContestant = async (id: string) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        visible: false,
      };
    });
    if (!id) {
      toast.error("All field are required");
      return;
    }
    const response = await DeleteContestant(id);
    if (response.success === true) {
      toast.success(response.message);
    } else {
      toast.error("error when deleting user");
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
  const handleEditContestant = async (value: formSchemaType) => {
    setLoading(true);
    try {
      const contestantimage = await GetImageLink();
      const id = editModal.id;
      const { contestantelection, contestantname, contestantposition } = value;
      if (!contestantimage && !editModal.image) {
        toast.error("All field are required");
        return;
      }
      const contestantPositionName = contestantposition
        .split(",,,,")
        .pop() as string;
      const response = await EditContestant({
        id,
        electionId: contestantelection,
        positionId: contestantPositionId,
        image: contestantimage ?? editModal.image,
        name: contestantname,
        position: contestantPositionName,
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
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Edit Modal */}
      <Modal
        isOpen={editModal.visible}
        onClose={() =>
          setEditModal((prevData) => {
            return {
              ...prevData,
              visible: false,
            };
          })
        }
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Edit Position {editModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="h-80 overflow-y-scroll">
              <h1 className="mb-3 font-semibold text-emerald-700">
                Create Contestant
              </h1>
              <form
                onSubmit={handleSubmit(handleEditContestant)}
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
                        {PositionFormat.map((position) => (
                          <SelectItem key={position.key}>
                            {position.label}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  }}
                />
                {loading ? (
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
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Delete Modal */}
      <Modal
        size="sm"
        isOpen={deleteModal.visible}
        onClose={() =>
          setDeleteModal((prevData) => {
            return {
              ...prevData,
              visible: false,
            };
          })
        }
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Delete Contestant {deleteModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="text-[0.7rem] font-semibold">
              <p className="my-3">
                are you sure,you want to delete this Contestant
              </p>
              <h1>Name : {deleteModal.name}</h1>
              <h1>Election : {deleteModal.electionName}</h1>
              <h1>Position : {deleteModal.positionName}</h1>
              <h1>Start On : {deleteModal.electionStart}</h1>
              <h1>End On : {deleteModal.electionEnd}</h1>
              <h1>Voye : {deleteModal.vote}</h1>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() =>
                setDeleteModal((prevData) => {
                  return {
                    ...prevData,
                    visible: false,
                  };
                })
              }
              className="bg-transparent border-2 border-red rounded-md text-red-700"
            >
              Cancel
            </Button>
            <Button
              onPress={() => DeleteThisContestant(deleteModal.id)}
              className="bg-red-700 rounded-md text-white "
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Table isStriped aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No Contestant available"} items={rows}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllContestant;
