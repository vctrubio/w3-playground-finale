import { Navbar } from "./components/Navbar"
import Login from "./components/Login"
import { useGame } from "./hooks/useGame"
import { GameProvider } from './contexts/GameContext';

function App() {
  const { game } = useGame()

  return (
    <GameProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <Navbar />
        {game ?
          (<div>{game.User.address}</div>)
          :
          (<Login />)
        }
      </div>
    </GameProvider>
  )
}

export default App
