const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const supabase = {
  from: (table) => ({
    select: () => ({
      order: (column, { ascending = true } = {}) => ({
        limit: (n) => fetch(`${API_URL}/${table}?_sort=${column}&_order=${ascending ? 'asc' : 'desc'}&_limit=${n}`)
          .then(res => res.json())
          .then(data => ({ data, error: null }))
          .catch(error => ({ data: null, error }))
      }),
      single: () => fetch(`${API_URL}/${table}`)
        .then(res => res.json())
        .then(data => ({ data: Array.isArray(data) ? data[0] : data, error: null }))
        .catch(error => ({ data: null, error }))
    }),
    insert: (records) => ({
      select: () => ({
        single: () => fetch(`${API_URL}/${table}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(records[0])
        })
          .then(res => res.json())
          .then(data => ({ data, error: null }))
          .catch(error => ({ data: null, error }))
      })
    })
  })
}
