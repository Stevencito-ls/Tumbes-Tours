import { User, Booking, Destination } from "../App";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Calendar, Users, MapPin, CreditCard, Download } from "lucide-react";
import { downloadVoucher } from "./VoucherGenerator";
import { toast } from "sonner";

type HistoryPageProps = {
  user: User;
  onBack: () => void;
  onViewDetails: (destination: Destination) => void;
};

const mockBookings: Booking[] = [
  {
    id: "BK1720012345",
    destinationId: "1",
    destination: {
      id: "1",
      name: "Manglares & Isla del Amor",
      country: "Tumbes, Perú",
      description: "Navega por manglares y disfruta de un atardecer único en la costa norte.",
      price: 549,
      duration: "2 días / 1 noche",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=600&fit=crop",
      included: ["Transporte terrestre", "Tour en bote", "Visita a Isla del Amor", "Guía local"],
      rating: 4.9,
    },
    userId: "1",
    travelers: 2,
    startDate: "2026-06-15",
    totalPrice: 1098,
    status: "confirmed",
    paymentStatus: "completed",
    createdAt: "2026-04-20T10:30:00Z",
  },
  {
    id: "BK1720023456",
    destinationId: "3",
    destination: {
      id: "3",
      name: "Playa Punta Sal Relax",
      country: "Tumbes, Perú",
      description: "Fin de semana frente al mar con playa privada y actividades acuáticas.",
      price: 799,
      duration: "3 días / 2 noches",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      included: ["Alojamiento frente al mar", "Desayuno buffet", "Actividades acuáticas", "Traslados"],
      rating: 4.7,
    },
    userId: "1",
    travelers: 1,
    startDate: "2026-03-10",
    totalPrice: 799,
    status: "confirmed",
    paymentStatus: "completed",
    createdAt: "2026-02-15T14:20:00Z",
  },
];

export function HistoryPage({ user, onBack, onViewDetails }: HistoryPageProps) {
  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      pending: { label: "Pendiente", variant: "secondary" as const },
      confirmed: { label: "Confirmado", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const },
    };
    return statusConfig[status];
  };

  const getPaymentStatusBadge = (status: Booking["paymentStatus"]) => {
    const statusConfig = {
      pending: { label: "Pago Pendiente", variant: "secondary" as const },
      completed: { label: "Pagado", variant: "default" as const },
      failed: { label: "Pago Fallido", variant: "destructive" as const },
    };
    return statusConfig[status];
  };

  const handleDownloadVoucher = (booking: Booking) => {
    downloadVoucher(booking, user.name, user.email);
    toast.success("Voucher descargado exitosamente");
  };

  const handleViewDetails = (destination: Destination) => {
    onViewDetails(destination);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-emerald-50 to-slate-100">
      <header className="bg-white/90 shadow-sm border-b border-slate-200 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Historial completo de tus viajes</p>
        </div>

        {mockBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tienes reservas aún
              </h3>
              <p className="text-gray-600 mb-6">
                Explora nuestros destinos y comienza tu próxima aventura
              </p>
              <Button onClick={onBack}>Explorar Destinos</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-64 h-48 md:h-auto bg-gray-200">
                    <img
                      src={booking.destination.image}
                      alt={booking.destination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl mb-1">
                            {booking.destination.name}
                          </CardTitle>
                          <p className="text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {booking.destination.country}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={getStatusBadge(booking.status).variant}>
                            {getStatusBadge(booking.status).label}
                          </Badge>
                          <Badge variant={getPaymentStatusBadge(booking.paymentStatus).variant}>
                            {getPaymentStatusBadge(booking.paymentStatus).label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha de inicio</p>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.startDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">Viajeros</p>
                            <p className="font-medium text-gray-900">
                              {booking.travelers} {booking.travelers === 1 ? "persona" : "personas"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">Total pagado</p>
                            <p className="font-medium text-gray-900">S/{booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          <p>Reserva: {booking.id}</p>
                          <p>
                            Creada el{" "}
                            {new Date(booking.createdAt).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking.destination)}>
                            Ver Detalles
                          </Button>
                          {booking.status === "confirmed" && (
                            <Button size="sm" onClick={() => handleDownloadVoucher(booking)}>
                              <Download className="w-4 h-4 mr-2" />
                              Descargar Voucher
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total de Viajes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-700">{mockBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximo Viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold text-gray-900">
                {mockBookings[0]?.destination.name || "N/A"}
              </p>
              {mockBookings[0] && (
                <p className="text-sm text-gray-600">
                  {new Date(mockBookings[0].startDate).toLocaleDateString("es-ES", {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Invertido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-700">
                S/{mockBookings.reduce((sum, b) => sum + b.totalPrice, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
