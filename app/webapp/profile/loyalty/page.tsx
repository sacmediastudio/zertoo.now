import type { Metadata } from "next";
import MyLoyaltyScreen from "./my-loyalty-screen";

export const metadata: Metadata = { title: "Zertoo Eats! | Mis sellos" };

export default function MyLoyaltyPage() {
  return <MyLoyaltyScreen />;
}
