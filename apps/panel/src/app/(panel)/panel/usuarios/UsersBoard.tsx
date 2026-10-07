"use client";

import { useState, useTransition } from "react";
import { Mail, Plus, Trash2 } from "lucide-react";
import type { Role } from "@/generated/prisma";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, PageHeader, Select, Spinner } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { ActionResult } from "@/lib/actions";
import { formatDateTime } from "@/lib/utils";
import { inviteUser, removeUser, resendAccess, updateUserRole } from "./actions";

export type UserDTO = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  lastSignInAt: string | null;
  /** Todavía no aceptó la invitación (email sin confirmar). */
  pending: boolean;
};

const ROLE_LABEL: Record<Role, string> = { ADMIN: "Administrador", EDITOR: "Editor" };

export function UsersBoard({ users, currentUserId }: { users: UserDTO[]; currentUserId: string }) {
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<UserDTO | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function run(action: () => Promise<ActionResult>, onDone?: () => void) {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        if (result.message) toast.success(result.message);
        onDone?.();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Quién puede entrar al panel. Los administradores manejan todo; los editores no tocan WhatsApp ni usuarios.">
        <Button onClick={() => setInviting(true)}>
          <Plus className="h-4 w-4" /> Invitar usuario
        </Button>
      </PageHeader>

      {inviting && (
        <Card className="mb-6 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Invitar usuario</h2>
          <form
            className="mt-5 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              run(() => inviteUser(new FormData(event.currentTarget)), () => setInviting(false));
            }}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" inputMode="email" autoComplete="off" required autoFocus />
              <Hint>Le llega un mail con un enlace para elegir su contraseña.</Hint>
            </div>
            <div>
              <Label htmlFor="fullName">Nombre (opcional)</Label>
              <Input id="fullName" name="fullName" maxLength={120} />
            </div>
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select id="role" name="role" defaultValue="EDITOR">
                <option value="EDITOR">Editor: marcas, imágenes, video y Nosotros</option>
                <option value="ADMIN">Administrador: todo, incluidos WhatsApp y usuarios</option>
              </Select>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <Button type="submit" disabled={pending}>
                {pending ? (
                  <>
                    <Spinner /> Enviando…
                  </>
                ) : (
                  "Enviar invitación"
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setInviting(false)} disabled={pending}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {users.length === 0 ? (
        <EmptyState title="No hay usuarios" hint="Invitá al primero con el botón de arriba." />
      ) : (
        <ul className="space-y-3">
          {users.map((user) => {
            const isMe = user.id === currentUserId;
            return (
              <li key={user.id}>
                <Card className="flex flex-wrap items-center gap-3 p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-bold text-brand-800">
                    {(user.fullName || user.email).slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-semibold text-ink">{user.fullName || user.email}</span>
                      {isMe && <Badge tone="green">Vos</Badge>}
                      {user.pending && <Badge>Invitación pendiente</Badge>}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-ink-soft">
                      {user.fullName ? `${user.email} · ` : ""}
                      {user.lastSignInAt ? `Último ingreso ${formatDateTime(user.lastSignInAt)}` : `Creado ${formatDateTime(user.createdAt)}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      aria-label={`Rol de ${user.email}`}
                      value={user.role}
                      disabled={pending || isMe}
                      onChange={(event) => run(() => updateUserRole(user.id, event.target.value as Role))}
                      className="w-44"
                    >
                      {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role]}
                        </option>
                      ))}
                    </Select>
                    <IconButton label="Reenviar enlace de acceso" disabled={pending} onClick={() => run(() => resendAccess(user.id))}>
                      <Mail className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Quitar acceso" disabled={pending || isMe} onClick={() => setRemoving(user)} className="hover:text-[var(--color-danger)]">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={removing !== null}
        title={`¿Quitar el acceso a ${removing?.email ?? ""}?`}
        message="Se borra su cuenta del panel y deja de poder entrar al instante. Podés volver a invitarlo cuando quieras."
        confirmLabel="Quitar acceso"
        danger
        loading={pending}
        onCancel={() => setRemoving(null)}
        onConfirm={() => removing && run(() => removeUser(removing.id), () => setRemoving(null))}
      />
    </div>
  );
}
