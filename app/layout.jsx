import "@/styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="hydrated">
      <body>{children}</body>
    </html>
  );
}
