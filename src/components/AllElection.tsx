"use client";
import { DeleteElection, EditElection } from "@/app/api/Action";
import {
  Button,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
type AllElectionProps = {
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
  title: string;
  description: string;
  id: string;
};
type DeleteProps = {
  id: string;
  title: string;
  description: string;
};
const AllElection = ({ allElection }: AllElectionProps) => {
  const [loading, setLoading] = useState(false);
  const [election, setElection] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const now = new Date().toISOString().slice(0, 16);
  const [editModal, setEditModal] = useState({
    visible: false,
    id: "",
    title: "",
    description: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: "",
    title: "",
    description: "",
  });
  const rows = allElection.map((eachElection, index) => {
    const { id, description, endTime, startTime, title } = eachElection;
    const details = {
      key: index,
      title: title,
      description: description,
      startTime: new Date(startTime).toLocaleString(),
      endTime: new Date(endTime).toLocaleString(),
      action: (
        <div className="flex flex-row gap-5">
          <Button
            onPress={() => handleEdit({ title, description, id })}
            className="bg-emerald-700 text-white text-medium"
          >
            Edit
          </Button>
          <Button
            onPress={() => handleDelete({ id, title, description })}
            className="bg-red-700 text-white text-medium"
          >
            Delete
          </Button>
        </div>
      ),
    };
    return details;
  });
  const columns = [
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "description",
      label: "DESCRIPTION",
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

  const handleEdit = ({ title, id, description }: EditProps) => {
    setEditModal((prevData) => {
      return {
        ...prevData,
        title,
        id,
        description,
        visible: true,
      };
    });
  };
  const handleDelete = ({ id, title, description }: DeleteProps) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        title,
        description,
        id,
        visible: true,
      };
    });
  };

  const handleEditElection = async () => {
    setLoading(true);
    try {
      const startTime = new Date(start);
      const endTime = new Date(end);
      if (
        !startTime ||
        !endTime ||
        !election ||
        !description ||
        !editModal.id
      ) {
        toast.error("All field are required");
        setLoading(false);
        return;
      }
      const response = await EditElection({
        title: election,
        description,
        startTime,
        endTime,
        id: editModal.id,
      });
      if (response.success === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      setEditModal((prevData) => {
        return {
          ...prevData,
          visible: false,
        };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const DeleteThisElection = async (id: string) => {
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
    const response = await DeleteElection(id);
    if (response.success === true) {
      toast.success(response.message);
    } else {
      toast.error("error when deleting user");
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
            Edit Election {editModal.title}
          </ModalHeader>
          <ModalBody>
            <div className="h-80 overflow-y-scroll">
              <h1 className="text-emerald-700 font-semibold mb-3">
                Edit Election
              </h1>
              <form method="post" className="w-full  flex flex-col gap-5">
                <Input
                  className="w-full"
                  label="Create Election"
                  placeholder="Create Election"
                  defaultValue={editModal.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setElection(e.target.value);
                  }}
                />
                <Input
                  className="w-full"
                  label="Election Description"
                  placeholder="Election Description"
                  defaultValue={editModal.description}
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
                {loading ? (
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
                    onPress={() => handleEditElection()}
                    className="w-full h-12 bg-emerald-700 text-white mt-14 font-semibold"
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
            Delete Election {deleteModal.title}
          </ModalHeader>
          <ModalBody>
            <div className="text-[0.7rem] font-semibold">
              <p className="my-3">are you sure,you want to delete this user</p>
              <h1>Title : {deleteModal.title}</h1>
              <h1>Description : {deleteModal.description}</h1>
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
              onPress={() => DeleteThisElection(deleteModal.id)}
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
        <TableBody emptyContent={"No election available"} items={rows}>
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

export default AllElection;
