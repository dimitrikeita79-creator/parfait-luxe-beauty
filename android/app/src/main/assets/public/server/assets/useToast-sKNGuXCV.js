import { useCallback, useEffect, useState } from "react";
//#region src/hooks/useToast.ts
var counter = 0;
var listeners = /* @__PURE__ */ new Set();
var toasts = [];
var notify = (toast) => {
	const next = [...toasts, {
		...toast,
		id: ++counter
	}];
	toasts = next;
	listeners.forEach((fn) => fn(next));
	setTimeout(() => {
		const updated = toasts.filter((t) => t.id !== next[next.length - 1]?.id);
		toasts = updated;
		listeners.forEach((fn) => fn(updated));
	}, 4e3);
};
function useToast() {
	const [state, setState] = useState(toasts);
	useEffect(() => {
		const handler = (next) => setState([...next]);
		listeners.add(handler);
		return () => {
			listeners.delete(handler);
		};
	}, []);
	return {
		toasts: state,
		success: useCallback((title, description) => {
			notify({
				title,
				description,
				type: "success"
			});
		}, []),
		error: useCallback((title, description) => {
			notify({
				title,
				description,
				type: "error"
			});
		}, []),
		info: useCallback((title, description) => {
			notify({
				title,
				description,
				type: "info"
			});
		}, [])
	};
}
//#endregion
export { useToast as t };
