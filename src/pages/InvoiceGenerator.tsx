import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, FileDown, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="container mx-auto p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={() => navigate("/dashboard")} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Create Invoice
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Customer address"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Select Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold">{product.product_name}</p>
                    <p className="text-sm text-primary">${product.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addItem(product)}
                    className="bg-gradient-accent hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 shadow-soft">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold">{item.product.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.product.id, parseInt(e.target.value) || 0)
                    }
                    className="w-20"
                  />
                  <p className="font-bold text-primary w-24 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeItem(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {selectedItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No items added yet. Select products from the list above.
                </p>
              )}
              {selectedItems.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-xl font-bold">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={generateInvoice}
            disabled={loading || selectedItems.length === 0}
            className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-5 w-5" />
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
