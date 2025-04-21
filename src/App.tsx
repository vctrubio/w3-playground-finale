import { Navbar } from "./components/Navbar"
import Login from "./components/Login"
import { useGame } from "./hooks/useGame"

function App() {
  const { game } = useGame()

  return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Navbar />
        {game ?
          (<div>{game.User.address}</div>)
          :
          (<Login />)
        }
      </div>
  )
}

export default App
