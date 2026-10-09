"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ReportFormData = {
  category: string;
  contextType: string;
  referenceUrlOrId: string;
  description: string;
  evidenceNotes: string;
  isUrgentSafetyThreat: boolean;
  contactEmail: string;
  isAnonymous: boolean;
};

interface ReportFormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: ReportFormData;
  updateFormData: (data: Partial<ReportFormData>) => void;
  selectCategory: (category: string) => void;
  isSubmitted: boolean;
  setIsSubmitted: (submitted: boolean) => void;
  resetForm: () => void;
}

const initialFormData: ReportFormData = {
  category: "",
  contextType: "Listing",
  referenceUrlOrId: "",
  description: "",
  evidenceNotes: "",
  isUrgentSafetyThreat: false,
  contactEmail: "",
  isAnonymous: false,
};

const ReportFormContext = createContext<ReportFormContextType | undefined>(undefined);

export function ReportFormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReportFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (data: Partial<ReportFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const selectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  return (
    <ReportFormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateFormData,
        selectCategory,
        isSubmitted,
        setIsSubmitted,
        resetForm,
      }}
    >
      {children}
    </ReportFormContext.Provider>
  );
}

export function useReportForm() {
  const context = useContext(ReportFormContext);
  if (!context) {
    throw new Error("useReportForm must be used within a ReportFormProvider");
  }
  return context;
}
