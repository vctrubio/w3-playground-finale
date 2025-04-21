import { hasMetamask } from "./lib/ethers"
import { Navbar } from "./components/Navbar"
import { UserProvider } from "./contexts/UserContext"
import Dev from "./components/Dev"




function App() {
  return (
    <UserProvider>
      <div className="flex flex-col items-center justify-center gap-4">
        <Navbar />
        <div className="p-4 border rounded-xl mx-auto">
          can u hear me. init
        </div>
        <div>
          {hasMetamask() ? "yes" : "no"}
        </div>
      </div>
      <Dev />
    </UserProvider>
  )
}

export default App
