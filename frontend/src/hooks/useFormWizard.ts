import { useState, useEffect, useCallback } from 'react'
import type { DeclarationData } from '@/types/declaration'
import { DEFAULT_declarationData } from '@/types/declaration'

const STORAGE_KEY = 'impotfacile_declaration_draft'

function loadDraft(): DeclarationData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return structuredClone(DEFAULT_declarationData)
}

export function useFormWizard() {
  const [data, setData] = useState<DeclarationData>(loadDraft)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const save = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  useEffect(() => {
    save()
  }, [data, save])

  const updateStep = <K extends keyof DeclarationData>(
    stepKey: K,
    updater: (prev: DeclarationData[K]) => DeclarationData[K],
  ) => {
    setData((prev) => ({
      ...prev,
      [stepKey]: updater(prev[stepKey]),
    }))
  }

  const setStep = (stepKey: keyof DeclarationData, value: DeclarationData[keyof DeclarationData]) => {
    setData((prev) => ({ ...prev, [stepKey]: value }))
  }

  const markCompleted = (index: number) => {
    setCompletedSteps((prev) => new Set(prev).add(index))
  }

  const goNext = () => setCurrentStep((s) => s + 1)
  const goPrev = () => setCurrentStep((s) => Math.max(0, s - 1))
  const goTo = (step: number) => setCurrentStep(step)

  const resetForm = () => {
    setData(structuredClone(DEFAULT_declarationData))
    setCurrentStep(0)
    setCompletedSteps(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    data,
    currentStep,
    completedSteps,
    updateStep,
    setStep,
    markCompleted,
    goNext,
    goPrev,
    goTo,
    resetForm,
    save,
  }
}
