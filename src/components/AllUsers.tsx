"use client";
import { DeleteUser, EditUser } from "@/app/api/Action";
import { AllDepartments, AllFaculties } from "@/category/Categories";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

type AllUsersProps = {
  allUsers: {
    name: string;
    id: string;
    image: string;
    email: string;
    matric: string;
    password: string;
    department: string;
    faculty: string;
  }[];
};
type FilterUserProps = {
  name: string;
  id: string;
  image: string;
  email: string;
  matric: string;
  password: string;
  department: string;
  faculty: string;
}[];
type EditProps = {
  name: string;
  matric: string;
  email: string;
  department: string;
  faculty: string;
};
type DeleteProps = {
  id: string;
  name: string;
  matric: string;
  email: string;
  department: string;
  faculty: string;
};
const AllUsers = ({ allUsers }: AllUsersProps) => {
  const [isOpen, setisOpen] = useState(false);
  const [filteredBy, setFilteredBy] = useState({
    name: "Matric Number",
    value: "matric",
  });
  const [filteredUser, setFilteredUser] = useState<FilterUserProps>(allUsers);
  const [hideSearch, setHideSearch] = useState(true);
  const [department, setDepartment] = React.useState<string>("");
  const [faculty, setFaculty] = React.useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState({
    visible: false,
    name: "",
    matric: "",
    email: "",
    department: "",
    faculty: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    id: "",
    name: "",
    matric: "",
    email: "",
    department: "",
    faculty: "",
  });
  const handleSearch = (searchValue: string) => {
    if (filteredBy.value === "matric") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.matric
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "name") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.name.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "department") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.department
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "faculty") {
      const result = allUsers.filter((eachUser) => {
        return eachUser.faculty
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredUser(result);
    }
    if (filteredBy.value === "") {
      setFilteredUser(allUsers);
    }
  };
  const rows = filteredUser.map((eachUser, index) => {
    const { id, name, department, faculty, email, matric } = eachUser;
    const details = {
      key: index,
      name: eachUser.name,
      matric: eachUser.matric,
      department: eachUser.department,
      faculty: eachUser.faculty,
      action: (
        <div className="flex flex-row gap-5">
          <Button
            onPress={() =>
              handleEdit({ name, matric, email, department, faculty })
            }
            className="bg-emerald-700 text-white text-medium"
          >
            Edit
          </Button>
          <Button
            onPress={() =>
              handleDelete({ id, name, matric, email, department, faculty })
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
  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "matric",
      label: "MATRIC",
    },
    {
      key: "department",
      label: "DEPARTMENT",
    },
    {
      key: "faculty",
      label: "FACULTY",
    },
    {
      key: "action",
      label: "ACTION",
    },
  ];

  const handleEdit = ({
    name,
    matric,
    email,
    department,
    faculty,
  }: EditProps) => {
    setEditModal((prevData) => {
      return {
        ...prevData,
        department,
        email,
        faculty,
        matric,
        name,
        visible: true,
      };
    });
  };
  const handleDelete = ({
    id,
    name,
    matric,
    email,
    department,
    faculty,
  }: DeleteProps) => {
    setDeleteModal((prevData) => {
      return {
        ...prevData,
        department,
        email,
        faculty,
        matric,
        name,
        id,
        visible: true,
      };
    });
  };

  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Minimum of two character" })
      .max(100, { message: "Maximum of hundred character" }),
    email: z.string().email({ message: "Invalid email address" }),
    matric: z
      .string()
      .min(6, { message: "Minimum of six character" })
      .max(24, { message: "Maximum of twenty-Four character" }),
    password: z
      .string()
      .min(4, { message: "Minimum of four character" })
      .max(30, { message: "Maximum of thirty character" }),
  });
  type formSchemaType = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const submit = async (value: formSchemaType) => {
    setLoading(true);
    try {
      const { email, matric, name, password } = value;
      if (!department || !faculty) {
        toast.error("All field are required");
        setLoading(false);
        return;
      }
      const response = await EditUser({
        name,
        email,
        matric,
        password,
        department,
        faculty,
      });
      if (response.success === true) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      reset();
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
  const DeleteThisUser = async (id: string) => {
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
    const response = await DeleteUser(id);
    if (response.success === true) {
      toast.success(response.message);
    } else {
      toast.error("error when deleting user");
    }
  };

  const handleFilteredSelected = (name: string, value: string) => {
    setFilteredBy((prevData) => {
      return {
        ...prevData,
        name,
        value,
      };
    });
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
            Edit User {editModal.matric}
          </ModalHeader>
          <ModalBody>
            <div className="h-80 overflow-y-scroll">
              <form
                onSubmit={handleSubmit(submit)}
                className="flex flex-col gap-5 my-5"
              >
                <Input
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                  {...register("name")}
                  label={"Name"}
                  type="text"
                  placeholder="Name"
                />
                <Input
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                  {...register("email")}
                  label={"Email"}
                  type="email"
                  placeholder="Email"
                />
                <Input
                  errorMessage={errors.matric?.message}
                  isInvalid={!!errors.matric}
                  {...register("matric")}
                  label={"Matric No"}
                  readOnly
                  value={editModal.matric}
                  type="text"
                  placeholder="Matric No"
                  className="cursor-none"
                />
                <Input
                  errorMessage={errors.password?.message}
                  isInvalid={!!errors.password}
                  {...register("password")}
                  label={"Password"}
                  type="password"
                  placeholder="Password"
                />
                <div>
                  <Select
                    className="w-full"
                    label="Department"
                    placeholder="Select Your Department"
                    selectedKeys={[department]}
                    variant="bordered"
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {AllDepartments.map((department) => (
                      <SelectItem key={department.key}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <p className="text-default-500 text-small">
                    Department Selected: {department}
                  </p>
                </div>

                <div>
                  <Select
                    className="w-full"
                    label="Faculty"
                    placeholder="Select Your Faculty"
                    selectedKeys={[faculty]}
                    variant="bordered"
                    onChange={(e) => setFaculty(e.target.value)}
                  >
                    {AllFaculties.map((faculty) => (
                      <SelectItem key={faculty.key}>{faculty.label}</SelectItem>
                    ))}
                  </Select>
                  <p className="text-default-500 text-small">
                    Faculty Selected: {faculty}
                  </p>
                </div>
                {loading ? (
                  <Button
                    type="button"
                    disabled={true}
                    className="bg-emerald-700/90 text-white w-full h-12 mt-12 text-lg"
                    isLoading
                  >
                    Updating...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-emerald-700 text-white w-full h-12 mt-12 text-lg"
                  >
                    Update
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
            Delete User {deleteModal.name}
          </ModalHeader>
          <ModalBody>
            <div className="text-[0.7rem] font-semibold">
              <p className="my-3">are you sure,you want to delete this user</p>
              <h1>Name : {deleteModal.name}</h1>
              <h1>Email : {deleteModal.email}</h1>
              <h1>Matric No : {deleteModal.matric}</h1>
              <h1>Department : {deleteModal.department}</h1>
              <h1>Faculty : {deleteModal.faculty}</h1>
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
              onPress={() => DeleteThisUser(deleteModal.id)}
              className="bg-red-700 rounded-md text-white "
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Filtered by option */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setisOpen(false)}
        placement={"left"}
        size="md"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">
            Filtered By
          </DrawerHeader>
          <DrawerBody>
            <RadioGroup
              label="Select method to be filtered by"
              value={filteredBy.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleFilteredSelected(e.target.id, e.target.value);
                setFilteredBy((prevData) => {
                  return {
                    ...prevData,
                    name: e.target.id,
                    value: e.target.value,
                  };
                });
              }}
            >
              <Radio id="Name" value="name">
                Name
              </Radio>
              <Radio id="Matric Number" value="matric">
                Matric
              </Radio>
              <Radio id="Department" value="department">
                Department
              </Radio>
              <Radio id="Faculty" name="Faculty" value="faculty">
                Faculty
              </Radio>
            </RadioGroup>
            <p className="text-default-500 text-small">
              Filtered by: {filteredBy.name}
            </p>
          </DrawerBody>
          <DrawerFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => {
                setisOpen(false);
                setFilteredBy((prevData) => {
                  return {
                    ...prevData,
                    name: "",
                    value: "",
                  };
                });
              }}
            >
              Close
            </Button>
            <Button color="primary" onPress={() => setisOpen(false)}>
              Done
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="flex w-full flex-row mx-auto items-center p-5">
        <div
          className={`overflow-hidden inline-flex gap-5 items-center transition-all duration-500 ${
            hideSearch ? "w-0 opacity-0" : "w-full opacity-100 mr-5"
          }`}
        >
          <FaFilter
            size={40}
            onClick={() => setisOpen(true)}
            className="text-emerald-700 cursor-pointer p-1 rounded-md border-2 border-emerald-600"
          />

          <Input
            placeholder={`Search by ${filteredBy.name}`}
            className=""
            endContent={<FaSearch />}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <FaSearch
          size={40}
          onClick={() => setHideSearch(!hideSearch)}
          className="text-emerald-700 cursor-pointer p-1 rounded-md border-2 border-emerald-600"
        />
      </div>
      <Table isStriped aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No user available"} items={rows}>
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

export default AllUsers;
