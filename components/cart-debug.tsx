"use client";

import { useCart } from "@/hooks/use-cart";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CartDebug() {
  const { data: cart, isLoading, error } = useCart();
  const [cartId, setCartId, isLocalStorageLoaded] = useLocalStorage<
    string | null
  >("shopify-cart-id", null);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const clearCart = () => {
    setCartId(null);
    window.location.reload();
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-sm">🐛 Cart Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>LocalStorage Loaded:</strong>{" "}
          {isLocalStorageLoaded ? "✅ Yes" : "❌ No"}
        </div>
        <div>
          <strong>Cart ID:</strong> {cartId || "None"}
        </div>
        <div>
          <strong>Cart Loading:</strong>{" "}
          {isLoading ? "⏳ Loading" : "✅ Loaded"}
        </div>
        <div>
          <strong>Cart Items:</strong> {cart?.itemCount || 0}
        </div>
        <div>
          <strong>Cart Total:</strong> ${cart?.total?.toFixed(2) || "0.00"}
        </div>
        {error && (
          <div>
            <strong>Error:</strong> {error.message}
          </div>
        )}
        <Button size="sm" variant="outline" onClick={clearCart}>
          Clear Cart & Reload
        </Button>
      </CardContent>
    </Card>
  );
}
