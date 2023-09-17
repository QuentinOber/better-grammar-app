import React, { useEffect } from 'react'

function LoginBanner() {
  let loginUrl = '#'
  if (user_status.login_url) {
    loginUrl = user_status.login_url
  }

  return (
    <div className="login-banner">
      <p>Connecte-toi pour garder tes résultats</p>
      <a href={loginUrl}>
        <button className="blue-button">LOGIN</button>
      </a>
    </div>
  )
}

export default LoginBanner
