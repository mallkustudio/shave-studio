"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { TurnosTab } from "./TurnosTab";
import { PerfilTab } from "./PerfilTab";
import { ServiciosTab } from "./ServiciosTab";
import { DisponibilidadTab } from "./DisponibilidadTab";

export type BarberInfo = {
  id: string;
  displayName: string;
  depositPercentage: number;
  transferAlias: string | null;
  transferHolderName: string | null;
  transferCBUorCVU: string | null;
};

export type BarberServiceItem = {
  id: string;
  serviceId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  basePrice: number;
  customPrice: number | null;
  effectivePrice: number;
  isActive: boolean;
};

export type AvailabilityItem = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export type BlockedTimeItem = {
  id: string;
  startAt: string;
  endAt: string;
  reason: string | null;
  createdAt: string;
};

export type BookingItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  startAt: string;
  serviceName: string;
  serviceDurationMinutes: number;
  servicePrice: number;
  depositAmount: number | null;
  status: "PENDING_PAYMENT" | "PENDING_REVIEW" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "PAYMENT_EXPIRED" | "NO_SHOW";
  paymentProofUrl: string | null;
  paymentExpiresAt: string | null;
};

type Tab = "turnos" | "perfil" | "servicios" | "disponibilidad";

const TABS: { key: Tab; label: string }[] = [
  { key: "turnos", label: "TURNOS" },
  { key: "perfil", label: "MI PERFIL" },
  { key: "servicios", label: "SERVICIOS" },
  { key: "disponibilidad", label: "DISPONIBILIDAD" },
];

type Props = {
  barber: BarberInfo;
  services: BarberServiceItem[];
  availability: AvailabilityItem[];
  blockedTimes: BlockedTimeItem[];
  bookings: BookingItem[];
};

export function BarberPanel({ barber, services, availability, blockedTimes, bookings }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("turnos");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Header */}
      <div className="px-4 pt-10 max-w-xl mx-auto flex items-start justify-between gap-4">
        <div>
          <p className="text-[#e63946] text-xs uppercase tracking-widest mb-1">Panel de barbero</p>
          <h1 className="text-2xl font-black tracking-widest uppercase">{barber.displayName}</h1>
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
        {activeTab === "turnos" && (
          <TurnosTab barber={barber} bookings={bookings} services={services} />
        )}
        {activeTab === "perfil" && (
          <PerfilTab barber={barber} />
        )}
        {activeTab === "servicios" && (
          <ServiciosTab initialServices={services} />
        )}
        {activeTab === "disponibilidad" && (
          <DisponibilidadTab
            barberId={barber.id}
            initialAvailability={availability}
            initialBlockedTimes={blockedTimes}
          />
        )}
      </div>

    </div>
  );
}
