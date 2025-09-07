"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Container from "./Container";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  if (isLoggedIn) return null;

  return (
    <Container className="w-full bg-black p-2 flex justify-center items-center text-white text-xs md:text-sm">
      Sign Up and Get 20% Off on Your First Order &nbsp;
      <Link className="underline" href="/register">
        Sign Up
      </Link>
    </Container>
  );
}
