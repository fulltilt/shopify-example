"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
} from "@/hooks/use-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CartPage() {
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

  const handleShopifyCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      toast.error("Error", {
        description: "Unable to proceed to checkout. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="h-24 w-24 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet. Start
            shopping to fill it up!
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = cart.total;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary" className="text-sm">
            {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.variant.title}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeFromCart.isPending}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              updateCartItem.isPending || item.quantity <= 1
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updateCartItem.isPending}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">
                      🎉 You qualify for free shipping!
                    </p>
                  )}
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleShopifyCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout powered by Shopify
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Free shipping on orders $50+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
