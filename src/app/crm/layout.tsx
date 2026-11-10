import { CrmSidebar } from "@/components/crm/sidebar";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-200 selection:bg-[#ccff00] selection:text-black">
      <CrmSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
