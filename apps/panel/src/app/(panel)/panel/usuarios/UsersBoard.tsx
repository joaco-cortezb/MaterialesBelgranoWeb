"use client";

import { useState, useTransition } from "react";
import { Mail, Plus, ShieldCheck, Trash2, UserPen } from "lucide-react";
import type { Role } from "@/generated/prisma";
import { Badge, Button, Card, EmptyState, Hint, IconButton, Input, Label, PageHeader, Select } from "@/components/ui";
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

const ROLE_INFO: { role: Role; icon: typeof ShieldCheck; text: string }[] = [
  { role: "ADMIN", icon: ShieldCheck, text: "Todo el panel, incluidos los números de WhatsApp y el equipo." },
  { role: "EDITOR", icon: UserPen, text: "El contenido de la web: soluciones, marcas, portadas, banners, video y Nosotros (menos WhatsApp)." },
];

export function UsersBoard({ users, currentUserId }: { users: UserDTO[]; currentUserId: string }) {
  const [inviting, setInviting] = useState(false);
  const [removing, setRemoving] = useState<UserDTO | null>(null);
  const [changingRole, setChangingRole] = useState<{ user: UserDTO; role: Role } | null>(null);
  const [resending, setResending] = useState<UserDTO | null>(null);
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
      <PageHeader title="Equipo" subtitle="Quién puede entrar al panel. El acceso es sólo por invitación.">
        <Button onClick={() => setInviting(true)}>
          <Plus className="h-4 w-4" /> Invitar persona
        </Button>
      </PageHeader>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {ROLE_INFO.map(({ role, icon: Icon, text }) => (
          <Card key={role} className="flex items-start gap-3 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">{ROLE_LABEL[role]}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{text}</p>
            </div>
          </Card>
        ))}
      </div>

      {inviting && (
        <Card className="mb-6 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-ink">Invitar a alguien al panel</h2>
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
            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-[13px] font-semibold text-ink">Rol</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROLE_INFO.map(({ role, icon: Icon, text }) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4 transition-colors hover:border-brand-300 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50"
                  >
                    <input type="radio" name="role" value={role} defaultChecked={role === "EDITOR"} className="mt-1 accent-[var(--color-brand-600)]" />
                    <span>
                      <span className="flex items-center gap-1.5 font-semibold text-ink">
                        <Icon className="h-4 w-4" /> {ROLE_LABEL[role]}
                      </span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{text}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-wrap justify-end gap-2 border-t border-line pt-4 sm:col-span-2">
              <Button type="button" variant="secondary" onClick={() => setInviting(false)} disabled={pending}>
                Cancelar
              </Button>
              <Button type="submit" loading={pending} loadingText="Enviando…">
                Enviar invitación
              </Button>
            </div>
          </form>
        </Card>
      )}

      {users.length === 0 ? (
        <EmptyState title="No hay usuarios" hint="Invitá al primero con el botón de arriba." />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,1fr)_11rem_10rem_6rem] gap-4 border-b border-line bg-surface-2/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-soft md:grid">
            <span>Persona</span>
            <span className="text-center">Rol</span>
            <span className="text-center">Último ingreso</span>
            <span className="text-center">Acciones</span>
          </div>
          <ul className="divide-y divide-line">
            {users.map((user) => {
              const isMe = user.id === currentUserId;
              return (
                <li key={user.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 md:grid-cols-[minmax(0,1fr)_11rem_10rem_6rem]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
                      {(user.fullName || user.email).slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-ink">{user.fullName || user.email.split("@")[0]}</span>
                        {isMe && <Badge tone="green">Vos</Badge>}
                        {user.pending && <Badge>Pendiente</Badge>}
                      </div>
                      <p className="truncate text-sm text-ink-soft">{user.email}</p>
                    </div>
                  </div>
                  {isMe ? (
                    // Tu propio rol no se puede cambiar: se muestra como texto, no como campo.
                    <span className="col-span-2 row-start-2 text-sm font-semibold text-ink md:col-span-1 md:row-start-auto md:text-center">
                      {ROLE_LABEL[user.role]}
                    </span>
                  ) : (
                    <Select
                      aria-label={`Rol de ${user.email}`}
                      value={user.role}
                      disabled={pending}
                      onChange={(event) => setChangingRole({ user, role: event.target.value as Role })}
                      className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto"
                    >
                      {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABEL[role]}
                        </option>
                      ))}
                    </Select>
                  )}
                  <span className="hidden text-center text-sm text-ink-soft md:block">{user.lastSignInAt ? formatDateTime(user.lastSignInAt) : "Nunca"}</span>
                  <div className="col-start-2 row-start-1 flex justify-end gap-1.5 md:col-start-auto md:row-start-auto md:justify-center">
                    {user.pending ? (
                      <Button size="sm" variant="secondary" disabled={pending} onClick={() => setResending(user)}>
                        <Mail className="h-4 w-4" /> Reenviar invitación
                      </Button>
                    ) : (
                      <IconButton label="Enviar enlace para entrar o cambiar la contraseña" disabled={pending} onClick={() => setResending(user)}>
                        <Mail className="h-4 w-4" />
                      </IconButton>
                    )}
                    {!isMe && (
                      <IconButton label="Quitar acceso" disabled={pending} onClick={() => setRemoving(user)} className="hover:text-[var(--color-danger)]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <ConfirmDialog
        open={changingRole !== null}
        title={`¿Cambiar el rol de ${changingRole?.user.email ?? ""}?`}
        message={changingRole ? `Pasa a ser ${ROLE_LABEL[changingRole.role]}. ${ROLE_INFO.find((info) => info.role === changingRole.role)?.text ?? ""}` : undefined}
        confirmLabel="Cambiar rol"
        loading={pending}
        onCancel={() => setChangingRole(null)}
        onConfirm={() => changingRole && run(() => updateUserRole(changingRole.user.id, changingRole.role), () => setChangingRole(null))}
      />

      <ConfirmDialog
        open={resending !== null}
        title={resending?.pending ? "¿Reenviar la invitación?" : "¿Enviar un enlace de acceso?"}
        message={
          resending
            ? resending.pending
              ? `Le llega a ${resending.email} un mail nuevo con el enlace para entrar al panel y elegir su contraseña.`
              : `Le llega a ${resending.email} un mail con un enlace para entrar al panel y elegir una contraseña nueva. Sirve si se la olvidó. Su contraseña actual sigue funcionando hasta que la cambie.`
            : undefined
        }
        confirmLabel="Enviar mail"
        loading={pending}
        onCancel={() => setResending(null)}
        onConfirm={() => resending && run(() => resendAccess(resending.id), () => setResending(null))}
      />

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
