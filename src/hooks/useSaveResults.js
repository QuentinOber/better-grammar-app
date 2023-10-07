export function useSaveResults(userPoints, selectedLevel, activity) {
  const data = {
    game_results: userPoints,
    game_level: selectedLevel,
  }
  const nonce = wpApiSettings.nonce

  // URL TO FETCH
  let urlToFetch = ''

  switch (activity) {
    case 'number':
      urlToFetch = '/wp-json/better-grammar/v1/add_find_number_result'
      break
    case 'preposition':
      urlToFetch = '/wp-json/better-grammar/v1/add_find_preposition_result'
      break
    default:
      urlToFetch = ''
      break
  }

  return fetch(urlToFetch, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error('Error:', error)
      throw error
    })
}
