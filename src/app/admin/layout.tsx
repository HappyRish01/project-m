"use client";

import { useState } from "react";
import AdminNav from "@/components/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {  DialogTitle } from "@radix-ui/react-dialog";
import { CartProvider } from "@/components/CartProvider";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <AdminNav />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <VisuallyHidden>
                <DialogTitle>Navigation</DialogTitle>
              </VisuallyHidden>
          <AdminNav onLinkClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto">
        {/* Mobile Header with Menu Button */}
        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64">
              <VisuallyHidden>
                <DialogTitle>Navigation</DialogTitle>
              </VisuallyHidden>
              <AdminNav onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>

            <header className="lg:hidden flex items-center h-16 px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h1 className="text-xl font-bold ml-4 text-gray-900">
                Admin Panel
              </h1>
            </header>
          </Sheet>
        )}
        <CartProvider>
        {children}
        </CartProvider>
      </main>
    </div>
  );
}
