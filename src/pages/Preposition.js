import React, { useEffect } from 'react'
import PageLayout from '../components/PageLayout'
import Loader from '../components/Loader'

function Preposition() {
  return (
    <PageLayout>
      <h1 className="t-center " style={{ marginBottom: '80px' }}>
        Construction en cours 🏗️
      </h1>
      <Loader />
    </PageLayout>
  )
}

export default Preposition
