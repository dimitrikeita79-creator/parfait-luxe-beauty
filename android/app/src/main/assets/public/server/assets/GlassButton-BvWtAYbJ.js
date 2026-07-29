import { jsx } from "react/jsx-runtime";
//#region src/components/GlassButton.tsx
var VARIANT_CLASSES = {
	primary: "glass-button glass-button--primary",
	light: "glass-button glass-button--light",
	whatsapp: "glass-button",
	gold: "glass-button glass-button--gold"
};
var SIZES = {
	sm: "px-3 py-2 text-[11px]",
	md: "px-4 py-2.5 text-xs",
	lg: "px-5 py-3.5 text-sm"
};
/** Universal liquid-glass button — works as <button>, <a>, <Link>, etc. */
function GlassButton({ as, variant = "light", size = "md", full, className = "", children, ...rest }) {
	const Comp = as ?? "button";
	const variantClasses = VARIANT_CLASSES[variant];
	return /* @__PURE__ */ jsx(Comp, {
		...rest,
		className: `${variantClasses} inline-flex items-center justify-center gap-1.5 rounded-full font-semibold backdrop-blur-xl transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] ${SIZES[size]} ${full ? "w-full" : ""} ${className}`,
		children: /* @__PURE__ */ jsx("span", {
			className: "relative inline-flex items-center gap-1.5",
			children
		})
	});
}
//#endregion
export { GlassButton as t };
