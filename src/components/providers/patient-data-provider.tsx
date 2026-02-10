"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getPatient } from "@/lib/api"
import type { PatientPageData } from "@/types"

type PatientDataContextType = {
  data: PatientPageData | null
  loading: boolean
  error: boolean
  refresh: () => Promise<void>
  patientId: string
}

const PatientDataContext = createContext<PatientDataContextType | undefined>(undefined)

export function PatientDataProvider({
  patientId,
  children,
}: {
  patientId: string
  children: React.ReactNode
}) {
  const [data, setData] = useState<PatientPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await getPatient(patientId)
      setData(result)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <PatientDataContext.Provider value={{ data, loading, error, refresh, patientId }}>
      {children}
    </PatientDataContext.Provider>
  )
}

export function usePatientData() {
  const context = useContext(PatientDataContext)
  if (!context) {
    throw new Error("usePatientData must be used within a PatientDataProvider")
  }
  return context
}
