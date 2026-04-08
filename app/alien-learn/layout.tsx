import { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Alien Learn — AI Placement Prep",
  description: "Select your track and let AI build your personalized roadmap.",
};

export default function AlienLearnLayout({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
