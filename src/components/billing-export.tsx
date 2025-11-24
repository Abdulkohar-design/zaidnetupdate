import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToWord } from "@/utils/word-export";

interface BillingExportProps {
  customers: any[];
  stats: any;
  employeeName: string;
}

export function BillingExport({ customers, stats, employeeName }: BillingExportProps) {
  const handleExport = () => {
    exportToWord(customers, stats, employeeName);
  };

  return (
    <Button 
      onClick={handleExport}
      variant="outline"
      className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
    >
      <Download className="h-4 w-4 mr-2" />
      Export ke Word
    </Button>
  );
}