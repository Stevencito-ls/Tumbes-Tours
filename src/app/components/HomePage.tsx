import { useEffect, useState } from "react";
import { User, Destination } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plane, LogOut, History, Star, Clock, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getDestinations } from "../../lib/services/destinationService";

type HomePageProps = {
  user: User;
  onLogout: () => void;
  onSelectDestination: (destination: Destination) => void;
  onViewHistory: () => void;
};

export function HomePage({ user, onLogout, onSelectDestination, onViewHistory }: HomePageProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tumbes Tours</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
              <Button variant="outline" size="sm" onClick={onViewHistory}>
                <History className="w-4 h-4 mr-2" />
                Mis Reservas
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Paquetes Turísticos — Toda la Nación Tumbes</h2>
          <p className="text-gray-600">Descubre todos los destinos de la región Tumbes: playas, manglares, bosque seco, gastronomía y más</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Cargando destinos...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <p className="font-medium">Error al cargar destinos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden bg-white/90 border border-slate-200 rounded-[1.75rem] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                onClick={() => onSelectDestination(destination)}
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-900">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {destination.rating}
                  </Badge>
                </div>
                <CardHeader className="bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{destination.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {destination.country}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-700 whitespace-nowrap">S/{destination.price}</p>
                      <p className="text-xs text-slate-500">por persona</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {destination.duration}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDestination(destination);
                    }}
                  >
                    Ver Detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
