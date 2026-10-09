import type { Metadata } from "next";
import ProfileScreen from "./profile-screen";

export const metadata: Metadata = { title: "Zertoo Eats! | Mi cuenta" };

export default function ProfilePage() {
  return <ProfileScreen />;
}
