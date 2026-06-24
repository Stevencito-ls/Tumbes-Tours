import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Plane, Sparkles, MapPin, Heart } from "lucide-react";

type WelcomePageProps = {
  onLogin: () => void;
  onRegister: () => void;
};

export function WelcomePage({ onLogin, onRegister }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-100 to-slate-100 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-slate-200 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-700">Bienvenido a Tours Tumbes</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
                  Vive lo mejor de <span className="text-emerald-600">Tumbes</span> en cada viaje
                </h1>
                <p className="max-w-2xl text-lg text-slate-600">
                  Paquetes turísticos pensados para conocer playas, manglares, gastronomía y cultura local con estilo único.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={onRegister} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Regístrate ahora
                </Button>
                <Button variant="outline" size="lg" onClick={onLogin} className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                  Iniciar sesión
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-white/90 p-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mb-3">
                    <Plane className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-900">Tours con guía local</p>
                  <p className="text-sm text-slate-500">Descubre los mejores recorridos de Tumbes.</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 mb-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-900">Ubicaciones de playa</p>
                  <p className="text-sm text-slate-500">Los mejores destinos costeros en un solo lugar.</p>
                </div>
                <div className="rounded-3xl bg-white/90 p-5 shadow-sm border border-slate-200">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-900">Experiencias memorables</p>
                  <p className="text-sm text-slate-500">Viajes diseñados para vivir momentos únicos.</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-slate-200 bg-slate-100">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop"
                alt="Playa de Tumbes"
                className="w-full h-full object-cover max-h-[620px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-200">#ViajaTumbes</p>
                <h2 className="text-3xl font-bold">Playa, manglares y cultura</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
