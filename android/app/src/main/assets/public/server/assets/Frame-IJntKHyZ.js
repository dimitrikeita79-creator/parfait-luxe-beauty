import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/Frame.tsx
/**
* Liquid-glass photo frame — white glass + subtle black ring + glossy highlight.
* `tone` provides a soft tinted gradient base (kept restrained, no gold).
* `image` overlays a real photo when available.
*/
function Frame({ tone = "from-white via-white/90 to-neutral-50", image, alt, className = "", rounded = "rounded-[28px]", variant = "tinted", children }) {
	const plain = variant === "plain";
	return /* @__PURE__ */ jsxs("div", {
		className: `relative overflow-hidden bg-white ${rounded} ${plain ? "ring-1 ring-black/8" : "ring-1 ring-black/5"} ${className}`,
		style: { boxShadow: plain ? "0 6px 18px -12px oklch(0.2 0 0 / 0.14), 0 1px 3px -1px oklch(0.2 0 0 / 0.05)" : "0 10px 30px -16px oklch(0.2 0 0 / 0.18), 0 2px 6px -2px oklch(0.2 0 0 / 0.06)" },
		children: [
			!plain && /* @__PURE__ */ jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${tone} opacity-80` }),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0",
				style: {
					background: plain ? "linear-gradient(180deg, oklch(1 0 0 / 0.7), oklch(1 0 0 / 0.2) 60%, transparent), radial-gradient(120% 60% at 15% 10%, oklch(1 0 0 / 0.9), transparent 65%)" : "linear-gradient(180deg, oklch(1 0 0 / 0.55), oklch(1 0 0 / 0.08) 55%, transparent), radial-gradient(120% 70% at 12% 8%, oklch(1 0 0 / 0.85), transparent 60%)",
					backdropFilter: "blur(10px) saturate(170%)"
				}
			}),
			!plain && /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 opacity-40",
				style: { background: "radial-gradient(70% 50% at 92% 100%, oklch(0.2 0 0 / 0.12), transparent 65%)" }
			}),
			image && /* @__PURE__ */ jsx("img", {
				src: image,
				alt: alt ?? "",
				className: "absolute inset-0 h-full w-full object-cover",
				loading: "lazy",
				decoding: "async"
			}),
			/* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/70" }),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-[inherit] opacity-50",
				style: {
					background: "linear-gradient(180deg, oklch(1 0 0 / 0.55), transparent 80%)",
					filter: "blur(2px)"
				}
			}),
			children
		]
	});
}
//#endregion
export { Frame as t };
