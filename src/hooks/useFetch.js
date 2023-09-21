import { useState, useEffect } from 'react'

// added the shouldFetch for asynchronous (like waiting for the results to be saved before displaying score board)
function useFetch(url, shouldFetch = true) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!shouldFetch) return
    if (!url) {
      return
    }

    const nonce = wpApiSettings?.nonce || ''

    if (!nonce) {
      console.error('Nonce is missing')
      return
    }

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((json) => setData(json))
      .catch((error) => {
        console.error('Error fetching data:', error)
        setError(error)
      })
  }, [url, shouldFetch])

  return { data, error }
}

export default useFetch
