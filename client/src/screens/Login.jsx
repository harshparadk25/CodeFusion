import React, { useState } from "react"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import axios from "../config/axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isTypingPassword, setIsTypingPassword] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/users/login', { email, password })
    .then((res)=>{
        console.log(res.data);
        navigate("/");
    }).catch((err)=>{
        console.error(err);
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050510]">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#050510_100%)]">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-cyan-400/20 shadow-[0_0_30px_rgba(56,189,248,0.25)] relative z-10"
      >
        
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            {isTypingPassword ? (
              <motion.div
                key="active"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_40px_rgba(56,189,248,0.6)] flex items-center justify-center"
              >
                <div className="w-6 h-6 rounded-full bg-black animate-ping"></div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Welcome back to <span className="text-cyan-400">CodeFusion</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Unite. Build. Evolve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-300 tracking-wide">
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
            <Label htmlFor="password" className="text-gray-300 tracking-wide">
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
            Don't have an account? <span className="text-cyan-400">Register</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
