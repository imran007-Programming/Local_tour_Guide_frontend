"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import Spinner from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  AtSign,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageCircle,
  MousePointerClick,
  Search,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import ChatModal from "@/components/chat/ChatModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string | null;
  createdAt: string;
}

const ROLES = [
  { value: "all", label: "All roles" },
  { value: "TOURIST", label: "Tourist" },
  { value: "GUIDE", label: "Guide" },
  { value: "ADMIN", label: "Admin" },
];

const SORTS = [
  { value: "createdAt", label: "Joined date" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
];

const ROLE_BADGE: Record<string, string> = {
  ADMIN: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
  GUIDE: "border-violet-200 bg-violet-50 text-violet-600 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400",
  TOURIST: "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
};

const AVATAR_TINTS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
];

function Avatar({ user }: { user: User }) {
  const [failed, setFailed] = useState(false);

  if (!user.profilePic || failed) {
    const initials = user.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const tint = AVATAR_TINTS[user.name.charCodeAt(0) % AVATAR_TINTS.length];
    return (
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${tint}`}>
        {initials || "?"}
      </span>
    );
  }
  return (
    <Image
      src={user.profilePic}
      alt={user.name}
      width={40}
      height={40}
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full object-cover"
    />
  );
}

/** 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const chip =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-3.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const pageBtn =
  "flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const th =
  "h-12 whitespace-nowrap border-r border-slate-200 px-4 text-left align-middle text-[13px] font-medium text-slate-500 last:border-r-0 dark:border-zinc-800 dark:text-zinc-400";
const td =
  "border-r border-slate-200 px-4 py-4 align-middle last:border-r-0 dark:border-zinc-800";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  // Any filter change goes back to page 1, otherwise page 3 of a 1-page result is empty
  const updateFilter = (apply: () => void) => {
    apply();
    setCurrentPage(1);
  };

  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      setFetching(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (roleFilter) params.append("role", roleFilter);

      const res = await authFetch(`${BASE_URL}/users?${params}`, {
        cache: "no-store",
      });

      // A newer request already replaced this one, so drop its answer
      if (cancelled) return;

      if (res?.ok) {
        const result = await res.json();
        if (cancelled) return;
        setUsers(result.data.data || []);
        const meta = result.data.meta;
        setTotalCount(meta.total);
        setTotalPages(Math.max(1, Math.ceil(meta.total / meta.limit)));
      } else {
        setUsers([]);
        setTotalCount(0);
        setTotalPages(1);
      }
      setLoading(false);
      setFetching(false);
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [currentPage, limit, searchTerm, roleFilter, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    );
  }

  const hasFilters = searchTerm || roleFilter;
  const from = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalCount);

  const goTo = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const roleLabel = ROLES.find((r) => r.value === (roleFilter || "all"))?.label;
  const sortLabel = SORTS.find((s) => s.value === sortBy)?.label;

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
        {/* Filters on the left */}
        <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={chip}>
              <ShieldCheck size={13} />
              Role{roleFilter ? `: ${roleLabel}` : ""}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={roleFilter || "all"}
              onValueChange={(v) => updateFilter(() => setRoleFilter(v === "all" ? "" : v))}
            >
              {ROLES.map((r) => (
                <DropdownMenuRadioItem key={r.value} value={r.value}>
                  {r.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={chip}>
              {sortOrder === "asc" ? <ArrowUpAZ size={13} /> : <ArrowDownAZ size={13} />}
              Sort: {sortLabel}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => updateFilter(() => setSortBy(v))}>
              {SORTS.map((s) => (
                <DropdownMenuRadioItem key={s.value} value={s.value}>
                  {s.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => updateFilter(() => setSortOrder(sortOrder === "asc" ? "desc" : "asc"))}
          className={chip}
          aria-label="Toggle sort direction"
        >
          {sortOrder === "asc" ? "A → Z" : "Z → A"}
        </button>

        {hasFilters && (
          <button
            onClick={() =>
              updateFilter(() => {
                setSearchTerm("");
                setRoleFilter("");
              })
            }
            className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <X size={13} />
            Reset
          </button>
        )}
        </div>

        {/* Search on the right, same row as the filters */}
        <div className="relative w-full sm:w-56 sm:shrink-0">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => updateFilter(() => setSearchTerm(e.target.value))}
            className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-900 outline-none ring-blue-500/30 transition placeholder:text-slate-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className={`flex-1 overflow-x-auto transition-opacity ${fetching ? "opacity-50" : "opacity-100"}`}>
        <table className="w-full min-w-[820px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60 dark:border-zinc-800 dark:bg-zinc-900/60">
              <th className={th}>
                <span className="inline-flex items-center gap-1.5"><UserIcon size={13} />Full name</span>
              </th>
              <th className={th}>
                <span className="inline-flex items-center gap-1.5"><AtSign size={13} />Email</span>
              </th>
              <th className={th}>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} />Role</span>
              </th>
              <th className={th}>
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />Joined date</span>
              </th>
              <th className={th}>
                <span className="inline-flex items-center gap-1.5"><MousePointerClick size={13} />Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm text-slate-500 dark:text-zinc-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                  >
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <Avatar user={user} />
                        <span className="whitespace-nowrap font-medium text-slate-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className={td}>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-slate-600 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-blue-400"
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className={td}>
                      <span
                        className={`inline-block rounded-md border px-2.5 py-1 text-[13px] font-medium ${
                          ROLE_BADGE[user.role] || "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className={`${td} whitespace-nowrap text-slate-600 dark:text-zinc-300`}>
                      {format(new Date(user.createdAt), "dd MMM yyyy, h:mm a")}
                    </td>
                    <td className={td}>
                      <button
                        onClick={() => setChatModal({ isOpen: true, user })}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-blue-500 hover:bg-blue-500 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 dark:hover:bg-blue-500 dark:hover:text-white"
                      >
                        <MessageCircle size={15} />
                        Chat
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-[13px] text-slate-500 sm:flex-row dark:border-zinc-800 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span>Rows per page</span>
          <Select
            value={String(limit)}
            onValueChange={(v) =>
              updateFilter(() => setLimit(Number(v)))
            }
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="h-7 w-16 rounded-md border-slate-200 px-2 text-xs shadow-none dark:border-zinc-700"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 25, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>
            {from}-{to} of {totalCount} rows
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className={pageBtn} onClick={() => goTo(1)} disabled={currentPage === 1} aria-label="First page">
            <ChevronsLeft size={14} />
          </button>
          <button className={pageBtn} onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
            <ChevronLeft size={14} />
          </button>
          {pageWindow(currentPage, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-slate-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`${pageBtn} ${
                  p === currentPage
                    ? "!border-blue-500 !bg-blue-500 font-medium !text-white"
                    : ""
                }`}
              >
                {p}
              </button>
            ),
          )}
          <button className={pageBtn} onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
            <ChevronRight size={14} />
          </button>
          <button className={pageBtn} onClick={() => goTo(totalPages)} disabled={currentPage === totalPages} aria-label="Last page">
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      {chatModal.user && (
        <ChatModal
          isOpen={chatModal.isOpen}
          onClose={() => setChatModal({ isOpen: false, user: null })}
          targetUser={chatModal.user}
        />
      )}
    </div>
  );
}
