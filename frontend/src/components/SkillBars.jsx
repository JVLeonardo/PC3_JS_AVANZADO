const labels = {
  javascript: 'JavaScript',
  react: 'React',
  springBoot: 'Spring Boot',
  pythonDatos: 'Python Datos',
  sql: 'SQL',
}

function SkillBars({ skills }) {
  return (
    <section className="panel compact-panel">
      <div className="section-heading">
        <p className="eyebrow">Skills</p>
        <h2>Barras de habilidad</h2>
        <p>Arrastra los sliders del formulario con el mouse para ajustar tus habilidades.</p>
      </div>
      <div className="bar-list">
        {Object.entries(skills).map(([key, value]) => (
          <div className="bar-item" key={key}>
            <span>
              {labels[key]}
              <strong>{value}%</strong>
            </span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillBars
