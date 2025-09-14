"use server"

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {Result} from "@/lib/types";

export async function createTrip(formData: FormData): Promise<Result<{ id: string }>> {
  const session = await auth();
  if (!session || !session.user?.id)
    return {
      success: false,
      message: "User is not authenticated."
    };

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();

  if (!title || !description || !startDateStr || !endDateStr)
    return {
      success: false,
      message: "All fields are required."
    };

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const trip = await prisma.trip.create({
    data: {
      title,
      description,
      startDate,
      endDate,
      imageUrl,
      userId: session.user.id
    }
  });

  return {
    success: true,
    message: "Trip created successfully.",
    data: {id: trip.id} // tripId
  };
}
