"use client";

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6.5" height="6.5" fill="#f25022" />
      <rect x="8.5" y="1" width="6.5" height="6.5" fill="#7fba00" />
      <rect x="1" y="8.5" width="6.5" height="6.5" fill="#00a4ef" />
      <rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#ffb900" />
    </svg>
  );
}

export default function SignInButton() {
  return (
    <button
      type="submit"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        height: "40px",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--bg-border)",
        borderRadius: "4px",
        color: "var(--text-primary)",
        fontSize: "13px",
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "background-color 150ms ease, border-color 150ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-raised)";
        e.currentTarget.style.borderColor = "var(--text-tertiary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--bg-surface)";
        e.currentTarget.style.borderColor = "var(--bg-border)";
      }}
    >
      <MicrosoftIcon />
      Sign in with Microsoft
    </button>
  );
}
