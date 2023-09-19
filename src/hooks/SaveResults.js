export function saveNumberResults(userPoints, selectedLevel) {
  const data = {
    game_results: userPoints,
    game_level: selectedLevel,
  }
  const nonce = wpApiSettings.nonce

  fetch('/wp-json/better-grammar/v1/add_find_number_result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': nonce,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
