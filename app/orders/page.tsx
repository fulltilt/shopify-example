"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useOrders, type Order } from "@/hooks/use-orders";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "fulfilled":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "unfulfilled":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "partial":
      return <Truck className="h-4 w-4 text-blue-500" />;
    default:
      return <Package className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "refunded":
      return "bg-red-100 text-red-800";
    case "fulfilled":
      return "bg-green-100 text-green-800";
    case "unfulfilled":
      return "bg-yellow-100 text-yellow-800";
    case "partial":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Order #{order.orderNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.processedAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">
              ${Number.parseFloat(order.totalPrice.amount).toFixed(2)}
            </p>
            <div className="flex gap-2 mt-1">
              <Badge
                className={getStatusColor(order.financialStatus)}
                variant="secondary"
              >
                {order.financialStatus}
              </Badge>
              <Badge
                className={getStatusColor(order.fulfillmentStatus)}
                variant="secondary"
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(order.fulfillmentStatus)}
                  {order.fulfillmentStatus}
                </div>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.lineItems.map((item, index) => (
            <div key={index}>
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded">
                  <Image
                    src={item.variant.image?.url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.variant.product.handle}`}
                    className="font-medium hover:underline line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    ${Number.parseFloat(item.variant.price.amount).toFixed(2)}{" "}
                    each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    $
                    {(
                      Number.parseFloat(item.variant.price.amount) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              {index < order.lineItems.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/products`}>Shop Again</Link>
            </Button>
            {order.fulfillmentStatus.toLowerCase() === "fulfilled" && (
              <Button variant="outline" size="sm">
                Track Package
              </Button>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const { user, isLoaded } = useUser();
  const { data: orders, isLoading, error } = useOrders();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-8">
            You need to be signed in to view your order history.
          </p>
          <SignInButton mode="modal">
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Orders</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't load your order history. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start shopping to see your
              order history here.
            </p>
            <Button asChild size="lg">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">
              {orders.length} {orders.length === 1 ? "order" : "orders"} for{" "}
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Need help with an order? Contact our support team.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
