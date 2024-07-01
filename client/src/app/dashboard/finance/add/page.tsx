"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const AddBlog = () => {
  const router = useRouter();
  const amountRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const CategoryRef = useRef<HTMLInputElement | null>(null);
  const paymentRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUser();

  const postBlog = async ({
    userId,
    date,
    description,
    amount,
    category,
    paymentMethod,
  }: {
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
  }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            date,
            description,
            amount,
            category,
            paymentMethod,
          }),
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error("Failed to post blog:", error);
      return null;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      amountRef.current?.value &&
      descriptionRef.current?.value &&
      CategoryRef.current?.value &&
      paymentRef.current?.value &&
      dateRef.current?.value
    ) {
      toast.loading("Sending Request 🚀", { id: "1" });
      await postBlog({
        amount: parseFloat(amountRef.current?.value || "0"),
        description: descriptionRef.current?.value,
        category: CategoryRef.current?.value,
        paymentMethod: paymentRef.current?.value,
        date: new Date(dateRef.current?.value || ""),
        userId: user?.id || "",
      });

      toast.success("Request Sent 🚀", { id: "1" });
      router.push("/dashboard");
    }
  };
  return (
    <Fragment>
      <div className="w-full m-auto flex my-4 p-2">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 text-slate-800 dark:text-slate-200 font-bold p-3">
            Add Expenses 💵🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={descriptionRef}
              placeholder="Enter Description"
              type="text"
              className="bg-slate-200 dark:bg-slate-800 rounded-md px-4 w-full py-2 my-2 "
            />
            <input
              ref={amountRef}
              placeholder="Enter Amount"
              className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 w-full my-2"
            />
            <input
              ref={CategoryRef}
              placeholder="Enter Category"
              className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 w-full my-2"
            />
            <input
              ref={paymentRef}
              placeholder="Enter Payment method"
              className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 w-full my-2"
            />
            <input
              ref={dateRef}
              type="date"
              placeholder="Enter Date"
              className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 w-full my-2"
            />
            <Button className="font-semibold px-4 py-2 shadow-xl  rounded-lg m-auto ">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AddBlog;
