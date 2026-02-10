"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  UserPlus,
  CalendarPlus,
  Mic,
  Search,
} from "lucide-react";
import { search } from "@/lib/api";
import type { SearchResult } from "@/types";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await search(query);
        setResults(data.results);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      setQuery("");
      command();
    },
    []
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search patients, navigate, or run actions..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {searching ? "Searching..." : "No results found."}
        </CommandEmpty>

        {results.length > 0 && (
          <CommandGroup heading="Patients">
            {results.map((r) => (
              <CommandItem
                key={r.patient_id}
                value={`patient-${r.patient_id}-${r.patient_name}`}
                onSelect={() =>
                  runCommand(() => router.push(`/patient/${r.patient_id}`))
                }
              >
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>{r.patient_name}</span>
                  {r.matched_snippets?.[0] && (
                    <span className="text-xs text-muted-foreground truncate max-w-[400px]">
                      {r.matched_snippets[0]}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/patients/add"))
            }
          >
            <UserPlus className="mr-2 h-4 w-4" />
            New Patient
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/appointments/add"))
            }
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            New Appointment
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/"))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/patients"))}
          >
            <Users className="mr-2 h-4 w-4" />
            Patients
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push("/appointments"))
            }
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
