//#region src/lib/favorites.ts
var FAVORITES_STORAGE_KEY = "desmohair-favorites";
function getFavorites() {
	if (typeof window === "undefined") return [];
	try {
		const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch {
		return [];
	}
}
function saveFavorites(items) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
	window.dispatchEvent(new Event("favorites-updated"));
}
function toggleFavorite(item) {
	const favorites = getFavorites();
	const existingIndex = favorites.findIndex((candidate) => candidate.kind === item.kind && candidate.id === item.id);
	const nextItems = existingIndex >= 0 ? favorites.filter((_, index) => index !== existingIndex) : [item, ...favorites];
	saveFavorites(nextItems);
	return nextItems;
}
function asFavoriteItem(item, kind) {
	return {
		id: item.id,
		kind,
		title: "title" in item ? item.title : "",
		description: "description" in item ? item.description : null,
		price: "price" in item ? item.price : null,
		imageUrl: "image_url" in item ? item.image_url : null,
		category: "category" in item ? item.category : null
	};
}
//#endregion
export { toggleFavorite as i, getFavorites as n, saveFavorites as r, asFavoriteItem as t };
