"use client";

import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatSession } from "@/utils/GeminiAiModal.jsx";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Chat() {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  const [messages, setMessages] = useState([]);

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/financial-records/getAllByUserID/${user.id}`
    );

    if (response.ok) {
      const records = await response.json();
      setPosts(records);

      console.log(posts);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(posts);
    const InputPrompt =
      `You are sam , and i am ${user?.firstName} , you have tell me about the expenses that i have done , my expenses are : ` +
      "The relevant expenses and it description with amount and category are:\n " +
      posts
        .map(
          (post) =>
            `Description : ${post.description}\n\nCategory : ${post.category}\n\n Amount : \n${post.amount}`
        )
        .join("\n\n");

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResponse = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    console.log(MockJsonResponse);

    setMessages(MockJsonResponse);
  };
  return (
    <div className="flex flex-col w-full max-w-md  mx-auto stretch">
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          <div className="whitespace-pre-wrap">Ai:{messages}</div>
        </ScrollArea>
        <div className="w-full mt-2">
          <Button
            className="w-[22rem] mb-0  border border-gray-300 rounded shadow-xl"
            type="submit"
          >
            Tell me about my expenses!
          </Button>
        </div>
      </form>
    </div>
  );
}

// import { Copy } from "lucide-react";

// export function Scrolls() {
//   return (
//     <div>
//       Jokester began sneaking into the castle in the middle of the night and
//       leaving jokes all over the place: under the king's pillow, in his soup,
//       even in the royal toilet. The king was furious, but he couldn't seem to
//       stop Jokester. And then, one day, the people of the kingdom discovered
//       that the jokes left by Jokester were so funny that they couldn't help but
//       laugh. And once they started
//     </div>
//   );
// }
