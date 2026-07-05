const skillFields = [
  { name: 'javascript', label: 'JavaScript', max: 100 },
  { name: 'react', label: 'React', max: 100 },
  { name: 'springBoot', label: 'Spring Boot', max: 100 },
  { name: 'pythonDatos', label: 'Python Datos', max: 100 },
  { name: 'sql', label: 'SQL', max: 100 },
  { name: 'experienciaProyectos', label: 'Experiencia en proyectos', max: 10 },
]

function TalentForm({ form, preferences, loading, onChange, onSubmit, onUploadAvatar }) {
  return (
    <form className="panel talent-form" onSubmit={onSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Evaluacion</p>
        <h2>Test de perfil tecnologico</h2>
      </div>

      <div className="identity-grid">
        <label>
          Nombre del postulante
          <input
            value={form.nombrePostulante}
            onChange={(event) => onChange('nombrePostulante', event.target.value)}
            maxLength="120"
            placeholder="Enrique Lee"
            required
          />
        </label>

        <label>
          Email opcional
          <input
            type="email"
            value={form.emailPostulante}
            onChange={(event) => onChange('emailPostulante', event.target.value)}
            maxLength="160"
            placeholder="lee@gmail.com"
          />
        </label>
      </div>

      <div className="avatar-upload">
        <div className="avatar-preview">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="Avatar del postulante" />
          ) : (
            <span>{form.nombrePostulante?.[0]?.toUpperCase() || 'AI'}</span>
          )}
        </div>
        <div>
          <button className="button-secondary" type="button" onClick={onUploadAvatar}>
            Subir avatar
          </button>
          <p>Cloudinary guardara la imagen y la app usara su URL segura.</p>
        </div>
      </div>

      <p className="form-helper">
        Arrastra los sliders con el mouse para ajustar tus habilidades antes de analizar tu perfil.
      </p>

      <div className="slider-stack">
        {skillFields.map((field) => (
          <label className="range-field" key={field.name}>
            <span>
              {field.label}
              <strong>
                {form[field.name]}
                {field.max === 100 ? '%' : '/10'}
              </strong>
            </span>
            <input
              type="range"
              min="0"
              max={field.max}
              value={form[field.name]}
              onChange={(event) => onChange(field.name, Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <fieldset className="preference-group">
        <legend>Preferencia laboral</legend>
        <div className="preference-grid">
          {preferences.map((option) => (
            <button
              className={Number(form.preferencia) === option.value ? 'preference active' : 'preference'}
              key={option.value}
              type="button"
              onClick={() => onChange('preferencia', option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <button className="button-primary" disabled={loading} type="submit">
        {loading ? 'Analizando perfil...' : 'Analizar mi perfil'}
      </button>
    </form>
  )
}


export default TalentForm
