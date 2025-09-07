"use client";
import BestSelling from "./components/BestSelling";
import Brands from "./components/Brands";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import NewArrivals from "./components/NewArrivals";
import RecentReviews from "./components/RecentReviews";
import Topbar from "./components/Topbar";
import CategoryGrid from "./components/CategoryGrid";

export default function Home() {
  return (
   <>
   <Hero/>
   <Brands/>
   <NewArrivals/>
   <BestSelling title="Best Selling" sliceStart={2} sliceEnd={6}/>
   <CategoryGrid />
   <RecentReviews/>
   </>
  );
}
