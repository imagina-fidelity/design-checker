import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  // Share the session cookie across all *.imagina.au subdomains
  ...(process.env.AUTH_COOKIE_DOMAIN && {
    cookies: {
      sessionToken: {
        name: "next-auth.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax" as const,
          path: "/",
          domain: process.env.AUTH_COOKIE_DOMAIN,
          secure: true,
        },
      },
    },
  }),
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      try {
        const redirectUrl = new URL(url);
        if (
          redirectUrl.hostname === "localhost" ||
          redirectUrl.hostname.endsWith(".imagina.au")
        ) {
          return url;
        }
      } catch {}
      return baseUrl;
    },
  },
});
