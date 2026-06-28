const FLAG_CODES: Record<string, string> = {
  'México': 'mx',
  'Estados Unidos': 'us',
  'Alemania': 'de',
  'Argentina': 'ar',
  'Francia': 'fr',
  'Noruega': 'no',
  'Colombia': 'co',
  'Suiza': 'ch',
  'Canadá': 'ca',
  'Brasil': 'br',
  'Marruecos': 'ma',
  'Sudáfrica': 'za',
  'Bosnia y Herzegovina': 'ba',
  'Ecuador': 'ec',
  'Costa de Marfil': 'ci',
  'Países Bajos': 'nl',
  'Japón': 'jp',
  'Suecia': 'se',
  'Australia': 'au',
  'España': 'es',
  'Cabo Verde': 'cv',
  'Bélgica': 'be',
  'Egipto': 'eg',
  'Inglaterra': 'gb',
  'Croacia': 'hr',
  'Ghana': 'gh',
  'Portugal': 'pt',
  'RD Congo': 'cd',
  'Senegal': 'sn',
  'Austria': 'at',
  'Argelia': 'dz',
  'Paraguay': 'py',
};

function codeToEmoji(code: string): string {
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

export function getFlagEmoji(teamName: string): string | null {
  if (teamName.startsWith('Ganador') || teamName.startsWith('Perdedor')) return null;
  const code = FLAG_CODES[teamName];
  if (!code) return null;
  return codeToEmoji(code);
}
