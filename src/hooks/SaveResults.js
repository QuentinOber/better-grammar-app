export function saveNumberResults(userPoints, selectedLevel) {
  const data = {
    game_results: userPoints,
    game_level: selectedLevel,
  }
  const nonce = wpApiSettings.nonce

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
      console.log('Success:', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error)
      throw error
    })
}
