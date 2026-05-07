import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './lib/toast'
import { isLoggedIn } from './lib/auth'
import Layout from './components/layout/Layout'
import Onboarding from './components/ui/Onboarding'
import PageTransition from './components/ui/PageTransition'
import AuthScreen from './screens/AuthScreen'
import HomeScreen from './screens/HomeScreen'
import DiscoverScreen from './screens/DiscoverScreen'
import SearchScreen from './screens/SearchScreen'
import ChatScreen from './screens/ChatScreen'
import ActivityScreen from './screens/ActivityScreen'
import ProfileScreen from './screens/ProfileScreen'
import ComposeScreen from './screens/ComposeScreen'
import CreatorProfileScreen from './screens/CreatorProfileScreen'
import PostDetailScreen from './screens/PostDetailScreen'
import CollectionsScreen from './screens/CollectionsScreen'
import ChatDetailScreen from './screens/ChatDetailScreen'
import SettingsScreen from './screens/SettingsScreen'
import EditProfileScreen from './screens/EditProfileScreen'
import { trpc } from './lib/trpc'
import type { Screen } from './lib/types'

const SCREEN_TO_PATH: Record<Screen, string> = {
  home: '/',
  discover: '/discover',
  compose: '/compose',
  chat: '/chat',
  activity: '/activity',
  search: '/search',
  profile: '/profile',
  'edit-profile': '/profile/edit',
  'creator-profile': '/creator',
  'post-detail': '/post',
  collections: '/collections',
  'chat-detail': '/chat/detail',
  settings: '/settings',
}

const PATH_TO_SCREEN: Record<string, Screen> = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([k, v]) => [v, k as Screen])
)

const NAV_SCREENS: Screen[] = ['home', 'discover', 'compose', 'chat', 'activity']

function AppInner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authed, setAuthed] = useState(isLoggedIn)
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem('apsucore_onboarded'))

  const { data: unreadData } = trpc.notifications.unreadCount.useQuery(undefined, { enabled: authed })
  const unreadActivity = unreadData?.count ?? 0

  // Show auth screen when not logged in
  if (!authed) {
    return <AuthScreen onAuth={() => setAuthed(true)} />
  }

  const currentScreen: Screen = PATH_TO_SCREEN[location.pathname] ?? 'home'
  const isNavScreen = NAV_SCREENS.includes(currentScreen)

  function navigateTo(screen: Screen, state?: Record<string, unknown>) {
    navigate(SCREEN_TO_PATH[screen], state ? { state } : undefined)
  }

  function goBack() {
    navigate(-1)
  }

  if (currentScreen === 'compose') {
    return (
      <div className="flex flex-col min-h-dvh bg-bg text-text">
        <main className="flex-1 overflow-y-auto">
          <PageTransition>
            <ComposeScreen onNav={navigateTo} />
          </PageTransition>
        </main>
      </div>
    )
  }

  if (currentScreen === 'chat-detail') {
    return (
      <div className="bg-bg text-text">
        <ChatDetailScreen onBack={goBack} onNav={navigateTo} />
      </div>
    )
  }

  return (
    <>
      <Layout
        active={isNavScreen ? currentScreen : 'home'}
        onNav={navigateTo}
        showHeader={isNavScreen || currentScreen === 'search'}
        unreadActivity={unreadActivity}
      >
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomeScreen onNav={navigateTo} />} />
            <Route path="/discover" element={<DiscoverScreen onNav={navigateTo} />} />
            <Route path="/search" element={<SearchScreen onNav={navigateTo} />} />
            <Route path="/chat" element={<ChatScreen onNav={navigateTo} />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/profile" element={<ProfileScreen onNav={navigateTo} />} />
            <Route path="/creator" element={<CreatorProfileScreen onNav={navigateTo} onBack={goBack} />} />
            <Route path="/post" element={<PostDetailScreen onNav={navigateTo} onBack={goBack} />} />
            <Route path="/collections" element={<CollectionsScreen onBack={goBack} onNav={navigateTo} />} />
            <Route path="/settings" element={<SettingsScreen onBack={goBack} onLogout={() => setAuthed(false)} />} />
            <Route path="/profile/edit" element={<EditProfileScreen onBack={goBack} />} />
            <Route path="*" element={<HomeScreen onNav={navigateTo} />} />
          </Routes>
        </PageTransition>
      </Layout>

      {!onboarded && <Onboarding onFinish={() => setOnboarded(true)} />}
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}
