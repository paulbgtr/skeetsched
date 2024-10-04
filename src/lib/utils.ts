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

export const convertBase64ToBlob = async (
  base64Image: string,
  maxWidth = 1000,
  maxHeight = 1000,
  mimeType = "image/webp",
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Resize image to fit within the max width/height
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.floor((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.floor((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Set canvas dimensions and draw image on canvas
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert canvas to Blob
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        mimeType,
        quality
      );
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};
