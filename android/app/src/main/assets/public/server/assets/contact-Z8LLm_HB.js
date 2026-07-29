import { t as GlassButton } from "./GlassButton-BvWtAYbJ.js";
import { _ as waLinkFor, a as AppShell, c as WhatsAppIcon, f as SALONS, h as pickSalonFor, o as GlassCard, p as SOCIALS } from "./exceptions-CejCju6t.js";
import { t as catalogService } from "./catalog.service-JKK9H3e4.js";
import { t as servicesService } from "./services.service-CX6ui3Je.js";
import { t as salonService } from "./salon.service-Dxw5GUBm.js";
import { t as IconBadge } from "./IconBadge-CwX7FJJ7.js";
import { useEffect, useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { Building2, Calendar, Facebook, Globe, Instagram, MapPin, MessageSquare, Phone, ShoppingBag, Sparkles, User } from "lucide-react";
//#region src/routes/contact.tsx?tsr-split=component
var formatFCFA = (price) => {
	return new Intl.NumberFormat("fr-BF", {
		style: "currency",
		currency: "XOF",
		minimumFractionDigits: 0
	}).format(price);
};
function ContactPage() {
	const [services, setServices] = useState([]);
	const [catalogItems, setCatalogItems] = useState([]);
	const [salonInfo, setSalonInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [mapSalon, setMapSalon] = useState("parfait");
	const [form, setForm] = useState({
		nom: "",
		tel: "",
		service: "",
		produit: "aucun",
		salonId: "parfait",
		date: "",
		message: ""
	});
	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const [servicesData, catalogData, salonData] = await Promise.all([
					servicesService.getActive(),
					catalogService.getAvailable(),
					salonService.getInfo()
				]);
				setServices(servicesData);
				setCatalogItems(catalogData);
				setSalonInfo(salonData);
				if (servicesData.length > 0) setForm((f) => ({
					...f,
					service: servicesData[0].title
				}));
			} catch {} finally {
				setLoading(false);
			}
		};
		loadData();
	}, []);
	const products = useMemo(() => {
		return catalogItems.filter((item) => [
			"produits",
			"equipement",
			"perruques"
		].includes(item.category.toLowerCase())).slice(0, 40).map((p) => ({
			id: p.id,
			label: `${p.category} · ${p.title}`,
			price: p.price,
			cat: p.category,
			code: p.code,
			image_url: p.image_url
		}));
	}, [catalogItems]);
	const set = (k) => (e) => {
		const value = e.target.value;
		setForm((f) => {
			const next = {
				...f,
				[k]: value
			};
			if (k === "produit" && value !== "aucun") {
				const p = products.find((x) => x.id === value);
				if (p) next.salonId = pickSalonFor(p.cat).id;
			}
			return next;
		});
	};
	const onSubmit = (e) => {
		e.preventDefault();
		const prod = products.find((p) => p.id === form.produit);
		const prodCode = prod?.code ? `• Code : ${prod.code}\n` : "";
		const prodLine = prod ? `• Produit : ${prod.label}${prod.price ? ` (${formatFCFA(prod.price)})` : ""}\n` : "";
		const prodImageLine = prod?.image_url ? `• Image : ${prod.image_url}\n` : "";
		const msg = `Bonjour ${SALONS.find((s) => s.id === form.salonId).name},\n\nJe souhaite reserver :\n• Nom : ${form.nom}\n• Telephone : ${form.tel}\n• Service : ${form.service}\n${prodCode}${prodLine}${prodImageLine}• Date souhaitee : ${form.date}\n\n${form.message}`;
		const url = waLinkFor(form.salonId, msg);
		window.open(url, "_blank");
	};
	const mergedSalons = useMemo(() => {
		if (!salonInfo) return SALONS;
		return [
			{
				id: "parfait",
				name: salonInfo.salon_name || "Parfait Design",
				area: salonInfo.address || SALONS[0].area,
				city: SALONS[0].city,
				phone: salonInfo.phone_number || SALONS[0].phone,
				phoneDisplay: salonInfo.phone_number || SALONS[0].phoneDisplay,
				whatsapp: (salonInfo.whatsapp_url || SALONS[0].whatsapp).replace(/\D/g, ""),
				mapsLink: SALONS[0].mapsLink,
				embed: SALONS[0].embed,
				logo: SALONS[0].logo,
				tags: SALONS[0].tags
			},
			SALONS[1],
			SALONS[2]
		];
	}, [salonInfo]);
	return /* @__PURE__ */ jsxs(AppShell, {
		title: "Contact",
		subtitle: "Trois adresses a votre service",
		children: [
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .4 },
				className: "mt-5 space-y-3",
				children: mergedSalons.map((s, i) => /* @__PURE__ */ jsxs(motion.article, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .08 },
					className: "liquid-glass rounded-[24px] p-4",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("span", {
							className: "grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-black/5",
							style: { boxShadow: "0 6px 16px -8px oklch(0.78 0.1 85 / 0.4)" },
							children: /* @__PURE__ */ jsx("img", {
								src: s.logo,
								alt: s.name,
								className: "h-full w-full object-cover",
								loading: "lazy",
								decoding: "async"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "font-display text-base font-semibold leading-tight",
									children: s.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground",
									children: [
										/* @__PURE__ */ jsx(MapPin, {
											className: "h-3 w-3",
											style: { color: "var(--gold-deep)" }
										}),
										" ",
										s.area,
										" · ",
										s.phoneDisplay
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-[10px] uppercase tracking-wider text-[var(--gold-deep)]",
									children: s.tags.includes("produits") ? "Produits & Equipements" : "Services · Perruques · Mariage · Promo"
								})
							]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ jsxs(GlassButton, {
								as: "a",
								href: `tel:${s.phone}`,
								variant: "light",
								size: "sm",
								children: [/* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }), " Appeler"]
							}),
							/* @__PURE__ */ jsxs(GlassButton, {
								as: "a",
								href: waLinkFor(s.id),
								target: "_blank",
								rel: "noreferrer",
								variant: "whatsapp",
								size: "sm",
								children: [
									/* @__PURE__ */ jsx(WhatsAppIcon, {
										className: "h-3 w-3",
										style: { color: "#25D366" }
									}),
									" ",
									"WhatsApp"
								]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => window.open(s.mapsLink, "_blank"),
								className: "inline-flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-red-500/20 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
								children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), " Itineraire"]
							})
						]
					})]
				}, s.id))
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .2 },
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit,
					className: "mt-6 liquid-glass rounded-[28px] p-5 space-y-4",
					children: [
						/* @__PURE__ */ jsx(SectionLabel, { children: "Coordonnees" }),
						/* @__PURE__ */ jsx(Field, {
							label: "Nom complet",
							icon: User,
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								value: form.nom,
								onChange: set("nom"),
								className: "input",
								placeholder: "Votre nom"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Telephone",
							icon: Phone,
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								type: "tel",
								value: form.tel,
								onChange: set("tel"),
								className: "input",
								placeholder: "+226 ..."
							})
						}),
						/* @__PURE__ */ jsx(SectionLabel, { children: "Demande" }),
						/* @__PURE__ */ jsx(Field, {
							label: "Etablissement",
							icon: Building2,
							children: /* @__PURE__ */ jsx("select", {
								value: form.salonId,
								onChange: set("salonId"),
								className: "input",
								children: SALONS.map((s) => /* @__PURE__ */ jsxs("option", {
									value: s.id,
									children: [
										s.name,
										" — ",
										s.area
									]
								}, s.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Service souhaite",
							icon: Sparkles,
							children: /* @__PURE__ */ jsx("select", {
								value: form.service,
								onChange: set("service"),
								className: "input",
								children: services.map((s) => /* @__PURE__ */ jsx("option", { children: s.title }, s.id))
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Produit / Equipement (optionnel)",
							icon: ShoppingBag,
							children: /* @__PURE__ */ jsxs("select", {
								value: form.produit,
								onChange: set("produit"),
								className: "input",
								children: [/* @__PURE__ */ jsx("option", {
									value: "aucun",
									children: "Aucun"
								}), products.map((p) => /* @__PURE__ */ jsxs("option", {
									value: p.id,
									children: [p.label, p.price ? ` — ${formatFCFA(p.price)}` : ""]
								}, p.id))]
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Date souhaitee",
							icon: Calendar,
							children: /* @__PURE__ */ jsx("input", {
								required: true,
								type: "date",
								value: form.date,
								onChange: set("date"),
								className: "input"
							})
						}),
						/* @__PURE__ */ jsx(Field, {
							label: "Message",
							icon: MessageSquare,
							children: /* @__PURE__ */ jsx("textarea", {
								value: form.message,
								onChange: set("message"),
								rows: 3,
								className: "input resize-none",
								placeholder: "Precisez votre demande..."
							})
						}),
						/* @__PURE__ */ jsxs(GlassButton, {
							type: "submit",
							variant: "whatsapp",
							size: "lg",
							full: true,
							className: "mt-2",
							children: [/* @__PURE__ */ jsx(WhatsAppIcon, {
								className: "h-5 w-5",
								style: { color: "#25D366" }
							}), /* @__PURE__ */ jsx("span", { children: "Envoyer via WhatsApp" })]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(motion.h2, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .3 },
				className: "font-display mt-7 mb-3 text-xl font-semibold",
				children: "Nous trouver"
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .35 },
				className: "liquid-glass rounded-full p-1 flex gap-1",
				children: SALONS.map((s) => /* @__PURE__ */ jsx(GlassButton, {
					type: "button",
					onClick: () => setMapSalon(s.id),
					variant: mapSalon === s.id ? "primary" : "light",
					size: "sm",
					className: "flex-1 whitespace-nowrap",
					children: s.name
				}, s.id))
			}),
			/* @__PURE__ */ jsxs(GlassCard, {
				className: "mt-3 overflow-hidden p-0",
				children: [/* @__PURE__ */ jsx("iframe", {
					src: SALONS.find((s) => s.id === mapSalon).embed,
					className: "h-56 w-full border-0",
					loading: "lazy",
					title: `Carte ${mapSalon}`
				}, mapSalon), /* @__PURE__ */ jsx(GlassButton, {
					as: "a",
					href: SALONS.find((s) => s.id === mapSalon).mapsLink,
					target: "_blank",
					rel: "noreferrer",
					variant: "gold",
					size: "md",
					full: true,
					className: "rounded-none rounded-b-[28px]",
					children: "Obtenir l'itineraire"
				})]
			}),
			/* @__PURE__ */ jsx(motion.h2, {
				initial: { opacity: 0 },
				animate: { opacity: 1 },
				transition: { delay: .4 },
				className: "font-display mt-7 mb-3 text-xl font-semibold",
				children: "Suivez-nous"
			}),
			/* @__PURE__ */ jsx(motion.div, {
				initial: {
					opacity: 0,
					y: 10
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { delay: .45 },
				className: "grid grid-cols-4 gap-2",
				children: [
					{
						icon: Facebook,
						label: "Facebook",
						href: SOCIALS.facebook,
						tone: "blue"
					},
					{
						icon: Instagram,
						label: "Instagram",
						href: SOCIALS.instagram,
						tone: "pink"
					},
					{
						icon: TikTokIcon,
						label: "TikTok",
						href: SOCIALS.tiktok,
						tone: "rose"
					},
					{
						icon: Globe,
						label: "Site web",
						href: SOCIALS.website,
						tone: "gold"
					}
				].map(({ icon: Icon, label, href, tone }) => /* @__PURE__ */ jsxs("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					className: "liquid-glass flex flex-col items-center gap-1.5 rounded-2xl p-3 transition hover:scale-105 active:scale-95",
					children: [/* @__PURE__ */ jsx(IconBadge, {
						icon: Icon,
						tone
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-medium",
						children: label
					})]
				}, label))
			}),
			/* @__PURE__ */ jsx("style", { children: `
        .input {
          width: 100%;
          background: linear-gradient(180deg, oklch(1 0 0 / 0.85), oklch(1 0 0 / 0.6));
          backdrop-filter: blur(14px) saturate(170%);
          border: 1px solid oklch(1 0 0 / 0.8);
          border-radius: 16px;
          padding: 12px 14px;
          font-size: 13px;
          color: var(--foreground);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.6);
        }
        .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px oklch(0.85 0.1 85 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.6); }
      ` })
		]
	});
}
function SectionLabel({ children }) {
	return /* @__PURE__ */ jsxs("p", {
		className: "flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-deep)]",
		children: [
			/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent" }),
			children,
			/* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent" })
		]
	});
}
function Field({ label, icon: Icon, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsxs("span", {
			className: "mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
			children: [Icon && /* @__PURE__ */ jsx(Icon, {
				className: "h-3 w-3",
				style: { color: "var(--gold-deep)" }
			}), label]
		}), children]
	});
}
function TikTokIcon({ className = "" }) {
	return /* @__PURE__ */ jsx("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", {
			d: "M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.3a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v3.2a3 3 0 1 0 2.1 2.9V3h3z",
			fill: "currentColor"
		})
	});
}
//#endregion
export { ContactPage as component };
