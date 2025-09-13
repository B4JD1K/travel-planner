"use client"

import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {createTrip} from "@/lib/actions/create-trip";
import {FormEvent, useState, useTransition} from "react";
import {UploadButton, UploadDropzone} from "@/lib/upload-thing";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export default function NewTrip() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleAddTrip = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (imageUrl) formData.append("imageUrl", imageUrl);

    const startDateStr = formData.get("startDate")?.toString();
    const endDateStr = formData.get("endDate")?.toString();

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      if (startDate > endDate) {
        toast.error("Start date cannot be after end date.");
        return;
      }
    }

    startTransition(async () => {
      const res = await createTrip(formData);
      if (res.success) {
        toast.success(res.message);
        router.push("/trips/" + res.data?.id); // tripId = res.data?.id
      } else {
        toast.error(res.message);
      }
    })
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>New Trip</CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleAddTrip}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Japan trip..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Trip description..."
                className={cn(
                  "w-full border border-gray-300 px-3 py-2",
                  "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {" "}
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className={cn(
                    "w-full border border-gray-300 px-3 py-2",
                    "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trip Image
              </label>
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Trip Preview"
                  className="w-full mb-4 rounded-md max-h-48 object-cover"
                  width={300}
                  height={100}
                />
              )}
              {imageUrl ? (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0].ufsUrl)
                      setImageUrl(res[0].ufsUrl);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Image upload failed.");
                    console.error("Upload error:", error);
                  }}
                  className="cursor-pointer"
                />
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res && res[0].ufsUrl)
                      setImageUrl(res[0].ufsUrl);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Image upload failed.");
                    console.error("Upload error:", error);
                  }}
                  className="cursor-pointer"
                />
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full cursor-pointer">
              {isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}