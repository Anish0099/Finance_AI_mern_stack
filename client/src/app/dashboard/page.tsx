"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chat from "./chat/page";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useUser();
  const router = useRouter();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setPosts(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  useEffect(() => {
    const total = posts.reduce((acc, post) => acc + post.amount, 0);
    setTotalAmount(total);
  }, [posts]);

  return (
    <main className="w-full h-full p-1">
      <div className="md:w-2/4  sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-slate-800 drop-shadow-xl">
        <h1 className="text-slate-200 text-center text-2xl font-extrabold font-[verdana]">
          My FULL STACK Finance tracker App With Next.js
        </h1>
      </div>
      {/* Link */}
      <div className="w-full flex  flex-col justify-center items-center">
        <div className=" w-3/4 p-4 rounded-md mx-3 my-2    flex justify-center  items-center gap-2">
          <div>
            <Link
              href={"dashboard/finance/add"}
              className=" md:w-1/6 sm:w-2/4 text-center flex justify-center items-center gap-2 rounded-md p-2 m-auto  font-semibold"
            >
              <Button>Add new Expense</Button>
              <UserButton />
            </Link>
          </div>

          <div className="flex justify-center items-center gap-2 text-slate-200 font-semibold">
            <ModeToggle />
            <Dialog>
              <DialogTrigger asChild>
                <Button>Ai Bot</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Ai ChatBot</DialogTitle>
                  <DialogDescription>
                    Hello i am Sam, i will tell you about your expenses!.
                  </DialogDescription>
                </DialogHeader>

                <Chat />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="w-[full flex  justify-center flex-col items-center p-10">
        <div className="w-full flex justify-start items-start mb-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${parseFloat(totalAmount).toFixed(2).toString()}{" "}
              </div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Expenses</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post: any) => (
              <TableRow
                key={post._id}
                onClick={() =>
                  router.push(`/dashboard/finance/edit/${post._id}`)
                }
                className=" cursor-pointer"
              >
                <TableCell className="font-medium">
                  {post.description}
                </TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>{post.paymentMethod}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell className="text-right">{post.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="w-full">
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">${totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </main>
  );
}
