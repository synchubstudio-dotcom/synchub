"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AppProvider({
  children,
}: Props) {
  return children;
}