import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { type CSSProperties, type ReactNode, useState, useEffect, useCallback } from "react";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SALONS, waLinkFor, waLink, getSalonIdFromName } from "@/lib/salon-data";
import logoAsset from "@/assets/DESMOHAIR.jpg";
import homeIcon from "@/assets/icone/page-daccueil.svg";
import servicesIcon from "@/assets/icone/soutien-technique.svg";
import galleryIcon from "@/assets/icone/galerie-dimages.svg";
import catalogIcon from "@/assets/icone/catalogue.svg";
import contactIcon from "@/assets/icone/contact.svg";
import profileIcon from "@/assets/icone/profil.svg";
import { X, Bell, ShoppingCart } from "lucide-react";
import { supabase } from "@/backend/client";
import { notificationService, authService } from "@/backend/services";
import { useCart } from "@/context/CartContext";
import type { CartItem, Notification } from "@/backend/models";

const NAV = [
  { to: "/", label: "Accueil", icon: homeIcon, color: "var(--gold-deep)" },
  { to: "/services", label: "Services", icon: servicesIcon, color: "var(--crimson)" },
  { to: "/gallery", label: "Galerie", icon: galleryIcon, color: "var(--gold)" },
  { to: "/catalog", label: "Catalogue", icon: catalogIcon, color: "var(--gold-deep)" },
  { to: "/contact", label: "Contact", icon: contactIcon, color: "var(--crimson)" },
  { to: "/profile", label: "Profil", icon: profileIcon, color: "var(--gold)" },
] as const;

export function WhatsAppIcon({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" overflow="visible" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export function AppShell({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { items: cartItems, totalItems, clearCart } = useCart();

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("[AppShell] notifications error:", error);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    let user: { id: string } | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch (e) {
      console.error("[AppShell] getUser error:", e);
    } finally {
      setIsAuthenticated(!!user);
    }
    if (!user) {
      setUserRole(null);
      return;
    }
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(profile?.role ?? null);
    } catch (e) {
      console.error("[AppShell] profile fetch error:", e);
      setUserRole(null);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      void checkAuth();
      if (event === 'SIGNED_OUT') {
        setNotifications([]);
        setCartOpen(false);
        setNotifOpen(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  useEffect(() => {
    if (!isAuthenticated) return;
    void refreshNotifications();
  }, [isAuthenticated, refreshNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        void refreshNotifications();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, refreshNotifications]);

  const handleDeleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.delete(id);
      await refreshNotifications();
    } catch (error) {
      console.error('[AppShell] delete notification error:', error);
    }
  }, [refreshNotifications]);

  if (!routerState) {
    return (
      <div className="relative mx-auto min-h-screen max-w-md overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[var(--gold)]/30 border-t-[var(--gold)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-md overflow-hidden md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mx-auto max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[var(--gold-soft)] opacity-25 blur-3xl" />
        <div className="absolute bottom-10 left-1/4 h-60 w-60 rounded-full bg-[var(--gold-soft)] opacity-20 blur-3xl" />
      </div>

      <header className="sticky top-5 z-30 px-3 pt-2 pb-2 md:top-6 md:px-4 md:pt-3 md:pb-3 lg:top-8 lg:px-5 lg:pt-4 lg:pb-4 gpu-accelerated">
        <div className="glass-strong flex items-center justify-between rounded-full px-3 py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-white shadow-soft ring-1 ring-black/5 md:h-10 md:w-10">
              <img src={logoAsset} alt="Desmohair" className="h-full w-full object-contain p-0.5" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.06em] md:text-xs md:tracking-[0.08em] rainbow-text">Desmohair</p>
              <p className="text-[8px] text-muted-foreground md:text-[10px] rainbow-text">Parfait Design</p>
            </div>
          </Link>
          <div className="relative flex items-center gap-1.5 md:gap-2">
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative grid h-8 w-8 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 md:h-9 md:w-9 lg:h-10 lg:w-10"
                  style={{
                    background: "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
                    backdropFilter: "blur(18px) saturate(180%)",
                    border: "1px solid oklch(1 0 0 / 0.85)",
                    boxShadow: "0 8px 20px -10px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)",
                  }}
                  aria-label="Notifications"
                >
                  <Bell className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5" style={{ color: "var(--gold-deep)" }} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[7px] font-semibold text-white md:h-3.5 md:w-3.5 md:text-[8px] lg:h-4 lg:w-4 lg:text-[9px]">
                      {notifications.length > 9 ? "9+" : notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed left-3 right-3 top-16 z-50 max-h-96 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl md:absolute md:left-1/2 md:right-auto md:top-full md:mt-2 md:w-80 md:-translate-x-1/2"
                  >
                    <div className="flex items-center justify-between border-b border-stone-100 p-3 md:p-4">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground">Notifications</h3>
                      <button type="button" onClick={() => setNotifOpen(false)} className="rounded-full p-1 hover:bg-stone-100 transition">
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 md:p-8 text-center text-xs md:text-sm text-muted-foreground">Aucune notification</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="border-b border-stone-50 p-3 md:p-4 last:border-b-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-semibold text-foreground">{notif.title}</p>
                                <p className="mt-1 text-[10px] md:text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                              </div>
                              <span className="shrink-0 text-[9px] md:text-[10px] text-muted-foreground">
                                {new Date(notif.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNotification(notif.id)}
                                className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition"
                                aria-label="Supprimer la notification"
                              >
                                <X className="h-3 w-3 md:h-3.5 md:w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <a
              href={waLink()}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="relative grid h-8 w-8 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 md:h-9 md:w-9 lg:h-10 lg:w-10"
               style={{
                 background: "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
                 backdropFilter: "blur(18px) saturate(180%)",
                 border: "1px solid oklch(1 0 0 / 0.85)",
                 boxShadow: "0 8px 20px -10px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)",
               }}
            >
              <WhatsAppIcon className="h-4 w-4 md:h-5 md:w-5 lg:h-5 lg:w-5" style={{ color: "#25D366" }} />
            </a>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate({ to: '/login' });
                  return;
                }
                setCartOpen(true);
              }}
              className="relative grid h-8 w-8 place-items-center rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 md:h-9 md:w-9 lg:h-10 lg:w-10"
              style={{
                background: "linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.55))",
                backdropFilter: "blur(18px) saturate(180%)",
                border: "1px solid oklch(1 0 0 / 0.85)",
                boxShadow: "0 8px 20px -10px rgba(37,211,102,0.55), inset 0 1px 0 oklch(1 0 0 / 0.8)",
              }}
              aria-label="Panier"
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5" style={{ color: "var(--gold-deep)" }} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[7px] font-semibold text-white md:h-3.5 md:w-3.5 md:text-[8px] lg:h-4 lg:w-4 lg:text-[9px] z-50 ring-2 ring-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
        {title && (
          <div className="mt-4 px-1 md:mt-5">
            <h1 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-xs md:text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </header>

      <main className="px-3 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pt-3 md:pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pt-4 lg:pb-[calc(6rem+env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-[60vh] gpu-accelerated"
        >
          {children}
        </motion.div>
      </main>

      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-1 md:max-w-lg md:px-4 md:pb-[calc(0.8rem+env(safe-area-inset-bottom))] md:pt-1.5 lg:max-w-xl lg:px-6 lg:pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pt-2">
        <div className="glass-nav flex items-center justify-between rounded-full px-1 py-1 md:px-1.5 md:py-1.5 lg:px-2 lg:py-2">
          {NAV.map(({ to, label, icon, color }) => (
            <NavItem
              key={to}
              to={to}
              label={label}
              icon={icon}
              color={color}
              pathname={pathname}
            />
          ))}
        </div>
      </nav>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

const NavItem = React.memo(function NavItem({
  to,
  label,
  icon,
  color,
  pathname,
}: {
  to: (typeof NAV)[number]["to"];
  label: (typeof NAV)[number]["label"];
  icon: (typeof NAV)[number]["icon"];
  color: (typeof NAV)[number]["color"];
  pathname: string;
}) {
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <Link
      to={to}
      preload="intent"
      className="nav-item group relative flex flex-1 flex-col items-center justify-center rounded-full px-0.5 py-1 transition-all duration-150 active:scale-95 md:px-1 md:py-1.5 lg:px-1.5 lg:py-2"
    >
      {active && (
        <span className="nav-active-bg absolute inset-0 rounded-full" />
      )}
      <span className="nav-icon relative grid h-6 w-6 place-items-center rounded-full md:h-7 md:w-7 lg:h-8 lg:w-8">
        <img
          src={icon}
          alt=""
          className="h-4 w-4 object-contain md:h-[18px] md:w-[18px] lg:h-5 lg:w-5"
          style={{
            opacity: active ? 1 : 0.7,
            filter: active ? "drop-shadow(0 1px 2px rgba(0,0,0,0.18))" : "grayscale(0.2) brightness(0.85)",
          }}
          loading="eager"
          decoding="async"
        />
      </span>
      <span
        className="nav-label mt-0.5 whitespace-nowrap text-[8px] font-semibold uppercase tracking-wider transition-all duration-150 md:text-[9px] lg:text-[10px]"
        style={{ color: active ? color : "oklch(0.45 0.015 60)" }}
      >
        {label}
      </span>
    </Link>
  );
});

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass rounded-[28px] ${className}`}>{children}</div>;
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mt-5 mb-2 flex items-end justify-between px-1">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {action}
    </div>
  );
}

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, updateQuantity, removeItem, clearCart, error: cartError } = useCart();
  const formatFCFA = (price: number) => {
    return new Intl.NumberFormat("fr-BF", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const total = items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

  const buildWaMessage = () => {
    const lines = items.map((i) => {
      const code = i.code ? ` [Code: ${i.code}]` : "";
      return `• ${i.title} x${i.quantity}${code} — ${formatFCFA(i.price ?? 0)}`;
    });
    return `Bonjour, je souhaite commander :\n\n${lines.join("\n")}\n\nTotal : ${formatFCFA(total)}.`;
  };

  const getItemRoute = (item: CartItem) => {
    const t = (item.item_type ?? "catalog") as string;
    if (t === "catalog") return "/catalog";
    if (t === "service") return "/services";
    return "/catalog";
  };

  const getItemLabel = (item: CartItem) => {
    const t = (item.item_type ?? "catalog") as string;
    if (t === "catalog") return "Voir le catalogue";
    if (t === "service") return "Voir les services";
    return "Voir";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 0.6 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl will-change-transform gpu-accelerated"
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200">
              <h3 className="font-display text-lg font-semibold">Panier</h3>
              <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-stone-100 transition">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {cartError && (
              <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {cartError}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm"
                    >
                      {item.image_url ? (
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                          <img src={item.image_url} alt={item.title} className="h-full w-full object-contain" loading="lazy" />
                        </div>
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-stone-100">
                          <ShoppingCart className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.salon_name ?? ''}</p>
                        {(item as any).code && (
                          <p className="text-[10px] font-mono font-semibold text-[var(--gold-deep)]">Code: {(item as any).code}</p>
                        )}
                        {item.price ? (
                          <p className="text-sm font-bold text-gold">{formatFCFA(item.price)}</p>
                        ) : null}
                        <Link
                          to={getItemRoute(item)}
                          onClick={onClose}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {getItemLabel(item)}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 active:scale-95 transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 active:scale-95 transition"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition active:scale-95"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-stone-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-gold">{formatFCFA(total)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="flex-1 rounded-full border border-stone-300 py-2 text-sm font-medium text-muted-foreground hover:bg-stone-100 transition"
                  >
                    Vider
                  </button>
                  <a
                    href={waLinkFor('parfait', buildWaMessage())}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-full bg-green-500 py-2 text-center text-sm font-semibold text-white hover:bg-green-600 transition active:scale-[0.97]"
                  >
                    Commander
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
