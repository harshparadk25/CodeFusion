import { Button } from "@/components/ui/button"
import AppRoute from "./AppRoute/appRoute"
import { UserProvider } from "./context/user.context";
import {Toaster} from "sonner"
function App() {
  return (
    <UserProvider>
      <AppRoute />
      <Toaster />
    </UserProvider>
  )
}

export default App;