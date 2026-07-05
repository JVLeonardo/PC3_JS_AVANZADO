import { PROFILE_CONTENT } from '../data/profileContent'

// Nota: Ahora recibimos también 'form' para poder leer los puntajes que ingresó el usuario
function Roadmap({ result, form }) {
  const profileKey = result?.perfilRecomendado || result?.prediccion
  const profile = PROFILE_CONTENT[profileKey]
  const recommendations = result?.recomendaciones || profile?.recomendaciones || []

  // ========================================================
  // LÓGICA DEL RETO ESPECIAL: Análisis de Brecha de Habilidades
  // ========================================================
  let specialChallengeMsg = null;

  // Verificamos que exista el ranking y que el form haya sido pasado como prop
  if (result?.ranking && result.ranking.length > 1 && form) {
    
    // 1. Identificar el segundo perfil más probable (el siguiente paso)
    const nextProfileKey = result.ranking[1].clase;
    const nextProfileName = PROFILE_CONTENT[nextProfileKey]?.label || nextProfileKey;

    // 2. Definir los puntajes "ideales" mínimos para cada perfil
    const idealScores = {
      'FRONTEND_REACT': { javascript: 85, react: 80 },
      'BACKEND_SPRING': { springBoot: 80, sql: 75 },
      'DATA_ANALYST_JUNIOR': { pythonDatos: 80, sql: 75 },
      'FULLSTACK_JUNIOR': { javascript: 80, springBoot: 75, sql: 70 }
    };

    const targetScores = idealScores[nextProfileKey];

    if (targetScores) {
      // 3. Comparar los puntajes del postulante con el ideal para encontrar la mayor brecha
      let maxGap = 0;
      let skillToImprove = '';

      for (const [skill, targetValue] of Object.entries(targetScores)) {
        const currentValue = Number(form[skill] || 0);
        const gap = targetValue - currentValue;
        
        if (gap > maxGap) {
          maxGap = gap;
          skillToImprove = skill;
        }
      }

      // Nombres legibles para la interfaz
      const skillNames = {
        javascript: 'JavaScript',
        react: 'React',
        springBoot: 'Spring Boot',
        pythonDatos: 'Python orientado a Datos',
        sql: 'SQL'
      };

      // 4. Armar el mensaje final del reto
      if (maxGap > 0) {
        specialChallengeMsg = `Para alcanzar el perfil de ${nextProfileName} (tu segunda mejor opción), te recomendamos fortalecer tu dominio en ${skillNames[skillToImprove]} subiendo al menos ${maxGap} puntos (hasta llegar a ${targetScores[skillToImprove]}).`;
      } else {
        specialChallengeMsg = `Para alcanzar el perfil de ${nextProfileName}, ya tienes los conocimientos técnicos base necesarios. ¡Enfócate en aumentar tu experiencia en proyectos!`;
      }
    }
  }
  // ========================================================

  return (
    <section className="panel roadmap-panel">
      <div className="section-heading">
        <p className="eyebrow">Ruta de mejora</p>
        <h2>Próximos pasos recomendados</h2>
      </div>
      
      {recommendations.length ? (
        <>
          {/* Lista original de recomendaciones */}
          <ol className="roadmap-list">
            {recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>

          {/* Cuadro visual del Reto Especial */}
          {specialChallengeMsg && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '8px', 
              borderLeft: '4px solid #0284c7' 
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '15px' }}>
                🎯 Insight IA: Tu siguiente nivel
              </h4>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#334155' }}>
                {specialChallengeMsg}
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="empty-copy">
          El roadmap aparecerá cuando se genere una predicción de perfil.
        </p>
      )}
    </section>
  )
}

export default Roadmap