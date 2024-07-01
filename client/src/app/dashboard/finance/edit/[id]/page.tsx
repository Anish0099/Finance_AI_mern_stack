"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
type UpdateBlogParams = {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
};

const EditBlog = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const amountRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLInputElement | null>(null);
  const CategoryRef = useRef<HTMLInputElement | null>(null);
  const paymentRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const { user } = useUser();

  useEffect(() => {
    toast.loading("Fetching Blog Details 🚀", { id: "1" });
    console.log(params.id);
    const id = params.id;
    getBlogById(id)
      .then((data) => {
        console.log(data);
        // Assuming data.post is an array and we're interested in the first item
        const blogPost = data;
        if (blogPost) {
          console.log(blogPost);
          // Update the form fields with the fetched data
          if (amountRef.current) amountRef.current.value = blogPost.amount; // Assuming the correct property is `amount`
          if (CategoryRef.current)
            CategoryRef.current.value = blogPost.category;
          if (paymentRef.current)
            paymentRef.current.value = blogPost.paymentMethod;
          if (dateRef.current) dateRef.current.value = blogPost.date;
          if (descriptionRef.current)
            descriptionRef.current.value = blogPost.description;
          toast.success("Fetching Complete", { id: "1" });
        } else {
          // Handle case where blogPost is undefined or data structure is not as expected
          toast.error("Blog post not found or data structure is incorrect");
        }
      })
      .catch((err) => {
        console.error(err); // Log the actual error
        toast.error("Error fetching blog");
      });
  }, []); // Include params.id in the dependency array if it's expected to change

  const updateBlog = async (data: UpdateBlogParams, paramsId: string) => {
    try {
      console.log(data);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            amount: data.amount,
            description: data.description,
            date: data.date,
            category: data.category,
            paymentMethod: data.paymentMethod,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update blog post:", error);
      throw error; // Rethrow or handle as needed
    }
  };

  const deleteBlog = async (id: string) => {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records/${id}`,
      {
        method: "DELETE",
        //@ts-ignore
        "Content-Type": "application/json",
      }
    );
    return (await res).json();
  };

  const getBlogById = async (id: string) => {
    try {
      console.log(`Fetching blog with ID: ${id}`);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records/${id}`
      );
      if (!res.ok) {
        console.error(
          `Failed to fetch blog with ID: ${id}. Status: ${res.status}`
        );
        return;
      }
      const data = await res.json();
      console.log("Blog data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching blog:", error);
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
      await updateBlog(
        {
          amount: parseFloat(amountRef.current?.value || "0"),
          description: descriptionRef.current?.value,
          category: CategoryRef.current?.value,
          paymentMethod: paymentRef.current?.value,
          date: new Date(dateRef.current?.value || ""),
          userId: user?.id || "",
        },
        params.id
      ).catch((err) => {
        console.log(err);
      });
      toast.success("Blog Posted Successfully", { id: "1" });
      router.push("/dashboard");
    }
  };
  const handleDelete = async () => {
    toast.loading("Deleting Blog", { id: "2" });
    await deleteBlog(params.id);
    toast.success("Blog Deleted", { id: "2" });
    router.push("/dashboard");
  };
  return (
    <div className="w-full m-auto flex my-4 p-2">
      <Toaster />
      <div className="flex flex-col justify-center items-center m-auto">
        <p className="text-2xl dark:text-slate-200 font-bold p-3">
          Edit A Wonderful Blog 🚀
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={descriptionRef}
            placeholder="Enter description"
            type="text"
            className="rounded-md  bg-slate-200 dark:bg-slate-800 px-4 w-full py-2 my-2 "
          />
          <input
            ref={amountRef}
            placeholder="Enter amount"
            className="bg-slate-200 dark:bg-slate-800  rounded-md px-4 py-2 w-full my-2"
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
          <div className="flex justify-center items-center">
            <Button
              type="submit"
              className="font-semibold px-4 py-2 shadow-xl  rounded-lg m-auto "
            >
              Update
            </Button>
            <Button
              variant={"destructive"}
              onClick={handleDelete}
              className="font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg  m-auto mt-2 hover:bg-red-500"
            >
              Delete
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
