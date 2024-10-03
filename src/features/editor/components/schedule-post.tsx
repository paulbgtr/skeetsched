"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
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
  DialogClose,
} from "@/components/ui/dialog";
import LoadingSpinner from "@/components/loading-spinner";

const FormSchema = z.object({
  postDate: z.date({
    required_error: "A date of post is required.",
  }),
  postTime: z.string({
    required_error: "A time of post is required.",
  }),
});

export const SchedulePost = ({
  isDisabled,
  isPendingSchedulePost,
  handleSchedulePost,
}: {
  isDisabled: boolean;
  isPendingSchedulePost: boolean;
  handleSchedulePost: (postAt: Date) => void;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const date = new Date(data.postDate);
    const [hours, minutes] = data.postTime.split(":").map(Number);

    date.setHours(hours, minutes, 0, 0);

    const utcDate = new Date(date.toUTCString());

    handleSchedulePost(utcDate);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} variant="warning">
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2 className="mb-3 text-xl font-bold">Schedule</h2>
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
                              <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="postTime"
                render={({ field }) => (
                  <>
                    <FormItem className="flex flex-col">
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="w-[8rem]"
                          type="time"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <DialogClose asChild>
                <Button
                  type="submit"
                  disabled={isDisabled || isPendingSchedulePost}
                  variant="warning"
                >
                  {isPendingSchedulePost ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    "Schedule"
                  )}
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
