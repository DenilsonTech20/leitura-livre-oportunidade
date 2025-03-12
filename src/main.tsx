
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import "./index.css";

// Add polyfill for .prisma/client modules to prevent browser errors
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
  // Create empty modules for Prisma imports to prevent errors
  window.module = window.module || {};
  window.require = window.require || function(modulePath: string) {
    if (modulePath.includes('@prisma/client') || 
        modulePath.includes('.prisma/client')) {
      console.log('Browser attempted to load Prisma client module:', modulePath);
      return { PrismaClient: function() { return {} } };
    }
    throw new Error(`Cannot require module: ${modulePath}`);
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SubscriptionProvider>
      <App />
    </SubscriptionProvider>
  </React.StrictMode>
);
