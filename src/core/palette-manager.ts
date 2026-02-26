/**
 * Palette Manager - Static color palette management
 * Palettes are imported at build time and bundled into the app
 */

import palettesData from '../data/palettes.json';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

export class PaletteManager {
  private static readonly palettes: Palette[] = palettesData.palettes;
  private static currentPalette: string = 'default';

  /**
   * Get all available palettes
   */
  static getPalettes(): Palette[] {
    return this.palettes;
  }

  /**
   * Apply a palette to the ULA by converting hex colors to RGBA
   */
  static apply(paletteId: string, ula: any): void {
    const palette = this.palettes.find(p => p.id === paletteId);
    if (!palette) {
      console.warn(`Palette "${paletteId}" not found`);
      return;
    }

    // Convert hex colors (#RRGGBB) to RGBA [R, G, B, A] format
    ula.palette = palette.colors.map((hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b, 255]; // [R, G, B, A]
    });

    // Update pre-computed 32-bit palette values
    if (typeof ula.updatePalette32 === 'function') {
      ula.updatePalette32();
    }

    this.currentPalette = paletteId;
  }

  /**
   * Get the current palette ID
   */
  static getCurrent(): string {
    return this.currentPalette;
  }

  /**
   * Save palette ID to localStorage
   */
  static save(paletteId: string): void {
    localStorage.setItem('zxm8_palette', paletteId);
    this.currentPalette = paletteId;
  }

  /**
   * Load saved palette from localStorage and apply it
   * Called on app startup
   */
  static loadSaved(ula: any): void {
    const saved = localStorage.getItem('zxm8_palette') || 'default';
    this.apply(saved, ula);
  }

  /**
   * Get palette by ID
   */
  static getPalette(id: string): Palette | undefined {
    return this.palettes.find(p => p.id === id);
  }
}
