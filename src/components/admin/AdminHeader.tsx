"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function AdminHeader() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-end gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {session?.user?.name || "Admin"}
            </p>
            <p className="text-xs text-muted-foreground">
              {session?.user?.email || ""}
            </p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-maroon/20">
            <AvatarFallback className="bg-maroon/10 text-maroon text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}