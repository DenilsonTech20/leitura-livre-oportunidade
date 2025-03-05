
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

type SubscriptionPlan = "free" | "premium" | "family";

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  isPremium: boolean;
  remainingReadingTime: number; // in seconds
  updatePlan: (newPlan: SubscriptionPlan) => Promise<void>;
  updateRemainingTime: (newTime: number) => void;
  resetDailyReadingTime: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { toast } = useToast();
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [remainingReadingTime, setRemainingReadingTime] = useState(7200); // 2 hours in seconds
  
  // On mount, load subscription data from localStorage/API
  useEffect(() => {
    // In a real app, this would be an API call to get user subscription status
    const storedPlan = localStorage.getItem("userSubscription") as SubscriptionPlan;
    if (storedPlan) {
      setPlan(storedPlan);
    }
    
    // Load remaining reading time for free users
    if (storedPlan !== "premium" && storedPlan !== "family") {
      const storedTime = localStorage.getItem("remainingReadingTime");
      if (storedTime) {
        setRemainingReadingTime(parseInt(storedTime, 10));
      } else {
        // Initialize with default time
        setRemainingReadingTime(7200); // 2 hours
        localStorage.setItem("remainingReadingTime", "7200");
      }
    }
    
    // Check if we need to reset daily reading time (if it's a new day)
    const lastResetDate = localStorage.getItem("lastReadingTimeReset");
    const today = new Date().toDateString();
    
    if (lastResetDate !== today) {
      // Reset reading time for a new day
      setRemainingReadingTime(7200); // 2 hours
      localStorage.setItem("remainingReadingTime", "7200");
      localStorage.setItem("lastReadingTimeReset", today);
    }
  }, []);
  
  // Save changes to localStorage/API
  useEffect(() => {
    // Only save for free users
    if (plan === "free") {
      localStorage.setItem("remainingReadingTime", remainingReadingTime.toString());
    }
  }, [remainingReadingTime, plan]);
  
  const updatePlan = async (newPlan: SubscriptionPlan) => {
    try {
      // In a real app, this would be an API call to update subscription
      setPlan(newPlan);
      localStorage.setItem("userSubscription", newPlan);
      
      toast({
        title: "Plano atualizado com sucesso",
        description: `Seu plano foi atualizado para ${newPlan === "premium" ? "Premium" : newPlan === "family" ? "Família" : "Gratuito"}.`,
      });
      
      // If upgrading to premium, no need to track reading time
      if (newPlan !== "free") {
        setRemainingReadingTime(Infinity);
      } else {
        resetDailyReadingTime();
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Não foi possível atualizar seu plano. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const updateRemainingTime = (newTime: number) => {
    if (plan !== "free") return; // Only track time for free users
    setRemainingReadingTime(newTime);
  };
  
  const resetDailyReadingTime = () => {
    setRemainingReadingTime(7200); // 2 hours
    localStorage.setItem("remainingReadingTime", "7200");
    localStorage.setItem("lastReadingTimeReset", new Date().toDateString());
  };
  
  return (
    <SubscriptionContext.Provider
      value={{
        plan,
        isPremium: plan === "premium" || plan === "family",
        remainingReadingTime,
        updatePlan,
        updateRemainingTime,
        resetDailyReadingTime,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
