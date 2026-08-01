import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ChannelsPage } from '@/pages/ChannelsPage'
import { PlannerPage } from '@/pages/PlannerPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { NicheFinderPage } from '@/pages/NicheFinderPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/niche-finder" element={<NicheFinderPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
