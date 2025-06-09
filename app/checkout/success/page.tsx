"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Package, Mail } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CheckoutSuccessPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear the cart after successful checkout
    localStorage.removeItem("shopify-cart-id");
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  }, [queryClient]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Order Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Thank you for your purchase!
              </h2>
              <p className="text-muted-foreground">
                Your order has been successfully placed and is being processed.
                You will receive an email confirmation with your order details
                and tracking information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">Email Confirmation</p>
                    <p className="text-muted-foreground">Check your inbox</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-orange-500" />
                  <div className="text-left">
                    <p className="font-medium">Order Processing</p>
                    <p className="text-muted-foreground">Being prepared</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Your order will be processed within 1-2 business days</li>
                <li>• You'll get tracking information once shipped</li>
                <li>• Estimated delivery: 3-7 business days</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Questions about your order?{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
