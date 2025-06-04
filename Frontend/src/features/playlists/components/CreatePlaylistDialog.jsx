import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlaylistSchema } from "../schemas/playlist.schema.js";
import { createPlaylist as createPlaylistService } from "../../../services/playlistService";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

function CreatePlaylistDialog({ onPlaylistCreated }) {
  // onPlaylistCreated is an optional callback
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  //handler funtion to submit form
  const onSubmit = async (data) => {
    try {
      const newPlaylist = await createPlaylistService(data);
      toast.success("Playlist Created!", {
        description: `Playlist "${newPlaylist.name}" was successfully created.`,
      });
      reset(); // Reset form fields
      setIsOpen(false); // Close the dialog
      if (onPlaylistCreated) {
        onPlaylistCreated(newPlaylist); // Callback if parent needs to know
      }
    } catch (error) {
      toast.error("Failed to Create Playlist", {
        description: error?.message || "An unknown error occurred.",
      });
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* This button will open the dialog. You can place it where needed. */}
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Give your new playlist a name and an optional description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          {" "}
          {/* Spread form methods into Shadcn/UI Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Dynamic Programming Favorites"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the title of your playlist.
                  </FormDescription>
                  <FormMessage />{" "}
                  {/* Displays Zod validation error for this field */}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what this playlist is about..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Playlist"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlaylistDialog;
