// src/utils/toast.ts
import { toast } from "react-toastify";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    className: "bg-green-600 text-white", // Tailwind classes
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    className: "bg-red-600 text-white", // Tailwind classes
  });
};
