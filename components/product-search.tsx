"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductSearch } from "@/hooks/use-product-search";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductSearchProps {
  className?: string;
}

export function ProductSearch({ className }: ProductSearchProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { searchQuery, setSearchQuery, searchResults, isLoading } =
    useProductSearch();
  const router = useRouter();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  const handleProductSelect = (productHandle: string) => {
    setOpen(false);
    setInputValue("");
    router.push(`/products/${productHandle}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 pr-10 md:w-[300px] lg:w-[400px]"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setOpen(e.target.value.length > 0);
              }}
              onFocus={() => inputValue.length > 0 && setOpen(true)}
            />
            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-7 w-7 p-0"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </form>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search products..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {isLoading && <CommandEmpty>Searching...</CommandEmpty>}
              {!isLoading && searchResults.length === 0 && inputValue && (
                <CommandEmpty>No products found.</CommandEmpty>
              )}
              {!isLoading && searchResults.length > 0 && (
                <CommandGroup
                  heading={`${searchResults.length} products found`}
                >
                  {searchResults.slice(0, 8).map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.handle}
                      onSelect={() => handleProductSelect(product.handle)}
                      className="flex items-center gap-3 p-3"
                    >
                      <img
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          ${product.price}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                  {searchResults.length > 8 && (
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        router.push(
                          `/search?q=${encodeURIComponent(inputValue.trim())}`
                        );
                      }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      View all {searchResults.length} results
                    </CommandItem>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
