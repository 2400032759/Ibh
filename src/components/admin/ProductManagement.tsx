import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  product_name: string;
  description: string | null;
  price: number;
}

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setPrice("");
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    if (!productName || !price) return;

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update({
            product_name: productName,
            description: description || null,
            price: parseFloat(price),
          })
          .eq("id", editingProduct.id);

        if (error) throw error;
        toast({ title: "Product updated!" });
      } else {
        const { error } = await supabase
          .from("products")
          .insert({
            product_name: productName,
            description: description || null,
            price: parseFloat(price),
          });

        if (error) throw error;
        toast({ title: "Product added!" });
      }

      resetForm();
      setOpen(false);
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.product_name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Product deleted!" });
      loadProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glass">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  className="glass border-white/20 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                  className="glass border-white/20 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="glass border-white/20 focus:border-primary/50"
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!productName || !price}
                className="w-full bg-gradient-primary hover:opacity-90 shadow-glass"
              >
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 glass rounded-lg hover:border-primary/30 transition-all border border-white/10"
          >
            <div className="flex-1">
              <h3 className="font-semibold">{product.product_name}</h3>
              {product.description && (
                <p className="text-sm text-muted-foreground">{product.description}</p>
              )}
              <p className="text-lg font-bold text-primary mt-1">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleEdit(product)}
                className="glass border-white/20 hover:border-primary/50"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleDelete(product.id)}
                className="glass border-white/20 hover:border-destructive/50"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No products yet. Add your first product to get started.
          </p>
        )}
      </div>
    </div>
  );
};
