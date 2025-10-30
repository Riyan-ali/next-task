"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";

// Helper to get current date/time in YYYY-MM-DD and HH:mm format
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

export function TaskForm({ initialTask, onSubmit, isLoading }) {
  const { date: today, time: now } = getCurrentDateTime();
  const [selectedDate, setSelectedDate] = useState(
    initialTask?.dueDate || undefined
  );

  // Dynamic schema — only validates when form is submitted or field is interacted with
  const taskSchema = z
    .object({
      title: z.string().min(1, "Title is required").max(100, "Title too long"),
      description: z.string().max(500, "Description too long").optional(),
      dueDate: z.string().min(1, "Due date is required"),
      dueTime: z.string().min(1, "Due time is required"),
      priority: z.enum(["Low", "Medium", "High"]),
      status: z.enum(["Pending", "In-Progress", "Completed"]),
    })
    .refine(
      (data) => {
        if (!selectedDate) return true;
        if (selectedDate > today) return true;
        if (selectedDate < today) return false;
        return data.dueTime >= now;
      },
      {
        message: "Due time cannot be in the past for today",
        path: ["dueTime"],
      }
    );

  const form = useForm({
    resolver: zodResolver(taskSchema),
    mode: "onTouched", // Only validate on blur/change, not on mount
    defaultValues: initialTask || {
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "Medium",
      status: "Pending",
    },
  });

  // Watch dueDate to update selectedDate
  const watchedDueDate = form.watch("dueDate");

  useEffect(() => {
    setSelectedDate(watchedDueDate || undefined);
  }, [watchedDueDate]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter task description (optional)"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Due Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={today}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedDate(e.target.value || undefined);
                    }}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueTime"
            render={({ field }) => {
              const minTime = selectedDate === today ? now : "00:00";

              return (
                <FormItem>
                  <FormLabel>Due Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      min={minTime}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#598392] text-white hover:bg-[#124559] hover:text-white"
        >
          {isLoading ? "Saving..." : "Save Task"}
        </Button>
      </form>
    </Form>
  );
}
