/**
 * Efizientia SaaS · client/src/lib/api.ts
 * Thin wrapper sobre fetch con credentials:include y manejo básico de errores.
 */

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data?.error ?? `Error ${res.status}`);
  }

  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    me: () => apiFetch<{ id: number; email: string; role: string; name: string }>("/api/auth/me"),
    login: (email: string, password: string) =>
      apiFetch<{ id: number; email: string; role: string; name: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    logout: () => apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" }),
    changePassword: (current_password: string, new_password: string) =>
      apiFetch<{ ok: boolean }>("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ current_password, new_password }),
      }),
  },

  profiles: {
    list: () => apiFetch<unknown[]>("/api/profiles"),
    get: (slug: string) => apiFetch<unknown>(`/api/profiles/${slug}`),
  },

  panel: {
    me: () => apiFetch<unknown>("/api/panel/me"),
    update: (data: Record<string, unknown>) =>
      apiFetch<unknown>("/api/panel/me", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    createProfile: (slug: string, display_name: string) =>
      apiFetch<unknown>("/api/panel/profile", {
        method: "POST",
        body: JSON.stringify({ slug, display_name }),
      }),
  },

  admin: {
    comerciales: {
      list: () => apiFetch<unknown[]>("/api/admin/comerciales"),
      get: (id: number) => apiFetch<unknown>(`/api/admin/comerciales/${id}`),
      create: (data: Record<string, unknown>) =>
        apiFetch<unknown>("/api/admin/comerciales", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      update: (id: number, data: Record<string, unknown>) =>
        apiFetch<unknown>(`/api/admin/comerciales/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),
      delete: (id: number) =>
        apiFetch<{ ok: boolean }>(`/api/admin/comerciales/${id}`, { method: "DELETE" }),
      invite: (id: number, email: string) =>
        apiFetch<{ ok: boolean; message: string; link?: string }>(
          `/api/admin/comerciales/${id}/invite`,
          { method: "POST", body: JSON.stringify({ email }) }
        ),
      createAccount: (id: number, email: string, password: string) =>
        apiFetch<{ ok: boolean; user: unknown }>(
          `/api/admin/comerciales/${id}/crear-cuenta`,
          { method: "POST", body: JSON.stringify({ email, password }) }
        ),
    },
    users: {
      list: () => apiFetch<unknown[]>("/api/admin/users"),
      setStatus: (id: number, status: string) =>
        apiFetch<{ ok: boolean }>(`/api/admin/users/${id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status }),
        }),
      create: (data: { email: string; name: string; role: string; invite_profile_id?: number }) =>
        apiFetch<{ ok: boolean; user: unknown; link: string }>("/api/admin/users/crear", {
          method: "POST",
          body: JSON.stringify(data),
        }),
      delete: (id: number) =>
        apiFetch<{ ok: boolean }>(`/api/admin/users/${id}`, { method: "DELETE" }),
      setPassword: (id: number, password: string) =>
        apiFetch<{ ok: boolean }>(`/api/admin/users/${id}/password`, {
          method: "PUT",
          body: JSON.stringify({ password }),
        }),
      reinvite: (id: number) =>
        apiFetch<{ ok: boolean; message: string; link?: string }>(`/api/admin/users/${id}/reinvite`, {
          method: "POST",
        }),
    },
    invitation: {
      accept: (token: string, password: string) =>
        apiFetch<{ ok: boolean; message: string }>("/api/auth/invitation/accept", {
          method: "POST",
          body: JSON.stringify({ token, password }),
        }),
    },
  },

  upload: {
    avatar: async (file: File): Promise<{ url: string }> => {
      const form = new FormData();
      form.append("avatar", file);
      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        credentials: "include",
        body: form,
        // No poner Content-Type — el browser lo pone con boundary
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new ApiError(res.status, data?.error ?? "Error al subir imagen");
      return data as { url: string };
    },
  },
};
