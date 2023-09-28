export function useSaveNumberResults(userPoints, selectedLevel) {
  const data = {
    game_results: userPoints,
    game_level: selectedLevel,
  }
  const nonce = wpApiSettings.nonce

  // URL TO FETCH
  const addNumberResultsURL = '/wp-json/better-grammar/v1/add_find_number_result'
  const addPrepositionResultsURL = '/wp-json/better-grammar/v1/add_preposition_result'

  return fetch('/wp-json/better-grammar/v1/add_find_number_result', {
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
