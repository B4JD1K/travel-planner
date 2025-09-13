"use client";

import { Toaster } from "sonner";

export default function ToastClient() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={3500}
    />
  );
}