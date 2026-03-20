const MOCK_DATA = [
  { id: '1', tiktok_id: 'memorymusic', coin_amount: 30, price: 0.29, payment_method: 'VISA', status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', tiktok_id: 'memorymusic', coin_amount: 700, price: 6.99, payment_method: 'VISA', status: 'completed', created_at: new Date(Date.now() - 7200000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', tiktok_id: 'mem0ry_fan', coin_amount: 350, price: 3.49, payment_method: 'Mastercard', status: 'completed', created_at: new Date(Date.now() - 54000000).toISOString(), avatar: 'https://i.pravatar.cc/150?u=3' }
]

const getLocalStorageData = (table) => {
  const data = localStorage.getItem(table)
  if (!data) {
    localStorage.setItem(table, JSON.stringify(MOCK_DATA))
    return MOCK_DATA
  }
  return JSON.parse(data)
}

const updateLocalStorageData = (table, newData) => {
  localStorage.setItem(table, JSON.stringify(newData))
}

export const supabase = {
  from: (table) => ({
    select: () => ({
      order: (column, { ascending = true } = {}) => ({
        limit: (n) => {
          const data = getLocalStorageData(table)
          const sorted = [...data].sort((a, b) => {
            if (ascending) return a[column] > b[column] ? 1 : -1
            return a[column] < b[column] ? 1 : -1
          })
          return Promise.resolve({ data: sorted.slice(0, n), error: null })
        }
      }),
      single: () => {
        const data = getLocalStorageData(table)
        return Promise.resolve({ data: data[0] || null, error: null })
      }
    }),
    insert: (records) => ({
      select: () => ({
        single: () => {
          const data = getLocalStorageData(table)
          const newRecord = { 
            ...records[0], 
            id: Math.random().toString(36).substr(2, 9), 
            created_at: new Date().toISOString() 
          }
          updateLocalStorageData(table, [...data, newRecord])
          return Promise.resolve({ data: newRecord, error: null })
        }
      })
    })
  })
}
