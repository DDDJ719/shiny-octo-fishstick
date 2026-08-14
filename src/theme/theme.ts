// Ported from the web prototype (convoy-control.jsx). Colors are unchanged.
// Custom display/mono fonts (Rajdhani, JetBrains Mono) aren't loaded yet —
// see FONT_DISPLAY/FONT_MONO below. To use the real faces, drop the .ttf
// files in android/app/src/main/assets/fonts (and Xcode's font list on iOS)
// and swap the fontFamily string to match the font's internal PostScript name.
export const COLORS = {
  bg: '#14171A',
  panel: '#1B1F23',
  panel2: '#22272B',
  line: '#2B3136',
  text: '#ECEDEE',
  textDim: '#8B939B',
  amber: '#FFB020',
  amberDim: '#7A5416',
  teal: '#2FBF8F',
  tealDim: '#164A38',
  cyan: '#45C6E0',
  red: '#E1483A',
  redDim: '#5A2620',
};

export const FONT_DISPLAY = undefined; // falls back to System, bold weight applied per-use
export const FONT_BODY = undefined;
export const FONT_MONO = 'Courier New';
