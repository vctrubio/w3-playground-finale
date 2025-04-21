import { Navbar } from "./components/Navbar"
import Login from "./components/Login"
import { useGame } from "./hooks/useGame"
import { BoxContainer } from "./components/boxify/BoxInterface"
import Logo from "./components/Logo"
import UserBox from "./components/boxify/UserBox"

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
    component: Logo,
    theme: {
      dark: "bg-blue-800",
      light: "bg-blue-200",
    },
  },
  {
    label: "Game",
    component: Logo,
    theme: {
      dark: "bg-green-800",
      light: "bg-green-200",
    },
  },
  {
    label: "Contract Events",
    component: Logo,
    theme: {
      dark: "bg-purple-800",
      light: "bg-purple-200",
    },
  }
]

function App() {
  const { game } = useGame()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Navbar />
      {game ?
        <div className="w-full max-w-4xl">
          <BoxContainer modules={boxModules} />
        </div>
        :
        (<Login />)
      }
    </div>
  )
}

export default App
