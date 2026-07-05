import { PROFILE_CONTENT } from '../data/profileContent'

function getProfileLabel(item) {
  const key = item.perfilRecomendado || item.prediccion
  return PROFILE_CONTENT[key]?.label || key || 'Sin resultado'
}

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function getAverageSkill(item) {
  if (typeof item.promedioTecnico === 'number') {
    return Math.round(item.promedioTecnico)
  }

  const skills = [item.javascript, item.react, item.springBoot, item.pythonDatos, item.sql]
    .map(Number)
    .filter((value) => Number.isFinite(value))

  if (!skills.length) return 0
  return Math.round(skills.reduce((total, value) => total + value, 0) / skills.length)
}

function buildStats(history) {
  if (!history.length) {
    return {
      total: 0,
      confidence: 0,
      commonProfile: 'Sin datos',
      averageSkill: 0,
    }
  }

  const profileCounts = history.reduce((acc, item) => {
    const label = getProfileLabel(item)
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {})

  const commonProfile = Object.entries(profileCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Sin datos'
  const confidence =
    history.reduce((total, item) => total + Number(item.confianza || 0), 0) / history.length
  const averageSkill =
    history.reduce((total, item) => total + getAverageSkill(item), 0) / history.length

  return {
    total: history.length,
    confidence: Math.round(confidence * 100),
    commonProfile,
    averageSkill: Math.round(averageSkill),
  }
}

function HistoryPanel({ history, loading, selectedId, onRefresh, onSelect, onDelete }) {
  const stats = buildStats(history)

  function handleDelete(item) {
    const name = item.nombrePostulante || 'este postulante'
    const confirmed = window.confirm(`¿Eliminar la evaluación de ${name}? Esta acción no se puede deshacer.`)
    if (confirmed) {
      onDelete(item.id)
    }
  }

  return (
    <section className="panel history-panel">
      <div className="history-header">
        <div className="section-heading">
          <p className="eyebrow">Historial</p>
          <h2>Evaluaciones guardadas</h2>
        </div>
        <button className="button-secondary" type="button" onClick={onRefresh}>
          Actualizar
        </button>
      </div>

      <div className="history-stats">
        <article>
          <strong>{stats.total}</strong>
          <span>evaluaciones</span>
        </article>
        <article>
          <strong>{stats.confidence}%</strong>
          <span>confianza prom.</span>
        </article>
        <article>
          <strong>{stats.averageSkill}%</strong>
          <span>skill prom.</span>
        </article>
        <article>
          <strong>{stats.commonProfile}</strong>
          <span>perfil frecuente</span>
        </article>
      </div>

      {loading ? (
        <p className="empty-copy">Cargando historial...</p>
      ) : history.length ? (
        <div className="history-list">
          {history.map((item) => (
            <article className={selectedId === item.id ? 'history-row selected' : 'history-row'} key={item.id}>
              <div className="history-avatar">
                {item.avatarUrl ? (
                  <img src={item.avatarUrl} alt={`Avatar de ${item.nombrePostulante || 'postulante'}`} />
                ) : (
                  <span>{item.nombrePostulante?.[0]?.toUpperCase() || 'TM'}</span>
                )}
              </div>

              <div className="history-main">
                <strong>{item.nombrePostulante || 'Postulante'}</strong>
                <span>{item.emailPostulante || 'Sin email registrado'}</span>
                <small>{formatDate(item.fechaPrediccion || item.fechaEvaluacion)}</small>
              </div>

              <div className="history-profile">
                <strong>{getProfileLabel(item)}</strong>
                <span>{Math.round(Number(item.confianza || 0) * 100)}% confianza</span>
              </div>

              <div className="history-skill">
                <strong>{getAverageSkill(item)}%</strong>
                <span>skill</span>
              </div>

              <div className="history-actions">
                <button type="button" onClick={() => onSelect(item.id)}>
                  Ver
                </button>
                <button
                  aria-label={`Eliminar evaluación de ${item.nombrePostulante || 'postulante'}`}
                  className="history-delete"
                  type="button"
                  onClick={() => handleDelete(item)}
                >
                  ×
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-copy">
          El historial aparecerá cuando el backend TalentMatch tenga evaluaciones guardadas.
        </p>
      )}
    </section>
  )
}

export default HistoryPanel
