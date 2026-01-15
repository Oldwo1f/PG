import { popularFonts } from "~/data/popularFonts";

export interface GoogleFont {
	family: string;
	variants: string[];
	subsets: string[];
	version: string;
	lastModified: string;
	files: Record<string, string>;
	category: string;
	kind: string;
}

export interface GoogleFontsResponse {
	kind: string;
	items: GoogleFont[];
}

class GoogleFontsService {
	private fonts: GoogleFont[] = popularFonts; // Utiliser directement la liste statique
	private isLoading = false;
	private lastFetch: number = Date.now(); // Initialiser avec la date actuelle

	async fetchFonts(): Promise<GoogleFont[]> {
		// Retourner directement la liste statique des polices populaires
		return this.fonts;
	}

	async searchFonts(query: string): Promise<GoogleFont[]> {
		const fonts = await this.fetchFonts();
		if (!query) return fonts; // Retourner toutes les polices

		const lowerQuery = query.toLowerCase();
		return fonts.filter(
			(font) =>
				font.family.toLowerCase().includes(lowerQuery) ||
				font.category.toLowerCase().includes(lowerQuery)
		);
	}

	getPopularFonts(): GoogleFont[] {
		return this.fonts; // Retourner toutes les polices
	}

	getFontsByCategory(category: string): GoogleFont[] {
		return this.fonts.filter((font) => font.category === category);
	}

	getGoogleFontsLink(fonts: string[]): string {
		if (!fonts.length) return "";

		const uniqueFonts = [...new Set(fonts.filter(Boolean))];
		// Important:
		// - Google Fonts API accepts spaces (encoded as %20) in family names.
		// - Using "+" can break if it's encoded as "%2B" (server sees a literal "+").
		// So we keep standard URL encoding for the family name.
		const families = uniqueFonts.map(
			(font) => `family=${encodeURIComponent(font)}:wght@400;700`
		);
		return `https://fonts.googleapis.com/css2?${families.join(
			"&"
		)}&display=swap`;
	}
}

export const googleFontsService = new GoogleFontsService();
