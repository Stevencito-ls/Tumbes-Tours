import { Destination } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Star, Clock, MapPin, Check, Plane, Hotel, Utensils, Map } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type DestinationDetailProps = {
  destination: Destination;
  onBack: () => void;
  onBookNow: () => void;
};

export function DestinationDetail({ destination, onBack, onBookNow }: DestinationDetailProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/90 shadow-sm border-b border-slate-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-white text-gray-900">
                <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                {destination.rating} / 5.0
              </Badge>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{destination.name}</h1>
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    {destination.country}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Desde</p>
                  <p className="text-4xl font-bold text-emerald-700">S/{destination.price}</p>
                  <p className="text-sm text-slate-500">por persona</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{destination.duration}</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{destination.description}</p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  Lo que incluye este paquete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        {item.toLowerCase().includes("vuelo") && <Plane className="w-5 h-5 text-blue-600" />}
                        {item.toLowerCase().includes("hotel") && <Hotel className="w-5 h-5 text-blue-600" />}
                        {(item.toLowerCase().includes("desayuno") || item.toLowerCase().includes("pensión")) && <Utensils className="w-5 h-5 text-blue-600" />}
                        {(item.toLowerCase().includes("tour") || item.toLowerCase().includes("excursión")) && <Map className="w-5 h-5 text-blue-600" />}
                        {!item.toLowerCase().includes("vuelo") && !item.toLowerCase().includes("hotel") && !item.toLowerCase().includes("desayuno") && !item.toLowerCase().includes("pensión") && !item.toLowerCase().includes("tour") && !item.toLowerCase().includes("excursión") && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Reserva tu viaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-t border-b py-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Precio base</span>
                    <span className="font-semibold">S/{destination.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración</span>
                    <span className="font-semibold">{destination.duration}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-emerald-900 font-medium">✓ Cancelación gratuita hasta 48h antes</p>
                  </div>
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <p className="text-sm text-cyan-900 font-medium">✓ Pago seguro garantizado</p>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={onBookNow}>
                  Reservar Ahora
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al reservar, aceptas nuestros términos y condiciones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
