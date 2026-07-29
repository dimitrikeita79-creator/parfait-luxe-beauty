import { t as DESMOHAIR_default } from "./DESMOHAIR-ByaQhVCO.js";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/splash.tsx?tsr-split=component
function Splash() {
	const navigate = useNavigate();
	useEffect(() => {
		const t = setTimeout(() => navigate({ to: "/" }), 2200);
		return () => clearTimeout(t);
	}, [navigate]);
	return /* @__PURE__ */ jsxs("div", {
		className: "relative mx-auto grid min-h-screen max-w-md place-items-center overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			"aria-hidden": true,
			className: "pointer-events-none absolute inset-0",
			children: [/* @__PURE__ */ jsx("div", { className: "absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-[var(--gold-soft)] opacity-50 blur-3xl animate-float" }), /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--rose)] opacity-50 blur-3xl" })]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative text-center animate-fade-up",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "glass-strong mx-auto grid h-36 w-36 place-items-center rounded-[40px] shadow-luxe overflow-hidden p-3",
					children: /* @__PURE__ */ jsx("img", {
						src: DESMOHAIR_default,
						alt: "Desmohair",
						className: "h-full w-full object-contain animate-float"
					})
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "font-display mt-6 text-3xl font-semibold leading-tight",
					children: "Desmohair"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm italic text-muted-foreground",
					children: "\"Votre beauté, notre passion\""
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mx-auto mt-8 h-1 w-32 overflow-hidden rounded-full bg-[var(--muted)]",
					children: /* @__PURE__ */ jsx("div", { className: "h-full w-1/3 animate-shimmer rounded-full bg-gold" })
				})
			]
		})]
	});
}
//#endregion
export { Splash as component };
