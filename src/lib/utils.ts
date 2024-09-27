import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateForNotification = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }

  // Get the date and time components
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const formattedDate = `${day} ${month} ${year}`;
  const formattedTime = `${hour}:${minute}:${second}`;

  const notificationMessage = `Your post will be posted on ${formattedDate} at ${formattedTime}.`;

  return notificationMessage;
};
