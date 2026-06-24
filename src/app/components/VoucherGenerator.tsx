import { Booking } from "../App";
import { Plane, Calendar, Users, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export function generateVoucherHTML(booking: Booking, userName: string, userEmail: string): string {
  const bookingDate = new Date(booking.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const startDate = new Date(booking.startDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voucher - ${booking.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      padding: 40px 20px;
      background: #f9fafb;
    }
    .voucher {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
    }
    .header h1 {
      font-size: 32px;
      margin-bottom: 8px;
    }
    .header p {
      opacity: 0.9;
      font-size: 18px;
    }
    .status-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      margin-top: 16px;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 32px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    .info-item {
      display: flex;
      align-items: start;
      gap: 12px;
    }
    .info-icon {
      width: 20px;
      height: 20px;
      color: #2563eb;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .info-label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    .destination-card {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .destination-name {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }
    .destination-country {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    .destination-description {
      color: #4b5563;
      line-height: 1.6;
      margin-bottom: 16px;
    }
    .destination-duration {
      display: inline-block;
      background: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      color: #1f2937;
      font-weight: 500;
    }
    .included-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .included-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #1f2937;
    }
    .check-icon {
      color: #10b981;
      flex-shrink: 0;
    }
    .price-section {
      background: #eff6ff;
      border-radius: 8px;
      padding: 24px;
      margin-top: 24px;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
    }
    .price-total {
      display: flex;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 2px solid #2563eb;
      font-size: 20px;
      font-weight: 700;
      color: #2563eb;
    }
    .footer {
      background: #f9fafb;
      padding: 30px 40px;
      border-top: 1px solid #e5e7eb;
    }
    .important-info {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .important-info h4 {
      color: #92400e;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .important-info p {
      color: #78350f;
      font-size: 13px;
      line-height: 1.5;
    }
    .contact-info {
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }
    .qr-placeholder {
      width: 120px;
      height: 120px;
      background: white;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto;
      color: #9ca3af;
      font-size: 12px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .voucher {
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="voucher">
    <div class="header">
      <div class="logo">
        <svg class="logo-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
        <h1>Tours Tumbes</h1>
      </div>
      <p>Voucher de viaje oficial para tu reserva en Tumbes</p>
      <div class="status-badge">Pago confirmado</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="destination-card">
          <h2 class="destination-name">${booking.destination.name}</h2>
          <p class="destination-country">📍 ${booking.destination.country}</p>
          <p class="destination-description">${booking.destination.description}</p>
          <span class="destination-duration">⏱️ ${booking.destination.duration}</span>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Detalles de la Reserva</h3>
        <div class="info-grid">
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <div class="info-label">Fecha de inicio</div>
              <div class="info-value">${startDate}</div>
            </div>
          </div>
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <div>
              <div class="info-label">Número de viajeros</div>
              <div class="info-value">${booking.travelers} ${booking.travelers === 1 ? "persona" : "personas"}</div>
            </div>
          </div>
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <div>
              <div class="info-label">Nombre del titular</div>
              <div class="info-value">${userName}</div>
            </div>
          </div>
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <div class="info-label">Email</div>
              <div class="info-value">${userEmail}</div>
            </div>
          </div>
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <div>
              <div class="info-label">N° de Reserva</div>
              <div class="info-value">${booking.id}</div>
            </div>
          </div>
          <div class="info-item">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <div>
              <div class="info-label">Fecha de reserva</div>
              <div class="info-value">${bookingDate}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">Incluye</h3>
        <ul class="included-list">
          ${booking.destination.included.map(item => `
            <li class="included-item">
              <svg class="check-icon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>${item}</span>
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="price-section">
        <div class="price-row">
          <span>Precio por persona</span>
          <span>S/${booking.destination.price}</span>
        </div>
        <div class="price-row">
          <span>Número de viajeros</span>
          <span>×${booking.travelers}</span>
        </div>
        <div class="price-row">
          <span>Subtotal</span>
          <span>S/${booking.totalPrice}</span>
        </div>
        <div class="price-row">
          <span>Impuestos (10%)</span>
          <span>S/${(booking.totalPrice * 0.1).toFixed(2)}</span>
        </div>
        <div class="price-total">
          <span>Total Pagado</span>
          <span>S/${(booking.totalPrice * 1.1).toFixed(2)}</span>
        </div>
      </div>

      <div class="qr-placeholder">
        Código QR<br/>de verificación
      </div>
    </div>

    <div class="footer">
      <div class="important-info">
        <h4>⚠️ Información Importante</h4>
        <p>
          • Presenta este voucher impreso o en formato digital al momento del check-in.<br/>
          • Lleva tu documento de identidad original.<br/>
          • Verifica los requisitos de visa y vacunación para tu destino.<br/>
          • Cancelación gratuita hasta 48 horas antes de la fecha de inicio.
        </p>
      </div>
      <div class="contact-info">
        <p><strong>Tours Tumbes - Tu Agencia de Confianza</strong></p>
        <p>📧 soporte@tourstumbes.com | 📞 +51 987 654 321</p>
        <p>🌐 www.tourstumbes.com</p>
        <p style="margin-top: 12px; font-size: 12px;">
          Documento generado el ${new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export function downloadVoucher(booking: Booking, userName: string, userEmail: string) {
  const html = generateVoucherHTML(booking, userName, userEmail);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Voucher-${booking.id}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
