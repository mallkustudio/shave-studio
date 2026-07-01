"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { TurnosAdminTab } from "./TurnosAdminTab";
import { BarberosTab } from "./BarberosTab";
import { ConfigTab } from "./ConfigTab";

type BookingStatus =
  | "PENDING_PAYMENT"
  | "PENDING_REVIEW"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "PAYMENT_EXPIRED"
  | "NO_SHOW";

export type AdminBookingItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  barberName: string;
  startAt: string;
  serviceName: string;
  serviceDurationMinutes: number;
  servicePrice: number;
  depositAmount: number | null;
  status: BookingStatus;
  paymentProofUrl: string | null;
  paymentExpiresAt: string | null;
};

export type AdminBarberItem = {
  id: string;
  displayName: string;
  isActive: boolean;
  depositPercentage: number;
  transferAlias: string | null;
  transferHolderName: string | null;
  transferCBUorCVU: string | null;
};

export type AdminSettings = {
  paymentWindowMinutes: number;
};

type Tab = "turnos" | "barberos" | "configuracion";

const TABS: { key: Tab; label: string }[] = [
  { key: "turnos", label: "TURNOS" },
  { key: "barberos", label: "BARBEROS" },
  { key: "configuracion", label: "CONFIGURACIÓN" },
];

type Props = {
  adminName: string;
  bookings: AdminBookingItem[];
  barbers: AdminBarberItem[];
  settings: AdminSettings;
};

export function AdminPanel({ adminName, bookings, barbers, settings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("turnos");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}
      <div className="px-4 pt-10 max-w-xl mx-auto flex items-start justify-between gap-4">
        <div>
          <p className="text-[#e63946] text-xs uppercase tracking-widest mb-1">Panel de administrador</p>
          <h1 className="text-2xl font-black tracking-widest uppercase">{adminName}</h1>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-zinc-500 hover:text-white uppercase tracking-widest transition-colors mt-1 shrink-0"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Tab nav */}
      <div className="max-w-xl mx-auto px-4 mt-6 flex border-b border-zinc-800 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`shrink-0 px-3 py-3 text-xs font-semibold uppercase tracking-widest border-b-2 transition-colors duration-150
              ${activeTab === key
                ? "border-[#e63946] text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-8 max-w-xl mx-auto">
        {activeTab === "turnos" && <TurnosAdminTab bookings={bookings} />}
        {activeTab === "barberos" && <BarberosTab barbers={barbers} />}
        {activeTab === "configuracion" && <ConfigTab settings={settings} />}
      </div>

    </div>
  );
}
