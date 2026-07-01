import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const initialForm = {
  nombre: '',
  precio: '',
  stock: '',
  imagenUrl: '',
}

function App() {
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const cloudinaryReady = useMemo(
    () => Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET && window.cloudinary),
    [],
  )

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/productos`)
      if (!response.ok) {
        throw new Error('No se pudo cargar el catalogo')
      }
      setProductos(await response.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function pedirProducto(producto) {
    setMessage('')
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productoId: producto.id, cantidad: 1 }),
      })

      if (response.status === 409) {
        const data = await response.json()
        throw new Error(data.message || 'No hay stock disponible')
      }

      if (!response.ok) {
        throw new Error('No se pudo registrar el pedido')
      }

      const pedido = await response.json()
      setProductos((actuales) =>
        actuales.map((item) =>
          item.id === pedido.productoId ? { ...item, stock: pedido.stockRestante } : item,
        ),
      )
      setMessage(`Pedido registrado: ${producto.nombre}`)
    } catch (err) {
      setError(err.message)
    }
  }

  function abrirCloudinary() {
    setError('')
    if (!cloudinaryReady) {
      setError('Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET')
      return
    }

    window.cloudinary
      .createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: 'image',
          folder: 'pc3-cafeteria',
        },
        (uploadError, result) => {
          if (uploadError) {
            setError('No se pudo subir la imagen')
            return
          }
          if (result.event === 'success') {
            setForm((current) => ({ ...current, imagenUrl: result.info.secure_url }))
            setMessage('Imagen subida a Cloudinary')
          }
        },
      )
      .open()
  }

  async function crearProducto(event) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        nombre: form.nombre.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagenUrl: form.imagenUrl,
      }

      const response = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Revisa los datos del producto')
      }

      const nuevoProducto = await response.json()
      setProductos((actuales) => [...actuales, nuevoProducto])
      setForm(initialForm)
      setMessage(`Producto creado: ${nuevoProducto.nombre}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  return (
    <main className="app-shell">
      <section className="toolbar">
        <div>
          <p className="eyebrow">PC3 JavaScript Avanzado</p>
          <h1>Cafeteria</h1>
        </div>
        <button className="ghost-button" type="button" onClick={cargarProductos}>
          Actualizar
        </button>
      </section>

      {(message || error) && (
        <div className={error ? 'notice error' : 'notice'}>
          {error || message}
        </div>
      )}

      <section className="content-grid">
        <form className="product-form" onSubmit={crearProducto}>
          <h2>Nuevo producto</h2>
          <label>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={updateField}
              maxLength="120"
              required
            />
          </label>
          <label>
            Precio
            <input
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Stock
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={updateField}
              required
            />
          </label>
          <div className="upload-row">
            <button type="button" className="ghost-button" onClick={abrirCloudinary}>
              Subir imagen
            </button>
            {form.imagenUrl && <span>Imagen lista</span>}
          </div>
          {form.imagenUrl && <img className="preview" src={form.imagenUrl} alt="" />}
          <button className="primary-button" type="submit" disabled={saving || !form.imagenUrl}>
            {saving ? 'Guardando...' : 'Crear producto'}
          </button>
        </form>

        <section className="catalog">
          <h2>Productos</h2>
          {loading ? (
            <p className="muted">Cargando catalogo...</p>
          ) : (
            <div className="product-grid">
              {productos.map((producto) => (
                <article className="product-card" key={producto.id}>
                  <img src={producto.imagenUrl} alt={producto.nombre} />
                  <div className="product-body">
                    <h3>{producto.nombre}</h3>
                    <p>S/ {Number(producto.precio).toFixed(2)}</p>
                    <span className={producto.stock > 0 ? 'stock' : 'stock empty'}>
                      Stock: {producto.stock}
                    </span>
                    <button
                      className="primary-button"
                      type="button"
                      disabled={producto.stock <= 0}
                      onClick={() => pedirProducto(producto)}
                    >
                      {producto.stock > 0 ? 'Pedir' : 'Sin stock'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
