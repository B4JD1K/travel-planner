import {Card, CardContent, CardTitle} from "@/components/ui/card";
import {auth} from "@/auth";
import AuthButton from "@/components/auth-button";
import {BackpackIcon, Clock4, MapIcon} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col min-h-screen">

      {/* Main Content */}
      <main className="flex-1">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-white to-blue-100 px-8 py-20 md:py-40">
          <div className="max-w-3xl mx-auto px-10 text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Plan your perfect trip, every time
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 mb-8">
              Create itineraries, organize destinations, and share your travel plans all in one place!
            </p>

            <AuthButton
              isLoggedIn={isLoggedIn}
              className="border text-white font-semibold cursor-pointer rounded-md py-2 px-6 hover:poiner-cursor bg-black">
              {isLoggedIn ? ("Get Started") : ("Log In")}
            </AuthButton>
          </div>

          {/* Przycięty wygląd hero sekcji */}
          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-white"
            style={{
              clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%",
            }}
          />
        </section>

        {/* Karty 'feature' */}
        <div className="flex flex-col items-center px-8 py-10 space-y-10 gap-4 justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Plan with confidence
          </h2>
          <div className="flex gap-4">
            <Card className="w-1/3">
              <CardContent>
                <div className="bg-green-100/60 mb-2 w-10 h-10 p-2 items-center justify-center rounded-full">
                  <MapIcon/>
                </div>
                <CardTitle>
                  <p className="font-bold">
                    Interactive Maps
                  </p>
                </CardTitle>
              </CardContent>

              <CardContent>
                <p className="text-gray-500">
                  Visualise your trip with interactive maps. See your entire itinerary at a glance.
                </p>
              </CardContent>
            </Card>

            <Card className="w-1/3">
              <CardContent>
                <div className="bg-yellow-100/60 mb-2 w-10 h-10 p-2 items-center justify-center rounded-full">
                  <Clock4/>
                </div>
                <CardTitle>
                  <p className="font-bold">
                    Day-by-Day Itineraries
                  </p>
                </CardTitle>
              </CardContent>

              <CardContent>
                <p className="text-gray-500">
                  Organize your trip day by day. Never miss a beat with structured planning.
                </p>
              </CardContent>
            </Card>

            <Card className="w-1/3">
              <CardContent>
                <div className="bg-blue-100/60 mb-2 w-10 h-10 p-2 items-center justify-center rounded-full">
                  <BackpackIcon/>
                </div>
                <CardTitle>
                  <p className="font-bold">
                    Drag & Drop Planning
                  </p>
                </CardTitle>
              </CardContent>

              <CardContent>
                <p className="text-gray-500">
                  Easily rearrange your itinerary with simple drag and drop functionality.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Sekcja CTA */}
      <section className="flex flex-col items-center justify-center bg-gray-900 space-y-4 px-8 py-20 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Ready to plan your next adventure?
        </h2>

        <p className="text-lg md:text-xl text-gray-400">
          Join thousands of travelers who plan better trips with TripPlanner.
        </p>

        <AuthButton isLoggedIn={isLoggedIn} className="border mx-2 font-semibold cursor-pointer rounded-md mt-2 py-2 px-4 hover:poiner-cursor bg-white">
          {isLoggedIn ? ("Check It Out") : ("Sign Up Now")}
        </AuthButton>
      </section>
    </div>
  );
}
