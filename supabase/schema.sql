-- ============================================================
-- TUMBES TOURS — Schema de Base de Datos para Supabase
-- Pegar en: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- ──────────────────────────────────────────
-- 1. TABLA: perfiles
-- Extiende auth.users con datos del turista
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.perfiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  telefono        TEXT,
  dni             TEXT,
  fecha_creacion  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perfiles: usuario ve su propio perfil"
  ON public.perfiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "perfiles: usuario inserta su perfil"
  ON public.perfiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "perfiles: usuario actualiza su perfil"
  ON public.perfiles FOR UPDATE
  USING (auth.uid() = id);


-- ──────────────────────────────────────────
-- 2. TABLA: destinos
-- Paquetes turísticos de Tumbes
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.destinos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  pais            TEXT NOT NULL,
  descripcion     TEXT NOT NULL,
  precio          NUMERIC(10,2) NOT NULL,
  duracion        TEXT NOT NULL,
  imagen          TEXT NOT NULL,
  incluidos       TEXT[] NOT NULL DEFAULT '{}',
  calificacion    NUMERIC(3,1) NOT NULL DEFAULT 5.0,
  fecha_creacion  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.destinos ENABLE ROW LEVEL SECURITY;

-- Lectura pública (todos pueden ver destinos)
CREATE POLICY "destinos: lectura publica"
  ON public.destinos FOR SELECT
  USING (true);


-- ──────────────────────────────────────────
-- 3. TABLA: reservas
-- Reservas de los usuarios
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reservas (
  id                    TEXT PRIMARY KEY,
  destino_id            UUID NOT NULL REFERENCES public.destinos(id),
  usuario_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viajeros              INT NOT NULL DEFAULT 1,
  fecha_inicio          DATE NOT NULL,
  precio_total          NUMERIC(10,2) NOT NULL,
  estado                TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','confirmado','cancelado')),
  estado_pago           TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente','completado','fallido')),
  solicitudes_especiales TEXT,
  fecha_creacion        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reservas: usuario ve sus reservas"
  ON public.reservas FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "reservas: usuario crea reservas"
  ON public.reservas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "reservas: usuario actualiza sus reservas"
  ON public.reservas FOR UPDATE
  USING (auth.uid() = usuario_id);


-- ──────────────────────────────────────────
-- 4. TABLA: pagos
-- Pagos registrados
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pagos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reserva_id      TEXT NOT NULL REFERENCES public.reservas(id),
  usuario_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  monto           NUMERIC(10,2) NOT NULL,
  metodo_pago     TEXT NOT NULL CHECK (metodo_pago IN ('tarjeta','paypal','transferencia')),
  estado          TEXT NOT NULL DEFAULT 'completado' CHECK (estado IN ('pendiente','completado','fallido')),
  fecha_creacion  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pagos: usuario ve sus pagos"
  ON public.pagos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "pagos: usuario registra pagos"
  ON public.pagos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);


-- ============================================================
-- 5. DATOS SEMILLA — Los 9 destinos turísticos de Tumbes
-- ============================================================
INSERT INTO public.destinos (nombre, pais, descripcion, precio, duracion, imagen, incluidos, calificacion) VALUES
(
  'Manglares de Tumbes',
  'Tumbes, Perú',
  'Navega en bote por el único ecosistema de manglares del Perú. Observa aves exóticas, cangrejos y descubre la Isla del Amor al atardecer en las aguas cálidas del norte.',
  549,
  '2 días / 1 noche',
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=600&fit=crop',
  ARRAY['Transporte terrestre','Tour en bote por manglares','Visita a Isla del Amor','Guía local certificado'],
  4.9
),
(
  'Puerto Pizarro & Reserva Nacional',
  'Zarumilla, Tumbes',
  'Explora la Reserva Nacional de Tumbes con avistamiento de aves tropicales, cocodrilos americanos y la maravillosa biodiversidad del noreste peruano.',
  699,
  '3 días / 2 noches',
  'https://images.unsplash.com/photo-1518173946681-7757a5a0b4a5?w=800&h=600&fit=crop',
  ARRAY['Tour guiado','Almuerzo de mariscos','Avistamiento de fauna','Traslados incluidos'],
  4.8
),
(
  'Playa Punta Sal - Paraíso Costero',
  'Contralmirante Villar, Tumbes',
  'Disfruta de las aguas cálidas y transparentes de Punta Sal, una de las mejores playas del norte peruano, con arena dorada y atardeceres espectaculares.',
  799,
  '3 días / 2 noches',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
  ARRAY['Alojamiento frente al mar','Desayuno buffet','Snorkel y kayak','Traslados aeropuerto'],
  4.9
),
(
  'Zorritos & Bocapán - Playa Virgen',
  'Contralmirante Villar, Tumbes',
  'Recorre las playas vírgenes de Zorritos y Bocapán, famosas por sus piscinas naturales de roca, ceviche de pejes y atardeceres únicos sobre el Pacífico.',
  649,
  '3 días / 2 noches',
  'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&h=600&fit=crop',
  ARRAY['Alojamiento en playa','Tour a piscinas naturales','Cena gourmet de mariscos','Traslados'],
  4.8
),
(
  'Ruta Gastronómica Tumbes',
  'Tumbes, Perú',
  'Sumérgete en la gastronomía tumbesina: ceviche de conchas negras, sudado de mero, chicha de jora y los mercados artesanales del centro de Tumbes.',
  449,
  '2 días / 1 noche',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
  ARRAY['Tour gastronómico guiado','Degustación de platos típicos','Visita al mercado de Tumbes','Guía local'],
  4.7
),
(
  'Bosque Seco & Coto de Caza',
  'Tumbes, Perú',
  'Aventúrate por el Coto de Caza El Angolo y el Bosque Seco Ecuatorial de Tumbes, hogar del oso de anteojos, el puma y cientos de especies de aves únicas.',
  599,
  '2 días / 1 noche',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&h=600&fit=crop',
  ARRAY['Safari de avistamiento','Guía especializado en fauna','Desayuno en la naturaleza','Traslados'],
  4.6
),
(
  'Isla del Amor & Punta Capones',
  'Zarumilla, Tumbes',
  'Excursión de un día a la Isla del Amor y Punta Capones, entre manglares y aguas turquesas en la frontera con Ecuador. Ideal para familias y aventureros.',
  320,
  '1 día',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
  ARRAY['Paseo en lancha','Snorkel en arrecifes','Almuerzo de mariscos','Guía local'],
  4.7
),
(
  'La Herradura & Aguas Verdes',
  'Zarumilla, Tumbes',
  'Visita La Herradura, playa binacional en la frontera con Ecuador, y el puerto de Aguas Verdes. Intercambio cultural, compras artesanales y mar abierto.',
  380,
  '1 día',
  'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&h=600&fit=crop',
  ARRAY['Tour en lancha','Visita a Aguas Verdes','Guía bilingüe','Transporte incluido'],
  4.5
),
(
  'Tumbes Completo - Tour Regional',
  'Región Tumbes, Perú',
  'El paquete más completo de toda la región: manglares, playas, bosque seco, gastronomía y cultura tumbesina en un solo viaje inolvidable de 5 días.',
  1299,
  '5 días / 4 noches',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
  ARRAY['Alojamiento 4 estrellas','Desayuno y cena diaria','Todos los tours incluidos','Transporte y guías'],
  5.0
);
