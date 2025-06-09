"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { CartSheet } from "@/components/cart-sheet";

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">
              Your Brand
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/products"
              className="transition-colors hover:text-foreground/80"
            >
              Products
            </Link>
            <Link
              href="/collections"
              className="transition-colors hover:text-foreground/80"
            >
              Collections
            </Link>
            <Link
              href="/cart"
              className="transition-colors hover:text-foreground/80"
            >
              Cart
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground/80"
            >
              Contact
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl">Your Brand</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/products" className="text-foreground/70">
                  Products
                </Link>
                <Link href="/collections" className="text-foreground/70">
                  Collections
                </Link>
                <Link href="/cart" className="text-foreground/70">
                  Cart
                </Link>
                <Link href="/about" className="text-foreground/70">
                  About
                </Link>
                <Link href="/contact" className="text-foreground/70">
                  Contact
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </>
            ) : (
              <UserButton afterSignOutUrl="/" />
            )}

            <CartSheet />
          </nav>
        </div>
      </div>
    </header>
  );
}
