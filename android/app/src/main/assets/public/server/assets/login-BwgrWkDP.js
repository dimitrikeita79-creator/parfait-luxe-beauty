import { t as useToast } from "./useToast-sKNGuXCV.js";
import { a as AppShell, l as profil_default } from "./exceptions-CejCju6t.js";
import { t as authService } from "./auth.service-DLq8OZ6-.js";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
//#region src/routes/login.tsx?tsr-split=component
var brandText = "Desmohair";
function LoginPage() {
	const navigate = useNavigate();
	const { success, error: toastError } = useToast();
	const [mode, setMode] = useState("login");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const canSubmit = useMemo(() => {
		if (!email.trim() || !password) return false;
		if (mode === "signup") return Boolean(fullName.trim()) && password.length >= 6 && password === confirmPassword;
		return true;
	}, [
		confirmPassword,
		email,
		fullName,
		mode,
		password
	]);
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!canSubmit) return;
		setLoading(true);
		setError(null);
		try {
			const normalizedEmail = email.trim().toLowerCase();
			if (mode === "signup") {
				await authService.signUp(normalizedEmail, password, fullName.trim(), normalizedEmail === "essadjikeita794@gmail.com");
				setFullName("");
				setPassword("");
				setConfirmPassword("");
				setEmail("");
				setMode("login");
				success("Compte créé", "Vérifiez votre e-mail pour valider votre compte.");
				return;
			}
			if ((await authService.signIn(normalizedEmail, password)).role === "admin") navigate({ to: "/profile" });
			else {
				if (typeof window !== "undefined") window.sessionStorage.setItem("authNotice", "Vous êtes connecté(e). Vous serez informé(e) des mises à jour et nouveaux ajouts.");
				navigate({ to: "/profile" });
			}
		} catch (err) {
			const message = err instanceof Error ? err.message : "Une erreur est survenue";
			setError(message);
			toastError("Connexion", message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx(AppShell, {
		title: mode === "signup" ? "Créer un compte" : "Connexion",
		subtitle: mode === "signup" ? "Rejoignez Desmohair pour suivre les nouveautés du salon" : "Accédez à votre espace client avec simplicité",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mt-6 rounded-[32px] border border-blue-200/40 bg-gradient-to-br from-blue-50/80 to-white p-5 shadow-md shadow-blue-200/20 sm:p-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-[24px] border border-blue-100/50 bg-gradient-to-br from-white to-blue-50/60 p-5",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "grid h-12 w-12 place-items-center overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-blue-200/30",
								children: /* @__PURE__ */ jsx("img", {
									src: profil_default,
									alt: "Icône profil",
									className: "h-6 w-6 object-contain"
								})
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold uppercase tracking-[0.18em] text-blue-700",
								children: brandText
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Espace client & administration"
							})] })]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Bienvenue espace client."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex gap-2 rounded-full bg-blue-50/50 p-2 shadow-inner ring-1 ring-blue-100/30",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setMode("login"),
								className: `flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${mode === "login" ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30" : "bg-white/80 text-foreground border border-blue-200/30"}`,
								children: "Connexion"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setMode("signup"),
								className: `flex-1 rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] ${mode === "signup" ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30" : "bg-white/80 text-foreground border border-blue-200/30"}`,
								children: "Créer un compte"
							})]
						})
					]
				}),
				/* @__PURE__ */ jsxs("form", {
					className: "mt-5 space-y-5",
					onSubmit: handleSubmit,
					children: [
						mode === "signup" ? /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
								children: "Nom complet"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-2xl border border-blue-200/30 bg-white/80 px-3 py-3 shadow-sm",
								children: [/* @__PURE__ */ jsx(UserRound, { className: "h-4 w-4 text-blue-400" }), /* @__PURE__ */ jsx("input", {
									type: "text",
									value: fullName,
									onChange: (e) => setFullName(e.target.value),
									placeholder: "Votre nom",
									className: "w-full bg-transparent text-sm outline-none"
								})]
							})]
						}) : null,
						/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700",
								children: "Email"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-2xl border border-blue-300/40 bg-white/90 px-3 py-3 shadow-sm",
								children: [/* @__PURE__ */ jsx(Mail, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ jsx("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "vous@example.com",
									className: "w-full bg-transparent text-sm outline-none",
									autoComplete: "email"
								})]
							})]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700",
								children: "Mot de passe"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-2xl border border-blue-300/40 bg-white/90 px-3 py-3 shadow-sm",
								children: [
									/* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-blue-600" }),
									/* @__PURE__ */ jsx("input", {
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "********",
										className: "w-full bg-transparent text-sm outline-none",
										autoComplete: mode === "signup" ? "new-password" : "current-password"
									}),
									/* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setShowPassword((prev) => !prev),
										className: "text-blue-400",
										children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
									})
								]
							})]
						}),
						mode === "signup" ? /* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
								children: "Confirmer le mot de passe"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 rounded-2xl border border-blue-200/30 bg-white/80 px-3 py-3 shadow-sm",
								children: [/* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-blue-400" }), /* @__PURE__ */ jsx("input", {
									type: showPassword ? "text" : "password",
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value),
									placeholder: "********",
									className: "w-full bg-transparent text-sm outline-none",
									autoComplete: "new-password"
								})]
							})]
						}) : null,
						error ? /* @__PURE__ */ jsx("p", {
							className: "rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600",
							children: error
						}) : null,
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: !canSubmit || loading,
							className: "w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed",
							children: loading ? mode === "signup" ? "Création..." : "Connexion..." : mode === "signup" ? "Créer mon compte" : "Se connecter"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-5 text-center text-xs text-muted-foreground",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "font-semibold text-blue-600",
						children: "Retour à l'accueil"
					})
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
