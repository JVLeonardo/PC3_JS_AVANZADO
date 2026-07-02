import { useEffect, useMemo, useState } from 'react'
import { PROFILE_CONTENT, PREFERENCE_OPTIONS, buildMockResult } from './data/profileContent'
import { uploadAvatar } from './services/cloudinaryUpload'
import {
  deleteEvaluation,
  getEvaluation,
  getHistory,
  predictTalent,
} from './services/talentApi'
import TalentForm from './components/TalentForm'
import ResultPanel from './components/ResultPanel'
import SkillBars from './components/SkillBars'
import ProfileRanking from './components/ProfileRanking'
import Roadmap from './components/Roadmap'
import HistoryPanel from './components/HistoryPanel'

const initialForm = {
  nombrePostulante: '',
  emailPostulante: '',
  avatarUrl: '',
  javascript: 82,
  react: 78,
  springBoot: 62,
  pythonDatos: 55,
  sql: 70,
  experienciaProyectos: 4,
  preferencia: 3,
}

function normalizeResult(response, input) {
  const prediccion = response?.perfilRecomendado || response?.prediccion || 'FULLSTACK_JUNIOR'
  const profile = PROFILE_CONTENT[prediccion] || PROFILE_CONTENT.FULLSTACK_JUNIOR

  return {
    ...response,
    caso: response?.caso || 'TalentMatchAI',
    prediccion,
    perfilRecomendado: prediccion,
    confianza: Number(response?.confianza ?? 0.86),
    ranking: response?.ranking || response?.rankingJson || buildMockResult(input).ranking,
    recomendaciones: response?.recomendaciones || profile.recomendaciones,
    entrada: response?.entrada || input,
    descripcion: profile.descripcion,
  }
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [selectedHistoryId, setSelectedHistoryId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [usingMock, setUsingMock] = useState(false)

  const skillValues = useMemo(
    () => ({
      javascript: Number(form.javascript),
      react: Number(form.react),
      springBoot: Number(form.springBoot),
      pythonDatos: Number(form.pythonDatos),
      sql: Number(form.sql),
    }),
    [form],
  )

  useEffect(() => {
    refreshHistory()
  }, [])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function refreshHistory() {
    setHistoryLoading(true)
    try {
      const items = await getHistory()
      setHistory(Array.isArray(items) ? items : [])
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }

  async function handleAvatarUpload() {
    setError('')
    setNotice('')
    try {
      const avatarUrl = await uploadAvatar()
      updateField('avatarUrl', avatarUrl)
      setNotice('Avatar cargado correctamente en Cloudinary.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')
    setUsingMock(false)

    const payload = {
      ...form,
      javascript: Number(form.javascript),
      react: Number(form.react),
      springBoot: Number(form.springBoot),
      pythonDatos: Number(form.pythonDatos),
      sql: Number(form.sql),
      experienciaProyectos: Number(form.experienciaProyectos),
      preferencia: Number(form.preferencia),
    }

    try {
      const response = await predictTalent(payload)
      setResult(normalizeResult(response, payload))
      await refreshHistory()
    } catch {
      const mock = buildMockResult(payload)
      setResult(normalizeResult(mock, payload))
      setUsingMock(true)
      setNotice('Backend TalentMatch pendiente: mostrando resultado demo para validar la interfaz.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectHistory(id) {
    setSelectedHistoryId(id)
    setError('')
    try {
      const detail = await getEvaluation(id)
      const entrada = detail.entrada || detail
      setResult(normalizeResult(detail, entrada))
      setForm((current) => ({
        ...current,
        ...entrada,
        nombrePostulante: detail.nombrePostulante || entrada.nombrePostulante || current.nombrePostulante,
        emailPostulante: detail.emailPostulante || entrada.emailPostulante || '',
        avatarUrl: detail.avatarUrl || entrada.avatarUrl || '',
      }))
      setUsingMock(false)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteHistory(id) {
    setError('')
    try {
      await deleteEvaluation(id)
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null)
      }
      await refreshHistory()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">UTP · JavaScript Avanzado · PC3</p>
          <h1>TalentMatch AI</h1>
          <p className="hero-copy">
            Descubre el perfil tecnologico ideal segun tus habilidades, preferencias y
            experiencia en proyectos junior.
          </p>
        </div>
        <div className="hero-stat">
          <span>4</span>
          <p>perfiles evaluados por IA</p>
        </div>
      </section>

      {(error || notice) && (
        <div className={error ? 'message message-error' : 'message message-info'}>
          {error || notice}
        </div>
      )}

      <section className="dashboard-grid">
        <TalentForm
          form={form}
          preferences={PREFERENCE_OPTIONS}
          loading={loading}
          onChange={updateField}
          onSubmit={handleSubmit}
          onUploadAvatar={handleAvatarUpload}
        />

        <section className="insight-stack">
          <ResultPanel result={result} form={form} loading={loading} usingMock={usingMock} />
          <div className="insight-grid">
            <SkillBars skills={skillValues} />
            <ProfileRanking ranking={result?.ranking} />
          </div>
          <Roadmap result={result} />
        </section>
      </section>

      <HistoryPanel
        history={history}
        loading={historyLoading}
        selectedId={selectedHistoryId}
        onRefresh={refreshHistory}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
      />
    </main>
  )
}

export default App
