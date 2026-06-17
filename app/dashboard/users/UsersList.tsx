"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MessageCircle, Filter, ArrowUpDown } from "lucide-react";
import BookingsPagination from "../bookings/BookingsPagination";
import { format } from "date-fns";
import Image from "next/image";
import ChatModal from "@/components/chat/ChatModal";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePic: string | null;
  createdAt: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({ isOpen: false, user: null });

  useEffect(() => {
    const fetchUsers = async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (roleFilter) params.append("role", roleFilter);

      const res = await authFetch(`${BASE_URL}/users?${params}`, {
        cache: "no-store",
      });

      if (res?.ok) {
        const result = await res.json();
        setUsers(result.data.data || []);
        const meta = result.data.meta;
        setTotalPages(Math.ceil(meta.total / meta.limit));
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [currentPage, searchTerm, roleFilter, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
      GUIDE: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      TOURIST: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    };
    return styles[role] || "bg-zinc-100 text-zinc-600";
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl h-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl h-10 gap-2 border-zinc-200 dark:border-zinc-800"
            >
              <Filter size={14} />
              {roleFilter || "All Roles"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setRoleFilter("")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("TOURIST")}>Tourist</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("GUIDE")}>Guide</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("ADMIN")}>Admin</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl h-10 gap-2 border-zinc-200 dark:border-zinc-800"
            >
              <ArrowUpDown size={14} />
              {sortBy === "createdAt" ? "Date" : sortBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("createdAt")}>Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("email")}>Email</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          className="rounded-xl h-10 w-10 p-0 border-zinc-200 dark:border-zinc-800"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
          No users found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Image
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {user.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${getRoleBadge(user.role)}`}
                >
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs text-zinc-400">
                  Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setChatModal({ isOpen: true, user })}
                  className="h-8 px-3 text-xs gap-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                >
                  <MessageCircle size={13} />
                  Chat
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <BookingsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

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
