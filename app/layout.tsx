"use client";

import "./globals.css";
import { Provider } from 'react-redux'; // We'll create this
import { store } from "./lib/store";
import Topbar from "./components/Topbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"bg-white"}>
        <Provider store={store}>
          <Topbar/>
          <Navbar/>
          {children}
          <Footer/>
        </Provider>
      </body>
    </html>
  );
}


