"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminBarberItem } from "./AdminPanel";

type Props = { barbers: AdminBarberItem[] };

const emptyCreateForm = {
  name: "",
  email: "",
  password: "",
  role: "BARBER",
  specialty: "",
  bio: "",
};

type EditForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  bio: string;
};

const inputClass =
  "w-full bg-black/40 border border-zinc-700 focus:border-white outline-none px-3 py-2 text-sm text-white placeholder-zinc-600 rounded-none transition-colors duration-150";
const labelClass = "text-xs text-zinc-400 uppercase tracking-widest";

export function BarberosTab({ barbers: initialBarbers }: Props) {
  const router = useRouter();
  const [barbers, setBarbers] = useState(initialBarbers);

  // --- Create form state ---
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // --- Per-card state ---
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: "", email: "", password: "", role: "BARBER", bio: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  function setError(id: string, msg: string) {
    setErrors((prev) => ({ ...prev, [id]: msg }));
  }
  function clearError(id: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  function openEdit(b: AdminBarberItem) {
    setEditingId(b.id);
    setEditError(null);
    setEditForm({
      name: b.displayName,
      email: b.email,
      password: "",
      role: b.role,
      bio: b.bio ?? "",
    });
  }

  function closeEdit() {
    setEditingId(null);
    setEditError(null);
  }

  async function toggleActive(b: AdminBarberItem) {
    setLoadingId(b.id);
    clearError(b.id);
    try {
      const res = await fetch(`/api/admin/barbers/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(b.id, data.error ?? "Error al actualizar.");
        return;
      }
      setBarbers((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, isActive: !x.isActive } : x))
      );
      router.refresh();
    } catch {
      setError(b.id, "Error de conexión.");
    } finally {
      setLoadingId(null);
    }
  }

  async function deletBarber(b: AdminBarberItem) {
    clearError(b.id);
    if (!window.confirm(`¿Eliminar a ${b.displayName}? Esta acción no se puede deshacer.`)) return;

    setLoadingId(b.id);
    try {
      const res = await fetch(`/api/admin/barbers/${b.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(b.id, data.error ?? "Error al eliminar.");
        return;
      }
      setBarbers((prev) => prev.filter((x) => x.id !== b.id));
      router.refresh();
    } catch {
      setError(b.id, "Error de conexión.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);
    try {
      const res = await fetch("/api/admin/barbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(data.error ?? "Error al crear barbero.");
        return;
      }
      setBarbers((prev) => [...prev, data]);
      setCreateForm(emptyCreateForm);
      setShowCreate(false);
      router.refresh();
    } catch {
      setCreateError("Error de conexión.");
    } finally {
      setCreateLoading(false);
    }
  }

  async function handleEdit(e: React.FormEvent, b: AdminBarberItem) {
    e.preventDefault();
    setEditError(null);
    setEditLoading(true);
    try {
      const payload: Record<string, string> = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        bio: editForm.bio,
      };
      if (editForm.password) payload.password = editForm.password;

      const res = await fetch(`/api/admin/barbers/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEditError(data.error ?? "Error al guardar.");
        return;
      }
      setBarbers((prev) => prev.map((x) => (x.id === b.id ? { ...x, ...data } : x)));
      closeEdit();
      router.refresh();
    } catch {
      setEditError("Error de conexión.");
    } finally {
      setEditLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest">
          {barbers.length} barbero{barbers.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setShowCreate((v) => !v); setCreateError(null); }}
          className="text-xs px-4 py-2 border border-zinc-600 text-zinc-300 hover:border-white hover:text-white transition-colors duration-150 uppercase tracking-widest"
        >
          {showCreate ? "Cancelar" : "+ NUEVO BARBERO"}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-4 border border-zinc-800 bg-zinc-900 px-5 py-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
            Nuevo barbero
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Nombre completo *</label>
              <input
                className={inputClass}
                placeholder="Juan García"
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                className={inputClass}
                placeholder="juan@shave-studio.com"
                value={createForm.email}
                onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Contraseña * (mín. 6)</label>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••"
                value={createForm.password}
                onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))}
                minLength={6}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Rol</label>
              <select
                className={inputClass}
                value={createForm.role}
                onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
              >
                <option value="BARBER">BARBER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Especialidad *</label>
              <input
                className={inputClass}
                placeholder="ESPECIALISTA EN CORTE"
                value={createForm.specialty}
                onChange={(e) => setCreateForm((f) => ({ ...f, specialty: e.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Bio (opcional)</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={2}
                placeholder="Breve descripción..."
                value={createForm.bio}
                onChange={(e) => setCreateForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </div>
          </div>

          {createError && <p className="text-xs text-red-400">{createError}</p>}

          <div className="pt-1">
            <button
              type="submit"
              disabled={createLoading}
              className="text-xs px-6 py-2.5 border border-white text-white hover:bg-white hover:text-black transition-colors duration-150 uppercase tracking-widest disabled:opacity-40"
            >
              {createLoading ? "Creando..." : "CREAR BARBERO"}
            </button>
          </div>
        </form>
      )}

      {/* Barber list */}
      {barbers.length === 0 && !showCreate && (
        <p className="text-sm text-zinc-500">Sin barberos registrados.</p>
      )}

      <div className="flex flex-col gap-4">
        {barbers.map((b) => {
          const isLoading = loadingId === b.id;
          const errorMsg = errors[b.id];
          const isEditing = editingId === b.id;

          return (
            <div
              key={b.id}
              className={`border px-5 py-4 flex flex-col gap-4 transition-opacity
                ${b.isActive ? "border-zinc-700 bg-black/40" : "border-zinc-800 bg-black/20 opacity-60"}`}
            >
              {/* Name + status + action buttons */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-white uppercase">{b.displayName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{b.email}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span
                    className={`text-xs px-2.5 py-1 border ${
                      b.isActive
                        ? "border-[#e63946]/30 text-[#e63946] bg-[#e63946]/10"
                        : "border-zinc-700 text-zinc-500"
                    }`}
                  >
                    {b.isActive ? "Activo" : "Inactivo"}
                  </span>

                  <button
                    onClick={() => (isEditing ? closeEdit() : openEdit(b))}
                    disabled={isLoading}
                    className="text-xs px-3 py-1 border border-zinc-600 text-zinc-400 hover:border-white hover:text-white transition-colors duration-150 disabled:opacity-40"
                  >
                    {isEditing ? "Cancelar" : "EDITAR"}
                  </button>

                  <button
                    onClick={() => toggleActive(b)}
                    disabled={isLoading}
                    className={`text-xs px-3 py-1 border transition-colors duration-150 disabled:opacity-40
                      ${b.isActive
                        ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                        : "border-white/40 text-white hover:bg-white/10"
                      }`}
                  >
                    {isLoading ? "..." : b.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>

              {/* Config grid */}
              {!isEditing && (
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <span className="text-zinc-500">Seña</span>
                  <span className="text-zinc-300">{b.depositPercentage}%</span>
                  <span className="text-zinc-500">Rol</span>
                  <span className="text-zinc-300">{b.role}</span>

                  {b.transferCBUorCVU && (
                    <>
                      <span className="text-zinc-500">CBU / CVU</span>
                      <span className="text-zinc-300 font-mono break-all">{b.transferCBUorCVU}</span>
                    </>
                  )}
                  {b.transferAlias && (
                    <>
                      <span className="text-zinc-500">Alias</span>
                      <span className="text-zinc-300">{b.transferAlias}</span>
                    </>
                  )}
                  {b.transferHolderName && (
                    <>
                      <span className="text-zinc-500">Titular</span>
                      <span className="text-zinc-300">{b.transferHolderName}</span>
                    </>
                  )}
                  {!b.transferCBUorCVU && !b.transferAlias && (
                    <>
                      <span className="text-zinc-500">Transferencia</span>
                      <span className="text-zinc-600">Sin configurar</span>
                    </>
                  )}
                </div>
              )}

              {/* Inline edit form */}
              {isEditing && (
                <form
                  onSubmit={(e) => handleEdit(e, b)}
                  className="flex flex-col gap-4 border border-zinc-800 bg-zinc-900 px-4 py-4 -mx-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Nombre *</label>
                      <input
                        className={inputClass}
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Email *</label>
                      <input
                        type="email"
                        className={inputClass}
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Nueva contraseña (opcional)</label>
                      <input
                        type="password"
                        className={inputClass}
                        placeholder="Dejar vacío para no cambiar"
                        value={editForm.password}
                        onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>Rol</label>
                      <select
                        className={inputClass}
                        value={editForm.role}
                        onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                      >
                        <option value="BARBER">BARBER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className={labelClass}>Bio</label>
                      <textarea
                        className={`${inputClass} resize-none`}
                        rows={2}
                        value={editForm.bio}
                        onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                      />
                    </div>
                  </div>

                  {editError && <p className="text-xs text-red-400">{editError}</p>}

                  <div>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="text-xs px-5 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors duration-150 uppercase tracking-widest disabled:opacity-40"
                    >
                      {editLoading ? "Guardando..." : "GUARDAR CAMBIOS"}
                    </button>
                  </div>
                </form>
              )}

              {/* Error */}
              {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

              {/* Delete — only when inactive */}
              {!b.isActive && !isEditing && (
                <div className="border-t border-zinc-800 pt-3">
                  <button
                    onClick={() => deletBarber(b)}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 border border-zinc-600 text-zinc-500 hover:border-red-500/40 hover:text-red-400 transition-colors duration-150 disabled:opacity-40"
                  >
                    {isLoading ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
