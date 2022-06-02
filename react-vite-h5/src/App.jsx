import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import routes from '@/router'
import NavBar from '@/components/NavBar'

function App() {
  const location = useLocation()
  const { pathname } = location
  const needNav = ['/', '/data', '/user']
  const [showNav, setShowNav] = useState(false)
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname])

  return (
    <>
      <Routes>
        {
          routes.map(route => <Route exact key={route.path} path={route.path} element={<route.component />}/>)
        }
      </Routes>
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
