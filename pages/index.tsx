"use client";
import { HeroParallax } from "@/components/ui/hero-parallax";
import GoogleReviews from "@/components/ui/google-reviews";
import Head from "next/head";
import React from "react";

const hero = () => {
  const products = [
    {
      title: "Bridal Makeup by Anjali Bhutani",
      thumbnail: "/images/Hero/Hero1-min.jpg",
    },
    {
      title: "HD Bridal Makeup Look",
      thumbnail: "/images/Hero/Hero2-min.jpg",
    },
    {
      title: "Traditional Bridal Makeup",
      thumbnail: "/images/Hero/Hero3-min.jpg",
    },
    {
      title: "Party Makeup by Anjali",
      thumbnail: "/images/Hero/Hero4-min.jpg",
    },
    {
      title: "Airbrush Bridal Makeup",
      thumbnail: "/images/Hero/Hero5-min.jpeg",
    },
    {
      title: "Editorial Makeup Look",
      thumbnail: "/images/Hero/Hero6-min.jpg",
    },
    {
      title: "Wedding Makeup Artist Chandigarh",
      thumbnail: "/images/Hero/Hero7-min.jpg",
    },
    {
      title: "Engagement Makeup Look",
      thumbnail: "/images/Hero/Hero8-min.jpg",
    },
    {
      title: "Reception Makeup by Anjali",
      thumbnail: "/images/Hero/Hero9-min.jpg",
    },
    {
      title: "Glam Party Makeup",
      thumbnail: "/images/Hero/Hero10-min.jpeg",
    },
    {
      title: "Bridal Hair and Makeup",
      thumbnail: "/images/Hero/Hero11-min.jpg",
    },
    {
      title: "Destination Wedding Makeup",
      thumbnail: "/images/Hero/Hero12-min.jpeg",
    },
    {
      title: "Mehndi Ceremony Makeup",
      thumbnail: "/images/Hero/Hero13-min.jpg",
    },
    {
      title: "Sangeet Night Makeup Look",
      thumbnail: "/images/Hero/Hero15-min.jpg",
    },
    {
      title: "Professional Makeup Studio Chandigarh",
      thumbnail: "/images/Hero/Hero14-min.jpg",
    },
  ];
  return <>
    <Head>
      <title>Bridal & Party Makeup | Anjali Bhutani - Best Makeup Artist</title>
      <meta name="description" content="Get professional makeup services by Anjali Bhutani. Bridal, HD, and Airbrush makeup available. Book now!" />
    </Head>
    <HeroParallax products={products} />
    {/* <GoogleReviews /> */}
  </>
}

export default hero
