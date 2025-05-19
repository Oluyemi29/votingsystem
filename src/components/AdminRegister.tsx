"use client";
import { Button, Input } from "@heroui/react";
import Image from "next/image";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminRegistering } from "@/app/api/Action";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { HiMiniEyeSlash } from "react-icons/hi2";

const AdminRegister = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Minimum of two character" })
      .max(100, { message: "Maximum of hundred character" }),
    email: z.string().email({ message: "Invalid email address" }),
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
      const { email, name, password } = value;
      const success = await AdminRegistering({ email, name, password });
      if (success.success === true) {
        toast.success(success.message);
      } else {
        toast.error(success.message);
      }
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full my-10 flex h-screen flex-col justify-center items-center">
      <div className="md:w-2/6 border-2 border-emerald-700 rounded-lg p-5 py-5">
        <Image
          src={"/ayede-logo2.png"}
          alt="Ayede"
          width={50}
          height={50}
          className="mx-auto"
        />
        <h1 className="text-center font-semibold text-emerald-700">
          Admin Register
        </h1>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-5 mt-5"
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
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            {...register("password")}
            label={"Password"}
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            endContent={
              <div className="cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <HiMiniEyeSlash /> : <IoEyeSharp />}
              </div>
            }
          />
          {loading ? (
            <Button
              type="button"
              disabled={true}
              className="bg-emerald-700/90 text-white w-full h-12 mt-12 text-lg"
              isLoading
            >
              Processing...
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-emerald-700 text-white w-full h-12 mt-12 text-lg"
            >
              Register
            </Button>
          )}
        </form>
      </div>
      <h1 className="text-emerald-700 text-end text-[0.7rem] mt-2">
        Dont have an account?{" "}
        <Link
          className="font-semibold underline underline-offset-2 italic"
          href={"/admin/login"}
        >
          Login
        </Link>
      </h1>
    </div>
  );
};

export default AdminRegister;
