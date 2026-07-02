const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const fallback = `Error ${response.status}`
    try {
      const data = await response.json()
      throw new Error(data.message || data.error || fallback)
    } catch (err) {
      throw new Error(err.message || fallback)
    }
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function predictTalent(payload) {
  return request('/api/talent-match/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getHistory() {
  return request('/api/talent-match/history')
}

export function getEvaluation(id) {
  return request(`/api/talent-match/history/${id}`)
}

export function deleteEvaluation(id) {
  return request(`/api/talent-match/history/${id}`, {
    method: 'DELETE',
  })
}
