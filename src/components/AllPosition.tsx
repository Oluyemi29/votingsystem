"use client";
import { DeletePosition, EditPosition } from "@/app/api/Action";
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
import React, { useState } from "react";
import toast from "react-hot-toast";
type AllPositionProps = {
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
  name: string;
  electionId: string;
  electionTitle: string;
  electionStart: string;
  electionEnd: string;
  id: string;
};
type DeleteProps = {
  id: string;
  name: string;
  electionTitle: string;
  electionStart: string;
  electionEnd: string;
};
const AllPosition = ({ allPosition, allElection }: AllPositionProps) => {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");
  const [electionId, setElectionId] = useState("");
  const [editModal, setEditModal] = useState({
    visible: false,
    id: "",
    name: "",
    electionTitle: "",
    electionStart: "",
    electionEnd: "",
    electionId: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: "",
    name: "",
    electionTitle: "",
    electionStart: "",
    electionEnd: "",
  });
  const rows = allPosition.map((eachPosition, index) => {
    const { Election, name, id } = eachPosition;
    const details = {
      key: index,
      name: name,
      title: Election.title,
      startTime: new Date(Election.startTime).toLocaleString(),
      endTime: new Date(Election.endTime).toLocaleString(),
      action: (
        <div className="flex flex-row gap-5">
          <Button
            onPress={() =>
              handleEdit({
                id,
                name,
                electionId: Election.id,
                electionTitle: Election.title,
                electionStart: Election.startTime.toLocaleString(),
                electionEnd: Election.endTime.toLocaleString(),
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
                electionTitle: Election.title,
                electionStart: Election.startTime.toLocaleString(),
                electionEnd: Election.endTime.toLocaleString(),
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
  const columns = [
    {
      key: "name",
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
    electionTitle,
    electionStart,
    electionEnd,
    electionId,
  }: EditProps) => {
    setEditModal((prevData) => {
      return {
        ...prevData,
        name,
        id,
        electionTitle,
        electionStart,
        electionEnd,
        electionId,
        visible: true,
      };
    });
  };
  const handleDelete = ({
    id,
    name,
    electionTitle,
    electionStart,
    electionEnd,
  }: DeleteProps) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        name,
        electionTitle,
        electionStart,
        electionEnd,
        id,
        visible: true,
      };
    });
  };

  const handleEditElection = async () => {
    setLoading(true);
    try {
      const { id } = editModal;
      if (!id || !electionId || !position) {
        toast.error("All field are required");
        setLoading(false);
        return;
      }
      const response = await EditPosition({
        id,
        name: position,
        electionId,
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
  const DeleteThisPosition = async (id: string) => {
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
    const response = await DeletePosition(id);
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
            Edit Position {editModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="h-80 overflow-y-scroll">
              <h1 className="text-emerald-700 font-semibold mb-3">
                Edit Position
              </h1>
              <form className="w-full flex flex-col gap-5" method="post">
                <Input
                  label="Election Position"
                  placeholder="Election Position"
                  defaultValue={editModal.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPosition(e.target.value);
                  }}
                />
                <Select
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setElectionId(e.target.value)
                  }
                  defaultSelectedKeys={[editModal.electionId]}
                  className="w-full"
                  label="Select Election"
                >
                  {ElectionFormart.map((election) => (
                    <SelectItem key={election.key}>{election.label}</SelectItem>
                  ))}
                </Select>
                {loading ? (
                  <Button
                    disabled
                    isLoading
                    className="w-full h-12 bg-emerald-700 text-white mt-12 font-semibold"
                  >
                    Processing...
                  </Button>
                ) : (
                  <Button
                    onPress={() => handleEditElection()}
                    className="w-full h-12 bg-emerald-700 text-white mt-12 font-semibold"
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
            Delete Position {deleteModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="text-[0.7rem] font-semibold">
              <p className="my-3">
                are you sure,you want to delete this position
              </p>
              <h1>Name : {deleteModal.name}</h1>
              <h1>Election : {deleteModal.electionTitle}</h1>
              <h1>Start On : {deleteModal.electionStart}</h1>
              <h1>End On : {deleteModal.electionEnd}</h1>
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
              onPress={() => DeleteThisPosition(deleteModal.id)}
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
        <TableBody emptyContent={"No position available"} items={rows}>
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

export default AllPosition;
