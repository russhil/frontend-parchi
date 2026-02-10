"use client"

import { createContext, useContext } from "react"

type UserContextType = {
  name: string
  initials: string
  email: string
  specialty: string
}

const defaultUser: UserContextType = {
  name: process.env.NEXT_PUBLIC_DOCTOR_NAME || "Doctor",
  initials: process.env.NEXT_PUBLIC_DOCTOR_INITIALS || "DR",
  email: process.env.NEXT_PUBLIC_DOCTOR_EMAIL || "doctor@parchi.ai",
  specialty: process.env.NEXT_PUBLIC_DOCTOR_SPECIALTY || "General Physician",
}

const UserContext = createContext<UserContextType>(defaultUser)

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={defaultUser}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
