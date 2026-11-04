import { CrmNavbar } from "@/components/crm/navbar";

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 flex flex-col selection:bg-[#ccff00] selection:text-black">
      <CrmNavbar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
