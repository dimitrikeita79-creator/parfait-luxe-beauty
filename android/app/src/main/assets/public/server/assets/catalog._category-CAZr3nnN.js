import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/catalog.$category.tsx
var $$splitComponentImporter = () => import("./catalog._category-EWkJuFhX.js");
var Route = createFileRoute("/catalog/$category")({
	validateSearch: (s) => ({ highlight: typeof s.highlight === "string" ? s.highlight : void 0 }),
	head: ({ params }) => {
		const catName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
		return { meta: [
			{ title: `${catName} — Catalogue Parfait.Design/Desmohair` },
			{
				name: "description",
				content: `Découvrez nos ${catName.toLowerCase()}.`
			},
			{
				property: "og:title",
				content: `${catName} — Parfait.Design/Desmohair`
			},
			{
				property: "og:description",
				content: `Collection ${catName.toLowerCase()}.`
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
