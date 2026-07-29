import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { t as useToast } from "./useToast-sKNGuXCV.js";
import { t as Parfait_design_default } from "./Parfait design-DElxFSkO.js";
import { t as ThemeProvider } from "./ThemeContext-BRfi338G.js";
import { t as Route$10 } from "./catalog._category-CAZr3nnN.js";
import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
//#region src/components/Toaster.tsx
var icons = {
	success: CheckCircle2,
	error: XCircle,
	info: Info
};
function Toaster() {
	const { toasts } = useToast();
	return /* @__PURE__ */ jsx("div", {
		className: "fixed top-4 right-4 z-[70] flex w-full max-w-xs flex-col gap-2",
		children: /* @__PURE__ */ jsx(AnimatePresence, { children: toasts.map((toast) => {
			const Icon = icons[toast.type || "info"];
			const color = toast.type === "success" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : toast.type === "error" ? "text-red-600 border-red-200 bg-red-50" : "text-blue-600 border-blue-200 bg-blue-50";
			return /* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					x: 40,
					scale: .95
				},
				animate: {
					opacity: 1,
					x: 0,
					scale: 1
				},
				exit: {
					opacity: 0,
					x: 40,
					scale: .95
				},
				transition: {
					type: "spring",
					damping: 24,
					stiffness: 260
				},
				className: `rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${color}`,
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-2",
					children: [/* @__PURE__ */ jsx(Icon, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsxs("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-xs font-semibold",
							children: toast.title
						}), toast.description ? /* @__PURE__ */ jsx("p", {
							className: "mt-1 text-[11px] opacity-80",
							children: toast.description
						}) : null]
					})]
				})
			}, toast.id);
		}) })
	});
}
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-DCk_phz5.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(GlassButton, {
						as: Link,
						to: "/",
						variant: "light",
						size: "sm",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx(GlassButton, {
						type: "button",
						onClick: () => {
							router.invalidate();
							reset();
						},
						variant: "gold",
						size: "sm",
						children: "Try again"
					}), /* @__PURE__ */ jsx(GlassButton, {
						as: "a",
						href: "/",
						variant: "light",
						size: "sm",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "description",
				content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires."
			},
			{
				name: "author",
				content: "Desmohair"
			},
			{
				property: "og:title",
				content: "Desmohair — Salon Beauté Luxe Ouagadougou"
			},
			{
				property: "og:description",
				content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "Desmohair — Salon Beauté Luxe Ouagadougou"
			},
			{
				name: "twitter:description",
				content: "Salon de beauté premium à Ouagadougou : perruques, mèches, tresses, mariage, lissage et soins capillaires."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ff8fae22-db07-4bb9-bb26-615856da7f1a/id-preview-4134b9d1--478a0d4f-6199-4829-908b-4deecbe41996.lovable.app-1781518277219.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ff8fae22-db07-4bb9-bb26-615856da7f1a/id-preview-4134b9d1--478a0d4f-6199-4829-908b-4deecbe41996.lovable.app-1781518277219.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "icon",
				href: Parfait_design_default
			},
			{
				rel: "apple-touch-icon",
				href: Parfait_design_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "fr",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx(HeadContent, {}),
			/* @__PURE__ */ jsx("meta", {
				httpEquiv: "X-Content-Type-Options",
				content: "nosniff"
			}),
			/* @__PURE__ */ jsx("meta", {
				httpEquiv: "X-Frame-Options",
				content: "DENY"
			}),
			/* @__PURE__ */ jsx("meta", {
				httpEquiv: "X-XSS-Protection",
				content: "1; mode=block"
			}),
			/* @__PURE__ */ jsx("meta", {
				httpEquiv: "Referrer-Policy",
				content: "strict-origin-when-cross-origin"
			}),
			/* @__PURE__ */ jsx("meta", {
				name: "color-scheme",
				content: "light"
			})
		] }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(ThemeProvider, { children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster, {
			position: "top-right",
			richColors: true
		})] })
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$8 = () => import("./routes-DdSfye8G.js");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Desmohair — Accueil" },
		{
			name: "description",
			content: "Salon de beauté luxe à Ouagadougou : perruques, mèches, tresses, mariage."
		},
		{
			property: "og:title",
			content: "Desmohair"
		},
		{
			property: "og:description",
			content: "Votre beauté, notre passion."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$7 = () => import("./admin-DlHfGfOK.js");
var Route$7 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Administration — Parfait.Design/Desmohair" }, {
		name: "description",
		content: "Espace d'édition réservé aux administrateurs Parfait.Design/Desmohair"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/catalog.tsx
var $$splitComponentImporter$6 = () => import("./catalog-DhlnOdkq.js");
var Route$6 = createFileRoute("/catalog")({
	head: () => ({ meta: [
		{ title: "Catalogue — Parfait.Design/Desmohair" },
		{
			name: "description",
			content: "Découvrez nos créations : coiffures, perruques, mariage, produits, équipements et promotions."
		},
		{
			property: "og:title",
			content: "Catalogue — Parfait.Design/Desmohair"
		},
		{
			property: "og:description",
			content: "Toutes nos collections en un coup d'œil."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$5 = () => import("./contact-Z8LLm_HB.js");
var Route$5 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact & Reservation — Parfait.Design / Desmo Hair / Beaute Essentielle" },
		{
			name: "description",
			content: "Reservez votre rendez-vous dans l'un de nos trois etablissements a Ouagadougou."
		},
		{
			property: "og:title",
			content: "Contact — Parfait.Design / Desmo Hair / Beaute Essentielle"
		},
		{
			property: "og:description",
			content: "Trois adresses a Ouagadougou pour vos coiffures, perruques, produits et equipements."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/gallery.tsx
var $$splitComponentImporter$4 = () => import("./gallery-BoAlSFBg.js");
var Route$4 = createFileRoute("/gallery")({
	head: () => ({ meta: [
		{ title: "Galerie — Parfait.Design/Desmohair" },
		{
			name: "description",
			content: "Nos realisations : mariages, perruques, tresses, coloration."
		},
		{
			property: "og:title",
			content: "Galerie — Parfait.Design/Desmohair"
		},
		{
			property: "og:description",
			content: "Inspirations et creations de notre salon."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$3 = () => import("./login-BwgrWkDP.js");
var Route$3 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Connexion — Desmohair" }, {
		name: "description",
		content: "Connexion pour les clients et l'administrateur de Desmohair"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/profile.tsx
var $$splitComponentImporter$2 = () => import("./profile-8wEKaUcb.js");
var Route$2 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Profil — Desmohair" }, {
		name: "description",
		content: "Profil utilisateur et espace administration Desmohair"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/services.tsx
var $$splitComponentImporter$1 = () => import("./services-BZZST_4X.js");
var Route$1 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "Services — Parfait.Design/Desmohair" },
		{
			name: "description",
			content: "Tresses, mariage, perruques, coloration, lissage, extensions et conseils beauté."
		},
		{
			property: "og:title",
			content: "Services — Parfait.Design/Desmohair"
		},
		{
			property: "og:description",
			content: "Découvrez tous nos services de beauté et coiffure."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/splash.tsx
var $$splitComponentImporter = () => import("./splash-Cw_HWjtl.js");
var Route = createFileRoute("/splash")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AdminRoute = Route$7.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$9
});
var CatalogRoute = Route$6.update({
	id: "/catalog",
	path: "/catalog",
	getParentRoute: () => Route$9
});
var ContactRoute = Route$5.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$9
});
var GalleryRoute = Route$4.update({
	id: "/gallery",
	path: "/gallery",
	getParentRoute: () => Route$9
});
var LoginRoute = Route$3.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$9
});
var ProfileRoute = Route$2.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$9
});
var ServicesRoute = Route$1.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$9
});
var SplashRoute = Route.update({
	id: "/splash",
	path: "/splash",
	getParentRoute: () => Route$9
});
var CatalogRouteChildren = { CatalogCategoryRoute: Route$10.update({
	id: "/$category",
	path: "/$category",
	getParentRoute: () => CatalogRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	CatalogRoute: CatalogRoute._addFileChildren(CatalogRouteChildren),
	ContactRoute,
	GalleryRoute,
	LoginRoute,
	ProfileRoute,
	ServicesRoute,
	SplashRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
