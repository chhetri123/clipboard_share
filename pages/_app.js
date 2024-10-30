import { Inter } from "next/font/google";
import { AuthProvider } from "../providers/AuthProvider";

import "@/styles/globals.css"; // Move globals.css to styles directory

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <AuthProvider>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
