import { useEffect, useState } from "react"
import Lottie from "lottie-react"
import Robot from "../../assets/robot.json"

export default function RobotCompanion({ isPasswordFocused, loginStatus }) {
  const [mood, setMood] = useState("idle")
  const [lastMove, setLastMove] = useState(Date.now())

 
  const [options, setOptions] = useState({
    loop: true,
    autoplay: true,
    animationData: Robot,
  })

  
  useEffect(() => {
    const handleMove = () => {
      setLastMove(Date.now())
      if (mood !== "look") setMood("look")
    }
    window.addEventListener("mousemove", handleMove)
    return () => window.removeEventListener("mousemove", handleMove)
  }, [mood])

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMove > 5000 && mood !== "idle") {
        setMood("idle")
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [lastMove, mood])


  useEffect(() => {
    if (isPasswordFocused) setMood("password")
    else setMood("idle")
  }, [isPasswordFocused])

  
  useEffect(() => {
    if (loginStatus === "success") setMood("success")
    else if (loginStatus === "error") setMood("error")
  }, [loginStatus])

  // 🎬 Smooth transitions between moods
  useEffect(() => {
    // ⚙️ This logic assumes a single looping animation
    // You can later replace it with mood-specific Lottie files if desired
    switch (mood) {
      case "idle":
        setOptions({ ...options, loop: true, autoplay: true })
        break
      case "look":
        setOptions({ ...options, loop: true, autoplay: true })
        break
      case "password":
        setOptions({ ...options, loop: true, autoplay: true })
        break
      case "success":
        setTimeout(() => setMood("idle"), 3000)
        break
      case "error":
        setTimeout(() => setMood("idle"), 3000)
        break
      default:
        setOptions({ ...options, loop: true, autoplay: true })
    }
  }, [mood])

  return (
    <div
      className="flex justify-center items-center transition-transform duration-300"
      onMouseEnter={() => setMood("hover")}
      onMouseLeave={() => setMood("idle")}
    >
      <div
        className={`transition-all duration-300 ${
          mood === "hover" ? "scale-110" : "scale-100"
        }`}
      >
        <Lottie animationData={Robot} loop={true} autoplay={true} style={{ width: 300, height: 300 }} />
      </div>
    </div>
  )
}
