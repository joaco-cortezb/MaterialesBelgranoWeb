import { AuthShell } from "@/components/auth/AuthShell";
import { ResetForm } from "./ResetForm";

export const dynamic = "force-dynamic";

export default function ResetPage() {
  return (
    <AuthShell title="Elegí tu contraseña" subtitle="Llegaste desde un enlace de invitación o recuperación. Definí una contraseña nueva para entrar al panel.">
      <ResetForm />
    </AuthShell>
  );
}
