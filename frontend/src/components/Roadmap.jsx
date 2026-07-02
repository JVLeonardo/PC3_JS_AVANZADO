import { PROFILE_CONTENT } from '../data/profileContent'

function Roadmap({ result }) {
  const profileKey = result?.perfilRecomendado || result?.prediccion
  const profile = PROFILE_CONTENT[profileKey]
  const recommendations = result?.recomendaciones || profile?.recomendaciones || []

  return (
    <section className="panel roadmap-panel">
      <div className="section-heading">
        <p className="eyebrow">Ruta de mejora</p>
        <h2>Proximos pasos recomendados</h2>
      </div>
      {recommendations.length ? (
        <ol className="roadmap-list">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <p className="empty-copy">
          El roadmap aparecera cuando se genere una prediccion de perfil.
        </p>
      )}
    </section>
  )
}

export default Roadmap
