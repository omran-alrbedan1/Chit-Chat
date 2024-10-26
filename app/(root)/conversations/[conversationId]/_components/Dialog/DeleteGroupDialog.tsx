"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { ConvexError } from "convex/values";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  conversationId: Id<"conversations">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DeleteGroupDialog = ({ open, setOpen, conversationId }: Props) => {
  const { mutate: deleteGroup, pending } = useMutationState(
    api.conversation.deleteGroup
  );

  const handleDeleteGroup = async () => {
    deleteGroup({
      conversationId,
    })
      .then(() => {
        toast.success("group deleted");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError
            ? error.data
            : "unexpected error occurred"
        );
      });
  };

  return (
    <div className="sm:max-w-[50%]">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure ?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone all messages will be deleted and you
              will not be able to message this group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending}  onClick={handleDeleteGroup}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteGroupDialog;
