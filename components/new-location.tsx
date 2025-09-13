"use client"

import {Button} from "@/components/ui/button";
import {FormEvent, useTransition} from "react";
import {addLocation} from "@/lib/actions/add-location";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function NewLocationClient({tripId}: { tripId: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddLocation = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await addLocation(formData, tripId);

      if (res.success) {
        toast.success(res.message);
        router.push(`/trips/${tripId}`);
      } else {
        toast.error(res.message)
      }
    });
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-3xl font-bold text-center mb-6">
            Add New Location
          </h1>
          <form className="space-y-6" onSubmit={handleAddLocation}>
            <div>
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <label className="text-xs italic text-gray-400">
                  Specify as much details as you can
                </label>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Location To Trip"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}