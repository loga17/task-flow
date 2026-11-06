import NavBar from "@/components/NavBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100vh-4rem)] bg-base-200">{children}</main>
    </>
  );
}