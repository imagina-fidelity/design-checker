import { signIn } from "@/auth";
import ImaginaLogo from "@/components/ImaginaLogo";
import SignInButton from "@/components/SignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
          width: "100%",
          maxWidth: "320px",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <ImaginaLogo
            style={{
              height: "80px",
              width: "auto",
              color: "var(--text-secondary)",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}
          >
            Design Checker
          </span>
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <form
            style={{ width: "100%" }}
            action={async () => {
              "use server";
              await signIn("microsoft-entra-id", {
                redirectTo: callbackUrl ?? "/",
              });
            }}
          >
            <SignInButton />
          </form>
          <p style={{ fontSize: "11px", color: "var(--text-tertiary)", textAlign: "center", margin: 0 }}>
            Access is restricted to Imagina staff.
          </p>
        </div>
      </div>
    </div>
  );
}
