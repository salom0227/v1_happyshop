"use client"
import { useState } from "react"

export default function ContactPage() {
  const [name, setName] = useState("")

  return (
    <div style={{padding: "40px", color: "white"}}>
      <h1>Aloqa sahifasi ishlayapti</h1>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Test" style={{color:"black"}} />
      <p>{name}</p>
    </div>
  )
}
