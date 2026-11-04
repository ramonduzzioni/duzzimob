import { CrmNavbar } from "@/components/crm/navbar";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200 selection:bg-[#ccff00] selection:text-black">
      <CrmNavbar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
