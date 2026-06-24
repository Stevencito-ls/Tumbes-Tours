import { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { AuthPage } from "./components/AuthPage";
import { HomePage } from "./components/HomePage";
import { DestinationDetail } from "./components/DestinationDetail";
import { BookingPage } from "./components/BookingPage";
import { HistoryPage } from "./components/HistoryPage";
import { PaymentPage } from "./components/PaymentPage";
import { WelcomePage } from "./components/WelcomePage";

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
  const [currentPage, setCurrentPage] = useState<"welcome" | "auth" | "home" | "destination" | "booking" | "history" | "payment">("welcome");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const handleLogin = (email: string, password: string) => {
    const mockUser: User = {
      id: "1",
      email: email,
      name: email.split("@")[0],
    };
    setUser(mockUser);
    setCurrentPage("home");
  };

  const handleRegister = (name: string, email: string, password: string, phone: string, dni: string) => {
    const mockUser: User = {
      id: "1",
      email: email,
      name: name,
      phone,
      dni,
    };
    setUser(mockUser);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("welcome");
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
