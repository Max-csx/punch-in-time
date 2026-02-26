import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme-provider'
import AppLayout from '@/components/layout/AppLayout'
import Home from '@/pages/Home'
import Stats from '@/pages/Stats'
import Library from '@/pages/Library'
import Profile from '@/pages/Profile'
import PunchIn from '@/pages/PunchIn'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/punch-in" element={<PunchIn />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/library" element={<Library />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
