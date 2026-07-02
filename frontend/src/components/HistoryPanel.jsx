import { PROFILE_CONTENT } from '../data/profileContent'

function getProfileLabel(item) {
  const key = item.perfilRecomendado || item.prediccion
  return PROFILE_CONTENT[key]?.label || key || 'Sin resultado'
}

function HistoryPanel({ history, loading, selectedId, onRefresh, onSelect, onDelete }) {
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

      {loading ? (
        <p className="empty-copy">Cargando historial...</p>
      ) : history.length ? (
        <div className="history-list">
          {history.map((item) => (
            <article className={selectedId === item.id ? 'history-row selected' : 'history-row'} key={item.id}>
              <div>
                <strong>{item.nombrePostulante || 'Postulante'}</strong>
                <span>{getProfileLabel(item)}</span>
              </div>
              <span>{Math.round(Number(item.confianza || 0) * 100)}%</span>
              <div className="history-actions">
                <button type="button" onClick={() => onSelect(item.id)}>
                  Ver
                </button>
                <button type="button" onClick={() => onDelete(item.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-copy">
          El historial aparecera cuando el backend TalentMatch este disponible.
        </p>
      )}
    </section>
  )
}

export default HistoryPanel
