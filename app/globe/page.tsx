"use client"

import dynamic from "next/dynamic";
import type {GlobeMethods} from "react-globe.gl";
import {useEffect, useRef, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin} from "lucide-react";
import countryCodes from "@/public/country_codes.json";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
});

interface GlobeLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());

  const [locations, setLocations] = useState<GlobeLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/trips");
        const data = await res.json();

        const countrySet = new Set<string>();

        // filtr na przypadek uszkodzonych rekordów
        const validLocations: GlobeLocation[] = data
          .filter((loc: { lat: number; lon: number; }) =>
            !isNaN(loc.lat) && !isNaN(loc.lon))
          .map((loc: { country: string; lat: number; lon: number; name: string; }) => {
            countrySet.add(loc.country);
            return {
              lat: loc.lat,
              lng: loc.lon,
              name: loc.name,
              country: loc.country,
            };
          });

        setLocations(validLocations);
        setVisitedCountries(countrySet);
      } catch (err) {
        console.error("Error in fetchLocations():", err);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchLocations();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = -2;
        clearInterval(interval);
      }
    }, 50);
  }, []);

  return (
    <div className="max-h-[calc(screen-200px)] bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-12">
            Your Travel Journey
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {/* eslint-disable-next-line react/no-unescaped-entities */}
                  See where you've been...
                </h2>

                <fieldset disabled={isLoading} className="group">
                  <div className="h-[600px] justify-center w-full relative">
                    {isLoading && (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"/>
                      </div>
                    )}

                    <div className="flex justify-center group-disabled:opacity-0 w-full h-1/2">
                      <Globe
                        ref={globeRef}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundColor="rgba(0,0,0,0)"
                        pointColor={() => "#FF5733"}
                        pointLabel="name"
                        pointsData={locations}
                        pointRadius={0.5}
                        pointAltitude={0.1}
                        pointsMerge={true}
                        width={800}
                        height={600}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Countries Visited</CardTitle>
                </CardHeader>

                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"/>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          {/* eslint-disable-next-line react/no-unescaped-entities */}
                          You've visited <span className="font-bold">{visitedCountries.size}</span> countries.
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {Array.from(visitedCountries)
                          .sort()
                          .map((code, key) => {
                            const countryName = countryCodes[code as keyof typeof countryCodes] ?? code;
                            return (
                              <div key={key} className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                <MapPin className="h-4 w-4 text-red-500"/>
                                <span className="font-medium">{countryName}</span>
                              </div>
                            );
                          })
                        }

                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}