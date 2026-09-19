import { useState } from 'react'
import './App.css'
import './styles/refinement.css'
import { AIAssistantDrawer } from './components/AIAssistantDrawer'
import { QuickActionDrawer } from './components/QuickActionDrawer'
import { SideNavigation } from './components/SideNavigation'
import { riskAlerts, wealthClients } from './data'
import { ClientCenter } from './pages/ClientCenter'
import { ClientDetail } from './pages/ClientDetail'
import { Dashboard } from './pages/Dashboard'
import type { PageKey, RiskAlert } from './types'

function App() {
  const [riskContext, setRiskContext] = useState<RiskAlert | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<PageKey>('dashboard')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [quickRisk, setQuickRisk] = useState<RiskAlert | null>(null)
  const [assistantOpen, setAssistantOpen] = useState(false)

  const openClient = (clientId: string) => {
    setRiskContext(null)
    setSelectedClientId(clientId)
    setActivePage('clients')
    setAssistantOpen(false)
    setQuickRisk(null)
  }

  const renderPage = () => {
    if (activePage === 'dashboard') {
      return (
        <Dashboard
          onOpenRisk={setQuickRisk}
          assistantOpen={assistantOpen}
          onToggleAssistant={() => setAssistantOpen((current) => !current)}
        />
      )
    }

    const selectedRisk = riskAlerts.find(item => item.id === selectedClientId)
    const selectedClient = wealthClients.find((client) => client.id === selectedClientId) || (selectedRisk ? { id: selectedRisk.id, name: selectedRisk.customer, initials: selectedRisk.customer[0], clientNo: '待补充', aum: '待核实', walletShare: 0, status: '风险关注' as const, segment: '成长客户' as const, recentContact: '待核实', nextAction: selectedRisk.summary, favorite: false, isMine: true, accent: selectedRisk.accent } : undefined)
    if (selectedClient) return <ClientDetail key={selectedClient.id} client={selectedClient} initialRisk={riskContext} onReturnRisk={() => { setActivePage('dashboard'); setQuickRisk(riskContext) }} onBack={() => setSelectedClientId(null)} />
    return <ClientCenter onOpenClient={openClient} />
  }

  return (
    <div className={`wealth-app ${collapsed ? 'is-collapsed' : ''} ${assistantOpen ? 'is-assistant-open' : ''}`}>
      <SideNavigation
        collapsed={collapsed}
        activePage={activePage}
        onCollapse={() => setCollapsed((current) => !current)}
        onNavigate={(page) => {
          setActivePage(page)
          setSelectedClientId(null)
          if (page !== 'dashboard') setAssistantOpen(false)
        }}
      />
      <main className={`app-content ${activePage === 'clients' && selectedClientId ? 'is-client-detail' : ''}`}>{renderPage()}</main>

      <QuickActionDrawer
        key={quickRisk?.id || 'closed'}
        risk={quickRisk}
        open={Boolean(quickRisk)}
        onClose={() => setQuickRisk(null)}
        onOpenClient={(id) => { const risk = quickRisk; openClient(id); setRiskContext(risk) }}
      />
      <AIAssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
  )
}

export default App
