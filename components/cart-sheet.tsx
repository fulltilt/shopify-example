"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/hooks/use-cart";
import { toast } from "sonner";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { data: cart, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    try {
      await updateCartItem.mutateAsync({ lineId, quantity: newQuantity });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update cart item",
      });
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    try {
      await removeFromCart.mutateAsync(lineId);
      toast.success("Item removed", {
        description: "Item has been removed from your cart",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to remove item from cart",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cart && cart.itemCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
            >
              {cart.itemCount}
            </Badge>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({cart?.itemCount || 0})</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-xl font-semibold">Your cart is empty</div>
            <div className="text-muted-foreground">
              Add items to get started
            </div>
            <Button asChild className="mt-4">
              <Link href="/products" onClick={() => setOpen(false)}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto pr-6">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex items-start space-x-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-medium line-clamp-1">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.variant.title}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={updateCartItem.isPending}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updateCartItem.isPending}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={removeFromCart.isPending}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex">
                  <span className="flex-1">Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex">
                  <span className="flex-1 font-medium">Total</span>
                  <span className="font-medium">${cart.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <a
                    href={cart.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Checkout
                  </a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/cart" onClick={() => setOpen(false)}>
                    View Full Cart
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
