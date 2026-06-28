/**
 * Motor de cálculo de puntos — Reglas de Negocio RN-01 a RN-04
 *
 * RN-01: Acertar ganador o empate → +3 puntos
 * RN-02: Acertar goles del equipo local → +1 punto
 * RN-03: Acertar goles del equipo visitante → +1 punto
 * RN-04: Máximo por partido → 5 puntos
 */

export interface ScoreResult {
  puntos: number;
  aciertoResultado: boolean;
  aciertoLocal: boolean;
  aciertoVisitante: boolean;
}

/**
 * Determina el "signo" de un resultado: 'L' (local), 'V' (visitante), 'E' (empate)
 */
function getResultSign(golesLocal: number, golesVisitante: number): 'L' | 'V' | 'E' {
  if (golesLocal > golesVisitante) return 'L';
  if (golesLocal < golesVisitante) return 'V';
  return 'E';
}

/**
 * Calcula los puntos de un participante para un partido específico.
 *
 * @param pronosticoLocal - Goles pronosticados para el equipo local
 * @param pronosticoVisitante - Goles pronosticados para el equipo visitante
 * @param realLocal - Goles reales del equipo local
 * @param realVisitante - Goles reales del equipo visitante
 * @returns Objeto con puntos totales y detalle de aciertos
 */
export function calculatePoints(
  pronosticoLocal: number,
  pronosticoVisitante: number,
  realLocal: number,
  realVisitante: number
): ScoreResult {
  let puntos = 0;

  // RN-01: ¿Acertó el resultado (ganador o empate)?
  const signoReal = getResultSign(realLocal, realVisitante);
  const signoPronostico = getResultSign(pronosticoLocal, pronosticoVisitante);
  const aciertoResultado = signoReal === signoPronostico;

  if (aciertoResultado) {
    puntos += 3;
  }

  // RN-02: ¿Acertó goles del equipo local?
  const aciertoLocal = pronosticoLocal === realLocal;
  if (aciertoLocal) {
    puntos += 1;
  }

  // RN-03: ¿Acertó goles del equipo visitante?
  const aciertoVisitante = pronosticoVisitante === realVisitante;
  if (aciertoVisitante) {
    puntos += 1;
  }

  // RN-04: Máximo 5 puntos (ya está implícito, pero lo aseguramos)
  puntos = Math.min(puntos, 5);

  return {
    puntos,
    aciertoResultado,
    aciertoLocal,
    aciertoVisitante,
  };
}
