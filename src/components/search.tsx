"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${query.trim()}`);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for a user..."
        className="pl-9 bg-background"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search for a GitHub user"
      />
    </form>
  );
}
