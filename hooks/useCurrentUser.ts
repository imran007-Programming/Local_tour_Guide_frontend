"use client";

import { useEffect, useState } from "react";
import { CLIENT_BASE_URL } from "@/lib/config";
import { User } from "@/types/user";

// Loads the signed-in user in the browser so public pages can stay static.
// The request goes through the /api/backend rewrite, which forwards the
// httpOnly auth cookies to the backend.

const AUTH_CHANGE_EVENT = "authchange";

let pending: Promise<User | null> | null = null;

function loadUser(force = false): Promise<User | null> {
  if (!pending || force) {
    pending = fetch(`${CLIENT_BASE_URL}/auth/me`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data?.data ? (data as User) : null))
      .catch(() => null);
  }
  return pending;
}

/** Call after logging in so every useCurrentUser() re-fetches. */
export function notifyAuthChanged() {
  pending = null;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/** Call when logging out to drop the cached user immediately. */
export function clearCurrentUser() {
  pending = Promise.resolve(null);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/** `undefined` while loading, `null` when signed out. */
export function useCurrentUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const sync = () => {
      loadUser().then((u) => {
        if (active) setUser(u);
      });
    };

    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
    };
  }, []);

  return user;
}
