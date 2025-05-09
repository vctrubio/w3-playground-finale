import { useGame } from "./hooks/useGame"
import { Navbar } from "./components/Navbar"
import { BoxContainer } from "./components/boxify/BoxInterface"
import Login from "./components/Login"
import UserBox from "./components/boxify/UserBox"
import AbiBox from "./components/boxify/AbiBox"
import Notifications from "./components/Notifications"
import GameBox from "./components/boxify/GameBox"
import Footer from "./components/Footer"
import EventBox from "./components/boxify/EventBox"

const boxModules: BoxProps[] = [
  {
    label: "User Profile",
    component: UserBox,
    theme: {
      dark: "bg-blue-600",
      light: "bg-blue-400",
    },
  },
  {
    label: "Contract ABI",
    component: AbiBox,
    theme: {
      dark: "bg-blue-800",
      light: "bg-blue-200",
    },
  },
  {
    label: "Contract Events",
    component: EventBox,
    theme: {
      dark: "bg-purple-800",
      light: "bg-purple-200",
    },
  },
  {
    label: "Game",
    component: GameBox,
    theme: {
      dark: "bg-green-800",
      light: "bg-green-200",
    },
  },
]

function App() {
  const { game, initGameTheory } = useGame()

  // Handle login with explicit user action
  const handleLogin = async () => {
    try {
      await initGameTheory()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Navbar />
      <Notifications />
      {game ?
        <div className="w-full max-w-4xl">
          <BoxContainer modules={boxModules} />
        </div>
        :
        (<Login onLogin={handleLogin} />)
      }
      <Footer />
    </div>
  )
}

export default App
