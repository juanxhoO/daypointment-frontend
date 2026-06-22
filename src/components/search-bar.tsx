"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

// ---------------------------------------------------------------------------
// Generic, reusable filter bar for a table or list.
//
// Usage:
//   <SearchBar
//     items={users}
//     searchKeys={["name", "email"]}
//     placeholder="Search team members..."
//     onResultsChange={setFilteredUsers}
//   />
//
// The component owns the input + debounce + matching logic and reports
// filtered results back via onResultsChange, so it can sit in front of
// any list/table without that list needing to know about the search state.
// ---------------------------------------------------------------------------

type SearchBarProps<T> = {
    items: T[];
    searchKeys: (keyof T)[];
    placeholder?: string;
    debounceMs?: number;
    onResultsChange?: (results: T[]) => void;
    className?: string;
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebounced(value), delayMs);
        return () => window.clearTimeout(timeout);
    }, [value, delayMs]);

    return debounced;
}

export function filterItems<T>(items: T[], keys: (keyof T)[], query: string): T[] {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) =>
        keys.some((key) => {
            const value = item[key];
            if (value == null) return false;
            return String(value).toLowerCase().includes(normalized);
        })
    );
}

export default function SearchBar<T>({
    items,
    searchKeys,
    placeholder = "Search...",
    debounceMs = 250,
    onResultsChange,
    className = "",
}: SearchBarProps<T>) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebouncedValue(query, debounceMs);

    const results = useMemo(
        () => filterItems(items, searchKeys, debouncedQuery),
        [items, searchKeys, debouncedQuery]
    );

    useEffect(() => {
        onResultsChange?.(results);
    }, [results, onResultsChange]);

    const hasQuery = query.trim().length > 0;

    return (
        <div className={className}>
            <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

                {hasQuery && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {hasQuery && (
                <p className="mt-2 text-sm text-gray-500">
                    {results.length === 0
                        ? "No results found."
                        : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
                </p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Standalone demo wrapper. Remove this and the sample data below once you've
// wired SearchBar up to your own list — kept here so the component is
// runnable/previewable on its own.
// ---------------------------------------------------------------------------
type Member = { id: string; name: string; email: string; role: string };

const SAMPLE_MEMBERS: Member[] = [
    { id: "1", name: "Sarah Jenkins", email: "sarah@proworkspace.com", role: "Senior Product Consultant" },
    { id: "2", name: "Daniel Cho", email: "daniel@proworkspace.com", role: "Engineering Manager" },
    { id: "3", name: "Maya Lindqvist", email: "maya@proworkspace.com", role: "UX Researcher" },
    { id: "4", name: "Omar Haddad", email: "omar@proworkspace.com", role: "Account Executive" },
    { id: "5", name: "Priya Nair", email: "priya@proworkspace.com", role: "Data Analyst" },
    { id: "6", name: "Liam O'Connor", email: "liam@proworkspace.com", role: "Customer Support Lead" },
];

export function SearchBarDemo() {
    const [filtered, setFiltered] = useState<Member[]>(SAMPLE_MEMBERS);

    return (
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                </button>
            </div>

            <SearchBar
                items={SAMPLE_MEMBERS}
                searchKeys={["name", "email", "role"]}
                placeholder="Search by name, email, or role..."
                onResultsChange={setFiltered}
            />

            <ul className="mt-4 divide-y divide-gray-100">
                {filtered.map((member) => (
                    <li key={member.id} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {member.role}
                        </span>
                    </li>
                ))}
                {filtered.length === 0 && (
                    <li className="py-6 text-center text-sm text-gray-400">No team members match your search.</li>
                )}
            </ul>
        </div>
    );
}