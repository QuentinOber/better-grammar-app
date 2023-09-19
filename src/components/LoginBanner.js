import React, { useEffect } from 'react'

function LoginBanner() {
  let loginUrl = '#'
  if (user.login_url) {
    loginUrl = user.login_url
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
