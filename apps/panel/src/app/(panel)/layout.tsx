import { PanelShell } from "@/components/panel/PanelShell";
import { SetupNotice } from "@/components/panel/SetupNotice";
import { requireProfile } from "@/lib/auth";
import { databaseConfigured, env, supabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = { ADMIN: "Administrador", EDITOR: "Editor" };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured() || !databaseConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <SetupNotice />
      </div>
    );
  }

  const profile = await requireProfile();

  return (
    <PanelShell
      role={profile.role}
      webUrl={env.PUBLIC_WEB_URL}
      user={{ name: profile.fullName ?? "", email: profile.email, role: ROLE_LABEL[profile.role] ?? profile.role }}
    >
      {children}
    </PanelShell>
  );
}
