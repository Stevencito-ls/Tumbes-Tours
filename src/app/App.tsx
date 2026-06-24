import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthPage } from "./components/AuthPage";
import { HomePage } from "./components/HomePage";
import { DestinationDetail } from "./components/DestinationDetail";
import { BookingPage } from "./components/BookingPage";
import { HistoryPage } from "./components/HistoryPage";
import { PaymentPage } from "./components/PaymentPage";
import { WelcomePage } from "./components/WelcomePage";
import { supabase } from "../lib/supabase";
import { signIn, signUp, signOut, getSessionUser } from "../lib/services/authService";
import { toast } from "sonner";

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dni?: string;
};

export type Destination = {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  included: string[];
  rating: number;
};

export type Booking = {
  id: string;
  destinationId: string;
  destination: Destination;
  userId: string;
  travelers: number;
  startDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<"welcome" | "auth" | "home" | "destination" | "booking" | "history" | "payment">("welcome");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Detect existing session on mount
  useEffect(() => {
    getSessionUser().then((sessionUser) => {
      if (sessionUser) {
        setUser(sessionUser);
        setCurrentPage("home");
      }
      setAuthLoading(false);
    });

    // Listen for auth state changes (e.g., session expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        setCurrentPage("welcome");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const loggedUser = await signIn(email, password);
      setUser(loggedUser);
      setCurrentPage("home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al iniciar sesión";
      toast.error(message);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, phone: string, dni: string) => {
    try {
      const newUser = await signUp(email, password, name, phone, dni);
      setUser(newUser);
      setCurrentPage("home");
      toast.success("¡Cuenta creada exitosamente!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al crear la cuenta";
      toast.error(message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setCurrentPage("welcome");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cerrar sesión";
      toast.error(message);
    }
  };

  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setCurrentPage("destination");
  };

  const handleBookNow = () => {
    setCurrentPage("booking");
  };

  const handleConfirmBooking = (booking: Booking) => {
    setCurrentBooking(booking);
    setCurrentPage("payment");
  };

  const handlePaymentComplete = () => {
    setCurrentPage("history");
  };

  useEffect(() => {
    if (!user && currentPage !== "welcome" && currentPage !== "auth") {
      setCurrentPage("welcome");
    }
  }, [currentPage, user]);

  // Show nothing while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === "welcome") {
      return (
        <>
          <WelcomePage
            onLogin={() => {
              setAuthMode("login");
              setCurrentPage("auth");
            }}
            onRegister={() => {
              setAuthMode("register");
              setCurrentPage("auth");
            }}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <AuthPage
          initialTab={authMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onBack={() => setCurrentPage("welcome")}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {currentPage === "home" && (
          <HomePage
            user={user}
            onLogout={handleLogout}
            onSelectDestination={handleSelectDestination}
            onViewHistory={() => setCurrentPage("history")}
          />
        )}
        {currentPage === "destination" && selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            onBack={() => setCurrentPage("home")}
            onBookNow={handleBookNow}
          />
        )}
        {currentPage === "booking" && selectedDestination && (
          <BookingPage
            destination={selectedDestination}
            user={user}
            onBack={() => setCurrentPage("destination")}
            onConfirmBooking={handleConfirmBooking}
          />
        )}
        {currentPage === "payment" && currentBooking && (
          <PaymentPage
            booking={currentBooking}
            user={user}
            onBack={() => setCurrentPage("booking")}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
        {currentPage === "history" && (
          <HistoryPage
            user={user}
            onBack={() => setCurrentPage("home")}
            onViewDetails={(destination) => {
              setSelectedDestination(destination);
              setCurrentPage("destination");
            }}
          />
        )}
      </div>
      <Toaster />
    </>
  );
}
