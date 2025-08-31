"use client"

import {Location, Trip} from "@/app/generated/prisma";
import Image from "next/image";
import {Calendar, MapPin, Pencil, Plus} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useState} from "react";
import Map from "@/components/map";
import SortableItinerary from "@/components/sortable-itinerary";

export type TripWithLocation = Trip & {
  locations: Location[];
}

interface TripDetailClientProps {
  trip: TripWithLocation;
}

export default function TripDetailClient({trip}: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {trip.imageUrl && (
        <div className="w-full h-72 md:h-96 overflow-hidden rounded-xl shadow-lg relative">
          <Image src={trip.imageUrl}
                 alt={trip.title}
                 className="object-cover"
                 fill
                 priority
          />
        </div>
      )}

      <div className="bg-white p-6 shadow rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {trip.title}
            </h1>

            <div className="flex items-center text-gray-500 mt-2">
              <Calendar className="h-5 w-5 mr-2"/>
              <span className="text-lg">
              {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
            </span>
            </div>
          </div>

          <div className="ml-4">
            <Link href={`/trips/${trip.id}/itinerary/new`}>
              <Button>
                <Plus className="mr-2 h-5 w-5"/>
                Add Location
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 gap-1">
            <TabsTrigger value="overview" className="text-lg"> Overview </TabsTrigger>
            <TabsTrigger value="itinerary" className="text-lg"> Itinerary </TabsTrigger>
            <TabsTrigger value="map" className="text-lg"> Map </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grip md:grid-cols-2 gap-6">
              <h2 className="text-2xl font-semibold mb-4">Trip Summary</h2>

              <div className="space-y-4 flex flex-col md:flex-row justify-between">
                <div className="space-y-4 flex-col md:w-1/2">
                  <div className="space-y-4 flex justify-between">
                    <div className="flex items-start w-3/5">
                      <Calendar className="h-6 w-6 mr-3 text-gray-500"/>
                      <div className="min-w-40">
                        <p className="font-medium text-gray-700">Dates</p>
                        <p className="text-sm text-gray-500">
                          {trip.startDate.toLocaleDateString()} - {trip.endDate.toLocaleDateString()}
                          <br/>
                          {
                            `${Math.round((trip.endDate.getTime() - trip.startDate.getTime())
                              / (1000 * 60 * 60 * 24)
                            )} days(s)`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start w-2/5">
                      <MapPin className="h-6 w-6 mr-3 text-gray-500"/>
                      <div>
                        <p className="font-medium text-gray-700">Destinations</p>
                        <p>{trip.locations.length} {trip.locations.length === 1 ? "location" : "locations"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-start">
                      <Pencil className="h-6 w-6 mr-3 text-gray-500"/>
                      <div>
                        <p className="font-medium text-gray-700">Description</p>
                      </div>
                    </div>
                    <p className="text-gray-600 ml-2 mr-2 text-sm italic leading-relaxed">{trip.description}</p>
                  </div>
                </div>

                {trip.locations.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-lg font-semibold mb-2">
                      Add locations to see them on the map.
                    </p>
                    <Link href={`/trips/${trip.id}/itinerary/new`}>
                      <Button>
                        <Plus className="mr-2 h-5 w-5"/>
                        Add Location
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="h-96 md:w-1/2 rounded-lg overflow-hidden shadow">
                    <Map itineraries={trip.locations}/>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="itinerary" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Full Itinerary</h2>
              {trip.locations.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-lg font-semibold mb-2">
                    Add locations to see them on the itinerary list.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      <Plus className="mr-2 h-5 w-5"/>
                      Add Location
                    </Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary locations={trip.locations} tripId={trip.id}/>
              )}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Big Map Preview</h2>
              {trip.locations.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-lg font-semibold mb-2">
                    Add locations to see the big map preview.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button>
                      <Plus className="mr-2 h-5 w-5"/>
                      Add Location
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="h-192 mt-4 w-full rounded-lg overflow-hidden shadow">
                  <Map itineraries={trip.locations}/>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};
