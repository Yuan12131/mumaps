"use client";

import React from "react";
import MainBanner from "./components/MainBanner";
import SearchBanner from "./components/SearchBanner";
import RecommandBanner from "./components/RecommandBanner";
import Footer from "./components/Footer";

function Index() {
  return (
    <>
      <MainBanner />
      <SearchBanner />
      <RecommandBanner />
      <Footer />
    </>
  );
}

export default Index;
