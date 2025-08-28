"use server"

import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {redirect} from "next/navigation";

export async function createTrip(formData: FormData) {

  const session = await auth();

  if (!session || !session.user?.id)
    throw new Error("User is not authenticated.");

  // Pobieranie danych z przesłanego formularza 'FormData'
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();

  if (!title || !description || !startDateStr || !endDateStr)
    throw new Error("All fields are required.");

  // Konwersja na obiekty Date
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Tworzenie nowego rekordu w tabeli `trip`
  await prisma.trip.create({
    data: {
      title,
      description,
      startDate,
      endDate,
      userId: session.user.id
    }
  });

  // Po zapisaniu danych przekierowanie na stronę '/trips'
  redirect("/trips");
}
