import { PROFILE_CONTENT } from '../data/profileContent'

function ResultPanel({ result, form, loading, usingMock }) {
  const profileKey = result?.perfilRecomendado || result?.prediccion
  const profile = PROFILE_CONTENT[profileKey]
  const confidence = Math.round(Number(result?.confianza || 0) * 100)

  return (
    <section className="panel result-panel">
      <div className="result-avatar">
        {form.avatarUrl ? <img src={form.avatarUrl} alt="" /> : <span>TM</span>}
      </div>
      <div className="result-content">
        <p className="eyebrow">{usingMock ? 'Resultado demo' : 'Resultado IA'}</p>
        <h2>{loading ? 'Analizando...' : profile ? profile.label : 'Perfil pendiente'}</h2>
        <p className="profile-badge">{profile?.badge || 'Completa el test para iniciar'}</p>
        <p>
          {profile?.descripcion ||
            'Ingresa tus habilidades y preferencias para descubrir tu ruta tecnologica ideal.'}
        </p>
      </div>
      <div className="confidence-ring">
        <span>{profile ? `${confidence}%` : '--'}</span>
        <p>confianza</p>
      </div>
    </section>
  )
}

export default ResultPanel
