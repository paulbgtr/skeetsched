"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/loading-spinner";

const FormSchema = z.object({
  postDate: z.date({
    required_error: "A date of post is required.",
  }),
  postTime: z.string(),
});

export const SchedulePost = ({
  isDisabled,
  isPendingSchedulePost,
  handleSchedulePost,
}: {
  isDisabled: boolean;
  isPendingSchedulePost: boolean;
  handleSchedulePost: () => void;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    // handleSchedulePost();
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          disabled={isDisabled}
          className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2 className="font-bold text-xl mb-3">Schedule</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="postDate"
                render={({ field }) => (
                  <>
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <Button
                type="submit"
                disabled={isDisabled || isPendingSchedulePost}
                className="bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPendingSchedulePost ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    <span>Posting...</span>
                  </>
                ) : (
                  "Schedule"
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
