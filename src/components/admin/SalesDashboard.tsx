import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign, FileText, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
}

export const SalesDashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setInvoices(data || []);
      const total = data?.reduce((sum, inv) => sum + parseFloat(inv.total_amount.toString()), 0) || 0;
      setTotalRevenue(total);
    } catch (error: any) {
      toast({
        title: "Error loading invoices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">
            ₹{totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent">{invoices.length}</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">Average Invoice</p>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">
            ₹{invoices.length > 0 ? (totalRevenue / invoices.length).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-2xl font-bold mb-6">Recent Invoices</h3>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass rounded-lg border border-white/10 hover:border-primary/30 transition-all"
            >
              <div className="flex-1">
                <p className="font-semibold text-lg">{invoice.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.customer_phone}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(invoice.created_at), "MMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">
                  #{invoice.invoice_number}
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₹{parseFloat(invoice.total_amount.toString()).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No invoices generated yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
