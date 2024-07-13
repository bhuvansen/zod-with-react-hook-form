"use client"
import Link from "next/link"
import React, { useState } from "react"
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"
import { Controller, useForm } from "react-hook-form"
import type { FieldValues } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const dateRegex = /^(\d{2})\/(\d{2})\/\d{4}$/;

const isValidDate = (date: string) => {
    const [month, day, year] = date.split("/").map(Number);

    if (month < 1 || month > 12) return false;

    if (day < 1 || day > 31) return false;

    if ([4, 6, 9, 11].includes(month) && day > 30) return false;

    if (month === 2) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        if (!isLeapYear && day > 28) return false;
        if (isLeapYear && day > 29) return false;
    }

    return true;
};
const isValidMonth = (date: string) => {
    const [month, day, year] = date.split("/").map(Number);

    if (month < 1 || month > 12) return false;


    return true;
};

const isNotFutureDate = (date: string) => {
    const now = new Date();
    const inputDate = new Date(date);
    return inputDate <= now;
};

const schema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(1, { message: "Username is required" }),
    dob: z
        .string()
        .min(1, { message: "DOB is required" })
        .regex(dateRegex, { message: "Invalid date format, use MM/DD/YYYY" })
        .refine((val) => isValidMonth(val), { message: "Invalid month for the year" })
        .refine((val) => isValidDate(val), { message: "Invalid date for the month" })
        .refine((val) => isNotFutureDate(val), { message: "No future dates allowed" })
        .refine((val) => new Date(val).getFullYear() >= 1900, { message: "No past centuries allowed" }),
    password: z.string().min(1, { message: "Password is required" }),
});

type SignUpSchema = z.infer<typeof schema>;

const DateInput = ({ control, name, error }: any) => {
    const [value, setValue] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: any) => {
        let input = e.target.value
        
        const rawValue = input.replace(/\D/g, "");

        if (value.length > input.length && value.endsWith('/')) {
            input = input.slice(0, -1);
        } else {
            if(rawValue.length<=2) input = `${rawValue.slice(0, 2)}${rawValue.length==2 ? "/":""}`
            else if(rawValue.length <= 4)input = `${rawValue.slice(0, 2)}/${rawValue.slice(2,4)}${rawValue.length==4 ? "/":""}`
            else input = `${rawValue.slice(0, 2)}/${rawValue.slice(2,4)}/${rawValue.slice(4)}`
        }
        setValue(input);
        onChange(input);
    };
  

    return (
        <div>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, ...field } }) => (
                    <input
                        {...field}
                        value={value}
                        onChange={(e) => handleChange(e, onChange)}
                        className="w-full p-2 border border-gray-700 rounded mb-4 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="MM/DD/YYYY"
                    />
                )}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error.message}</p>}
        </div>
    );
};

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
    } = useForm<SignUpSchema>({ resolver: zodResolver(schema), mode:  "onChange"  });

    const [modalOpen, setModalOpen] = useState(false);

    const onSubmit = (data: SignUpSchema) => {
        console.log(data);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-white">Signup</h2>

                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        {...register("email")}
                        className="w-full p-2 border border-gray-700 rounded mb-4 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
                        type="email"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}

                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        {...register("username")}
                        className="w-full p-2 border border-gray-700 rounded mb-4 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
                        type="text"
                    />
                    {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}

                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="dob">
                        Date of Birth
                    </label>
                    {/* <DateInput register={register} name="dob" error={errors.dob} /> */}
                    <DateInput control={control} name="dob" error={errors.dob} />

                    <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                        Password
                    </label>
                    <div className="relative w-full">
                        <input
                            {...register("password")}
                            className="w-full p-2 border border-gray-700 rounded mb-6 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
                            type={showPassword ? "text" : "password"}
                        />
                        <div className="absolute top-3 right-0 flex items-center pr-3">
                            {showPassword ? (
                                <FaEyeSlash
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(false)}
                                />
                            ) : (
                                <FaEye className="text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                            )}
                        </div>
                    </div>
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}

                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center justify-center"
                        type="submit"
                    >
                        Sign Up
                    </button>
                    <div className="mt-4 text-center">
                        <Link href="/login">Already have an account? Login</Link>
                    </div>
                </div>
            </div>
        </form>
        {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-900  p-4 rounded-lg shadow-lg w-80 relative">
                    <button
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >
                        <FaTimes />
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Signup Done</h2>
                    <button
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none"
                        onClick={closeModal}
                    >
                        OK
                    </button>
                </div>
            </div>
        )}
        </div>
    )
}
