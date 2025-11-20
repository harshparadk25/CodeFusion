import React, { useContext, useState } from "react"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { motion } from "framer-motion"
import axios from "../config/axios"
import { UserContext } from "../context/user.context"
import { toast } from "sonner"
import RobotCompanion from "../components/robot/RobotCompanion"
import TextType from "../components/GSAPui/TextType"
import SplitText from "../components/GSAPui/SplitText"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isTypingPassword, setIsTypingPassword] = useState(false)
  const [loginStatus, setLoginStatus] = useState(null)

  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post("/users/login", { email, password })
      .then((res) => {
        console.log(res.data)
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user", JSON.stringify(res.data.user))
        setUser(res.data.user)
        setLoginStatus("success")
        toast.success("Login successful!")
        navigate("/")
      })
      .catch((err) => {
        setLoginStatus("error")
        toast.error(err.response?.data?.message || "Login failed")
        console.error(err)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510] overflow-hidden relative">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#050510_100%)]">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      </div>

     
      <div className="flex w-full max-w-6xl relative z-10 rounded-2xl overflow-hidden border border-cyan-400/10 shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-lg">
       
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 items-center justify-center bg-[#0d1117] border-r border-[#30363d]"
        >
          <div className="flex flex-col items-center justify-center">
            <RobotCompanion
              isPasswordFocused={isTypingPassword}
              loginStatus={loginStatus}
            />
            <span className="text-gray-400 mt-4 text-lg tracking-wide">
              <TextType
                text={["I am watching you type...", "Securely logging you in...", "Welcome back, user!"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
              />
            </span>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 flex justify-center items-center p-8 bg-[#0d1117]/80"
        >
          <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-cyan-400/20 shadow-[0_0_30px_rgba(56,189,248,0.25)] relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white tracking-wide">
                Welcome back to{" "}
                <span className="text-cyan-400"><SplitText
                  text="CodeFusion"
                  className="text-md font-semibold text-center"
                  delay={230}
                  duration={0.6}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                /></span>
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Unite. Build. Evolve.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="email"
                  className="text-gray-300 tracking-wide"
                >
                  Email
                </Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="mt-2 block w-full bg-white/5 border border-cyan-500/20 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-300 tracking-wide"
                >
                  Password
                </Label>
                <Input
                  onFocus={() => setIsTypingPassword(true)}
                  onBlur={() => setIsTypingPassword(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="mt-2 block w-full bg-white/5 border border-purple-500/20 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] hover:scale-[1.02] transition duration-300"
              >
                Enter System
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="text-sm text-gray-400 hover:text-cyan-400 transition"
              >
                Don’t have an account?{" "}
                <span className="text-cyan-400">Register</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
