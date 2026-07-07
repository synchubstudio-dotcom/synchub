export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative z-10">
      {children}
    </main>
  );
}