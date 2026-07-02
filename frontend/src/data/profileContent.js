export const PREFERENCE_OPTIONS = [
  { value: 0, label: 'Frontend', hint: 'Interfaces, React y experiencia visual' },
  { value: 1, label: 'Backend', hint: 'APIs, servicios y reglas de negocio' },
  { value: 2, label: 'Datos', hint: 'Python, SQL y analisis' },
  { value: 3, label: 'Fullstack', hint: 'Integracion extremo a extremo' },
]

export const PROFILE_CONTENT = {
  FRONTEND_REACT: {
    label: 'Frontend React',
    badge: 'UI Engineer Junior',
    descripcion:
      'Tienes mayor fortaleza en JavaScript, React y construccion de interfaces modernas.',
    recomendaciones: [
      'Fortalecer consumo de APIs REST con estados de carga y error.',
      'Mejorar manejo de estado en formularios y dashboards.',
      'Practicar testing de componentes y accesibilidad.',
      'Crear dashboards con graficos y filtros reutilizables.',
    ],
  },
  BACKEND_SPRING: {
    label: 'Backend Spring',
    badge: 'API Developer Junior',
    descripcion:
      'Tienes mayor orientacion a servicios, APIs, logica de negocio y bases de datos.',
    recomendaciones: [
      'Reforzar DTOs, validaciones y manejo centralizado de errores.',
      'Aprender Spring Security y JWT.',
      'Mejorar consultas SQL e indices basicos.',
      'Documentar APIs con Swagger u OpenAPI.',
    ],
  },
  DATA_ANALYST_JUNIOR: {
    label: 'Data Analyst Junior',
    badge: 'Data Track',
    descripcion: 'Tienes mayor afinidad con analisis de datos, Python y SQL.',
    recomendaciones: [
      'Reforzar Pandas y NumPy con datasets reales.',
      'Practicar visualizacion de datos.',
      'Mejorar SQL avanzado con joins, CTEs y agregaciones.',
      'Aprender modelos predictivos basicos y evaluacion de metricas.',
    ],
  },
  FULLSTACK_JUNIOR: {
    label: 'Fullstack Junior',
    badge: 'End-to-end Builder',
    descripcion:
      'Tienes un perfil equilibrado para integrar frontend, backend y bases de datos.',
    recomendaciones: [
      'Integrar React + Spring Boot + PostgreSQL de extremo a extremo.',
      'Desplegar en Vercel y Render con variables por ambiente.',
      'Manejar errores entre capas y timeouts de servicios externos.',
      'Aprender Docker y flujo basico de CI/CD.',
    ],
  },
}

function scoreProfiles(input) {
  const front =
    input.javascript * 0.35 +
    input.react * 0.45 +
    input.experienciaProyectos * 3 +
    (input.preferencia === 0 ? 12 : 0)
  const back =
    input.springBoot * 0.5 +
    input.sql * 0.25 +
    input.javascript * 0.1 +
    input.experienciaProyectos * 3 +
    (input.preferencia === 1 ? 12 : 0)
  const data =
    input.pythonDatos * 0.55 +
    input.sql * 0.25 +
    input.experienciaProyectos * 2 +
    (input.preferencia === 2 ? 12 : 0)
  const full =
    (input.javascript + input.react + input.springBoot + input.sql) * 0.2 +
    input.experienciaProyectos * 4 +
    (input.preferencia === 3 ? 12 : 0)

  return {
    FRONTEND_REACT: front,
    BACKEND_SPRING: back,
    DATA_ANALYST_JUNIOR: data,
    FULLSTACK_JUNIOR: full,
  }
}

export function buildMockResult(input) {
  const scores = scoreProfiles(input)
  const max = Math.max(...Object.values(scores))
  const ranking = Object.entries(scores)
    .map(([clase, score]) => ({
      clase,
      probabilidad: Number(Math.max(0.36, Math.min(0.96, score / max - 0.04)).toFixed(2)),
    }))
    .sort((a, b) => b.probabilidad - a.probabilidad)

  const prediccion = ranking[0].clase
  return {
    caso: 'TalentMatchAI',
    prediccion,
    perfilRecomendado: prediccion,
    confianza: ranking[0].probabilidad,
    ranking,
    recomendaciones: PROFILE_CONTENT[prediccion].recomendaciones,
    entrada: input,
  }
}
