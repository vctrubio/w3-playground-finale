import { hasMetamask } from "./lib/ethers"

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
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
