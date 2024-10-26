import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, { message: "write a message" }),
});

const ChatInput = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isRtl, setIsRtl] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { conversationId } = useConversation();
  const { mutate: createMessage, pending } = useMutationState(
    api.message.create
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleInputChange = (event: any) => {
    const { value, selectionStart } = event.target;

    const isArabic = /[\u0600-\u06FF]/.test(value);

    setIsRtl(isArabic);

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    const currentContent = form.getValues("content");
    form.setValue("content", currentContent + emojiObject.emoji);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    createMessage({
      conversationId,
      type: "text",
      content: [values.content],
    })
      .then(() => {
        form.reset();
        setIsRtl(false);
        setShowEmojiPicker(false);
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "An unexpected error occurred"
        );
      });
  };

  return (
    <Card className="p-1 rounded-full mx-auto mb-2 w-[98%] relative shadow-none border-none">
      <div className="flex gap-2 items-end w-full">
        {/* Show Emoji Picker when button is clicked */}
        {showEmojiPicker && (
          <div className="absolute z-50 bottom-14 left-2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="gap-2 w-full flex items-center"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full flex items-center  bg-blue-100 dark:bg-gray-500 rounded-full pt-1 pb-1">
                  <button
                    className=" ml-4 text-gray-500 dark:text-white"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  >
                    <Smile className="h-6 w-6" />
                  </button>
                  <FormControl
                    className="bg-blue-100 dark:bg-gray-500 -mt-4    rounded-full border-1   relative -top-1"
                    style={{
                      height: "32px !important",
                    }}
                  >
                    <TextareaAutosize
                      rows={1}
                      maxRows={3}
                      {...field}
                      onChange={handleInputChange}
                      onInput={handleInputChange}
                      dir={isRtl ? "rtl" : "ltr"}
                      style={{ textAlign: isRtl ? "right" : "left" }}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(handleSubmit)();
                        }
                      }}
                      placeholder="Message"
                      autoFocus
                      className="w-full   resize-none border-0 outline-0 text-card-foreground
                      placeholder:text-muted-foreground dark:placeholder:text-white ml-2 -mt-10  relative cursor-pointer "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              disabled={pending}
              size="icon"
              className="h-10 w-10 rounded-full mr-2 flex"
              type="submit"
            >
              <SendHorizontal className="h-5" />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
