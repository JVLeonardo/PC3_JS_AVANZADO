import { PROFILE_CONTENT } from '../data/profileContent'

function ProfileRanking({ ranking = [] }) {
  const rows = ranking.length
    ? ranking
    : Object.keys(PROFILE_CONTENT).map((clase) => ({ clase, probabilidad: 0 }))

  return (
    <section className="panel compact-panel">
      <div className="section-heading">
        <p className="eyebrow">Comparativa</p>
        <h2>Ranking de perfiles</h2>
      </div>
      <div className="ranking-list">
        {rows.map((item, index) => {
          const profile = PROFILE_CONTENT[item.clase]
          const pct = Math.round(Number(item.probabilidad || 0) * 100)
          return (
            <article className="ranking-row" key={item.clase}>
              <span className="rank-number">{index + 1}</span>
              <div>
                <strong>{profile?.label || item.clase}</strong>
                <div className="bar-track">
                  <div className="bar-fill alt" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span>{pct}%</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ProfileRanking
