import { Navbar } from "./components/Navbar"
import Login from "./components/Login"
import { useUser } from "./hooks/useUser"

function App() {
  const { user } = useUser()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Navbar />
      {user ? (
        <div>hello user</div>
      ) : (<Login />)}
    </div>
  )
}

export default App
