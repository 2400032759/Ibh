import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, FileDown, Loader2, User, Mail, Phone, MapPin } from "lucide-react";
import { generateInvoicePDF } from "@/lib/pdfGenerator";

interface Product {
  id: string;
  product_name: string;
  price: number;
}

interface InvoiceItem {
  product: Product;
  quantity: number;
}

const InvoiceGenerator = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("product_name");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addItem = (product: Product) => {
    const existing = selectedItems.find((item) => item.product.id === product.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setSelectedItems(
      selectedItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  };

  const generateInvoice = async () => {
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and add at least one product.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const invoiceNumber = `INV-${Date.now()}`;
      const total = calculateTotal();

      // Save invoice to database
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoiceNumber,
          customer_name: customerName,
          customer_address: customerAddress || null,
          customer_email: customerEmail || null,
          customer_phone: customerPhone,
          total_amount: total,
          created_by: user.id,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Save invoice items
      const items = selectedItems.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product.id,
        product_name: item.product.product_name,
        quantity: item.quantity,
        rate: item.product.price,
        total: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(items);

      if (itemsError) throw itemsError;

      // Generate PDF
      await generateInvoicePDF({
        invoiceNumber,
        customerName,
        customerAddress,
        customerEmail,
        customerPhone,
        items: selectedItems,
        total,
      });

      toast({
        title: "Invoice generated!",
        description: "PDF has been downloaded.",
      });

      // Reset form
      setCustomerName("");
      setCustomerAddress("");
      setCustomerEmail("");
      setCustomerPhone("");
      setSelectedItems([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto p-4 sm:p-8 relative z-10">
        <div className="glass-card p-6 mb-8 flex items-center gap-4">
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="outline" 
            size="icon"
            className="glass border-white/20 hover:border-accent/50"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Create Invoice
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Customer Details */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Name *
                </Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name"
                  className="glass border-white/20 focus:border-accent/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </Label>
                <Input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Customer address"
                  className="glass border-white/20 focus:border-accent/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                  className="glass border-white/20 focus:border-accent/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone *
                </Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone number"
                  className="glass border-white/20 focus:border-accent/50"
                />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold mb-6">Select Products</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 glass rounded-lg border border-white/10 hover:border-accent/30 transition-all"
                >
                  <div>
                    <p className="font-semibold">{product.product_name}</p>
                    <p className="text-sm text-primary font-bold">${product.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addItem(product)}
                    className="bg-gradient-accent hover:opacity-90 shadow-glass"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">Invoice Items</h2>
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 glass rounded-lg border border-white/10"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.product.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Qty:</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, parseInt(e.target.value) || 0)
                      }
                      className="w-20 glass border-white/20 focus:border-accent/50"
                    />
                  </div>
                  <p className="font-bold text-primary text-xl w-28 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeItem(item.product.id)}
                    className="glass border-white/20 hover:border-destructive/50"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {selectedItems.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No items added yet. Select products from the list above.
              </p>
            )}
            {selectedItems.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/10">
                <p className="text-2xl font-bold">Grand Total</p>
                <p className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={generateInvoice}
            disabled={loading || selectedItems.length === 0}
            className="bg-gradient-accent hover:opacity-90 text-white text-lg px-12 py-7 shadow-glass transition-all hover:scale-105 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-6 w-6" />
                Generate Invoice PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
