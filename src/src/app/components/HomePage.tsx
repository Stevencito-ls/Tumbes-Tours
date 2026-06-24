import { User, Destination } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plane, LogOut, History, Star, Clock, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type HomePageProps = {
  user: User;
  onLogout: () => void;
  onSelectDestination: (destination: Destination) => void;
  onViewHistory: () => void;
};

const mockDestinations: Destination[] = [
  {
    id: "1",
    name: "Manglares & Isla del Amor",
    country: "Tumbes, Perú",
    description: "Navega en bote por los manglares, recorre la Isla del Amor y disfruta del atardecer en las aguas de Tumbes.",
    price: 549,
    duration: "2 días / 1 noche",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
    included: ["Transporte terrestre", "Tour en bote por manglares", "Visita a Isla del Amor", "Guía local"],
    rating: 4.9,
  },
  {
    id: "2",
    name: "Puerto Pizarro & Reserva",
    country: "Tumbes, Perú",
    description: "Explora la Reserva Nacional de Tumbes con avistamiento de aves, lagunas y una ruta en la costa norte peruana.",
    price: 699,
    duration: "3 días / 2 noches",
    image: "https://images.unsplash.com/photo-1518173946681-7757a5a0b4a5?w=800&h=600&fit=crop",
    included: ["Tour guiado", "Almuerzo de mariscos", "Avistamiento de aves", "Traslados incluidos"],
    rating: 4.8,
  },
  {
    id: "3",
    name: "Playa Punta Sal Relax",
    country: "Tumbes, Perú",
    description: "Pasa un fin de semana frente al mar en Playa Punta Sal con hotel, playa privada y actividades acuáticas.",
    price: 799,
    duration: "3 días / 2 noches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    included: ["Alojamiento frente al mar", "Desayuno buffet", "Actividades acuáticas", "Traslados"],
    rating: 4.7,
  },
  {
    id: "4",
    name: "Ruta Cultural Tumbes",
    country: "Tumbes, Perú",
    description: "Descubre la cultura local, mercados artesanales y la gastronomía típica de la región costera.",
    price: 499,
    duration: "2 días / 1 noche",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
    included: ["Tour cultural", "Degustación gastronómica", "Visita a mercados", "Guía local"],
    rating: 4.7,
  },
  {
    id: "5",
    name: "Zorritos Beach Escape",
    country: "Tumbes, Perú",
    description: "Relájate en las playas de Zorritos con actividades de playa, atardeceres y gastronomía marina.",
    price: 649,
    duration: "3 días / 2 noches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    included: ["Alojamiento en playa", "Tour a playas vírgenes", "Picnic gourmet", "Traslados"],
    rating: 4.8,
  },
  {
    id: "6",
    name: "Safari Bosque Seco",
    country: "Tumbes, Perú",
    description: "Atraviesa el bosque seco de Tumbes para observar flora y fauna únicas junto a un guía especializado.",
    price: 599,
    duration: "1 día",
    image: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=800&h=600&fit=crop",
    included: ["Tour de observación", "Guía especializado", "Desayuno ligero", "Traslados"],
    rating: 4.6,
  },
];

export function HomePage({ user, onLogout, onSelectDestination, onViewHistory }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tours Tumbes</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Destinos Populares</h2>
          <p className="text-gray-600">Explora nuestros paquetes turísticos más solicitados en la región de Tumbes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden bg-white/90 border border-slate-200 rounded-[1.75rem] shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer" onClick={() => onSelectDestination(destination)}>
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
                <Button className="w-full" onClick={(e) => {
                  e.stopPropagation();
                  onSelectDestination(destination);
                }}>
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
