"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { Item } from "@/types";
import { PlusCircle, Edit } from "lucide-react";

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export function ItemList({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { description: "", rate: 0 },
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  // Open dialog for adding or editing
  const handleEditClick = (item: Item) => {
    setEditingItem(item);
    reset({ description: item.description, rate: item.rate });
    setDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingItem(null);
    reset({ description: "", rate: 0 });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ItemFormValues) => {
    if (editingItem) {
      // UPDATE
      const { data, error } = await supabase
        .from("items")
        .update(values)
        .eq("id", editingItem.id)
        .select();

      if (error) {
        toast({ title: "Error updating item", description: error.message, variant: "destructive" });
      } else if (data) {
        toast({ title: "Item updated", description: "Item details updated successfully." });
        setItems(prev => prev.map(i => i.id === editingItem.id ? data[0] : i));
      }
    } else {
      // CREATE
      const { data, error } = await supabase.from("items").insert([values]).select();

      if (error) {
        toast({ title: "Error creating item", description: error.message, variant: "destructive" });
      } else if (data) {
        toast({ title: "Item created", description: "The new item has been added successfully." });
        setItems(prev => [...prev, ...data]);
      }
    }

    setDialogOpen(false);
    reset();
    setEditingItem(null);
    router.refresh();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Items</h1>
          <p className="text-muted-foreground">Manage your products and services here.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick} className="w-full sm:w-auto">
              <PlusCircle className="mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update the details of this item." : "Enter the details of the new item or service."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && (
                  <p className="text-destructive text-sm">{errors.description.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="rate">Rate</Label>
                <Input id="rate" type="number" step="0.01" {...register("rate")} />
                {errors.rate && <p className="text-destructive text-sm">{errors.rate.message}</p>}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setDialogOpen(false); reset(); setEditingItem(null); }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  {editingItem ? "Update Item" : "Save Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-4 overflow-x-auto">
          <Table className="w-full min-w-[400px]">
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((item) => (
                <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                <TableCell className="text-center">
                    <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEditClick(item)}
                    >
                        <Edit className="h-4 w-4" /> Edit
                    </Button>
                    </div>
                </TableCell>
                </TableRow>

                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No items found. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
