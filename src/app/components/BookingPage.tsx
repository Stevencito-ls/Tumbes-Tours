import { useState } from "react";
import { Destination, User, Booking } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowLeft, Calendar, Users } from "lucide-react";
import { createBooking } from "../../lib/services/bookingService";
import { toast } from "sonner";

type BookingPageProps = {
  destination: Destination;
  user: User;
  onBack: () => void;
  onConfirmBooking: (booking: Booking) => void;
};

export function BookingPage({ destination, user, onBack, onConfirmBooking }: BookingPageProps) {
  const [travelers, setTravelers] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [firstName, setFirstName] = useState(user.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(user.name.split(" ").slice(1).join(" ") || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = destination.price * travelers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const booking: Booking = {
      id: `BK${Date.now()}`,
      destinationId: destination.id,
      destination: destination,
      userId: user.id,
      travelers,
      startDate,
      totalPrice,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await createBooking({
        id: booking.id,
        destinationId: booking.destinationId,
        userId: booking.userId,
        travelers: booking.travelers,
        startDate: booking.startDate,
        totalPrice: booking.totalPrice,
        specialRequests: specialRequests || undefined,
      });
      onConfirmBooking(booking);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la reserva";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Completa tu Reserva ✨</h1>
          <p className="text-slate-600">Asegura tu paquete a Tumbes con datos rápidos y sencillos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Viaje</CardTitle>
                  <CardDescription>Selecciona las fechas y número de viajeros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha de inicio
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travelers" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Número de viajeros
                      </Label>
                      <Input
                        id="travelers"
                        type="number"
                        min="1"
                        max="10"
                        value={travelers}
                        onChange={(e) => setTravelers(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información del Contacto</CardTitle>
                  <CardDescription>Datos para la reserva y confirmación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+51 987 654 321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Solicitudes Especiales (Opcional)</CardTitle>
                  <CardDescription>Cuéntanos si tienes alguna preferencia</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full min-h-24 px-3 py-2 border rounded-md"
                    placeholder="Ej: Habitación con vista al mar, dieta vegetariana, celebración de aniversario..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen de Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                    <p className="text-sm text-gray-600">{destination.country}</p>
                    <p className="text-sm text-gray-600 mt-1">{destination.duration}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Precio por persona</span>
                      <span className="font-medium">S/{destination.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Viajeros</span>
                      <span className="font-medium">×{travelers}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-emerald-700 text-xl">S/{totalPrice}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900">
                    <p className="font-medium">Incluye:</p>
                    <ul className="mt-2 space-y-1">
                      {destination.included.slice(0, 3).map((item, index) => (
                        <li key={index}>✓ {item}</li>
                      ))}
                      {destination.included.length > 3 && (
                        <li>✓ Y {destination.included.length - 3} más...</li>
                      )}
                    </ul>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando reserva..." : "Continuar al Pago"}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    No se realizará ningún cargo hasta confirmar el pago
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
