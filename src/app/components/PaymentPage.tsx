import { useState } from "react";
import { Booking, User } from "../App";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ArrowLeft, CreditCard, Smartphone, Building2, CheckCircle2, Lock, Download } from "lucide-react";
import { toast } from "sonner";
import { downloadVoucher } from "./VoucherGenerator";
import { createPayment, type MetodoPago } from "../../lib/services/paymentService";
import { updateBookingStatus } from "../../lib/services/bookingService";

type PaymentPageProps = {
  booking: Booking;
  user: User;
  onBack: () => void;
  onPaymentComplete: () => void;
};

export function PaymentPage({ booking, user, onBack, onPaymentComplete }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<MetodoPago>("tarjeta");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const totalAmount = booking.totalPrice * 1.1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment gateway delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save payment to Supabase
      await createPayment({
        bookingId: booking.id,
        userId: user.id,
        amount: totalAmount,
        paymentMethod,  // ya es MetodoPago (tarjeta | paypal | transferencia)
      });

      // Update booking status to confirmed
      await updateBookingStatus(booking.id, "confirmed", "completed");

      booking.status = "confirmed";
      booking.paymentStatus = "completed";

      toast.success("¡Pago procesado exitosamente!");
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al procesar el pago";
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadVoucher = () => {
    downloadVoucher(booking, user.name, user.email);
    toast.success("Voucher descargado exitosamente");
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    onPaymentComplete();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(" ");
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

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

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Método de Pago 💳</h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Pago seguro con encriptación SSL
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona método de pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as MetodoPago)}>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="tarjeta" id="tarjeta" />
                      <Label htmlFor="tarjeta" className="flex items-center gap-2 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5" />
                        <span>Tarjeta de Crédito/Débito</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="paypal" id="paypal-btn" />
                      <Label htmlFor="paypal-btn" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Smartphone className="w-5 h-5" />
                        <span>PayPal</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="transferencia" id="transferencia" />
                      <Label htmlFor="transferencia" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Building2 className="w-5 h-5" />
                        <span>Transferencia Bancaria</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {paymentMethod === "tarjeta" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles de la Tarjeta</CardTitle>
                    <CardDescription>Ingresa los datos de tu tarjeta de forma segura</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        placeholder="JUAN PEREZ"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Fecha de expiración</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          type="password"
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === "paypal" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Smartphone className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Serás redirigido a PayPal</h3>
                      <p className="text-gray-600">
                        Al continuar, serás redirigido a PayPal para completar el pago de forma segura
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod === "transferencia" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="bg-emerald-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Datos para transferencia:</h3>
                      <div className="space-y-2 text-sm text-slate-700">
                        <p><strong>Banco:</strong> Banco Nacional</p>
                        <p><strong>Cuenta:</strong> 1234-5678-9012-3456</p>
                        <p><strong>Titular:</strong> Tours Tumbes</p>
                        <p><strong>Referencia:</strong> {booking.id}</p>
                      </div>
                      <p className="mt-4 text-sm text-emerald-900">
                        Una vez realizada la transferencia, envía el comprobante a pagos@tourstumbes.com
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">{booking.destination.name}</h3>
                    <p className="text-sm text-gray-600">{booking.destination.country}</p>
                    <p className="text-sm text-gray-600 mt-2">Referencia: {booking.id}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">S/{booking.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Impuestos</span>
                      <span className="font-medium">S/{(booking.totalPrice * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-bold">Total a Pagar</span>
                      <span className="font-bold text-emerald-700 text-xl">
                        S/{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Pago 100% seguro</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Cancelación gratuita</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Confirmación inmediata</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pagar S/{totalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Al completar el pago, aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">¡Pago Exitoso!</DialogTitle>
            <DialogDescription className="text-center">
              Tu reserva ha sido confirmada. Hemos enviado los detalles a tu email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-emerald-900 mb-2">Detalles de la Reserva:</p>
              <p className="text-sm text-emerald-800">
                <strong>Destino:</strong> {booking.destination.name}
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Referencia:</strong> {booking.id}
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Total:</strong> S/{totalAmount.toFixed(2)}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleDownloadVoucher} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Descargar Voucher
              </Button>
              <Button onClick={handleContinue} className="w-full">
                Ver Mis Reservas
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              El voucher también ha sido enviado a tu correo electrónico
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
