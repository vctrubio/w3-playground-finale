import { hasMetamask } from "./lib/ethers"
import { Navbar } from "./components/Navbar"

function App() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <Navbar />
      <div className="p-4 border rounded-xl mx-auto">
        can u hear me. init
      </div>
      <div>
        {hasMetamask() ? "yes" : "no"}
      </div>
    </div>
  )
}

export default App
