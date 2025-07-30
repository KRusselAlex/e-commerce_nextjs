import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import CustomButton from "../button/button";

interface ContactFormData {
  firstName: string;
  lastName: string;
  country: string;
  email: string;
  topics: string[];
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [isMapVisible, setIsMapVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
   const [loading, setLoading] = useState(true);

   const onSubmit = (data: ContactFormData) => {
     console.log(data);
     reset();
   };

   const toggleMap = () => {
     setIsMapVisible(!isMapVisible);
     setLoading(true);
   };

   const handleIframeLoad = () => {
     console.log("Iframe loaded!");
     setLoading(false); // Set loading to false once the iframe is loaded
   };

   return (
     <div className="bg-fourthly lg:bg-white  md:py-6">
       <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2">
         <div className="  flex flex-col  gap-6 justify-center py-8 lg:bg-white md:px-12  ">
           <div className="w-full  md:border gap-2 md:gap-8  text-textColor p-2 md:p-8 flex flex-col justify-between   rounded-md">
             <div className="flex flex-col px-2 justify-center items-center md:items-start md:justify-start gap-3">
               <div
                 onClick={() => setContactVisible(!contactVisible)}
                 className="flex items-center gap-3 w-full"
               >
                 <h3 className="text-xl  font-semibold md:font-medium">
                   Contact Information
                 </h3>
                 <span className="md:hidden ">
                   {contactVisible ? <ChevronUp /> : <ChevronDown />}
                 </span>
               </div>

               <p className="hidden md:block">
                 Say something to start a live chat!
               </p>
             </div>
             {/* mobile contact */}
             {contactVisible && (
               <div className="flex flex-col px-3 gap-2 justify-start w-full ">
                 <div className="flex flex-col  gap-3">
                   <div className="flex gap-2 items-center">
                     <span className="text-blue-500 text-xl">
                       <FaPhone size={20} />
                     </span>

                     <p>+1012 3456 789</p>
                   </div>
                   <div className="flex gap-3 items-center">
                     <span className="text-green-500 text-xl">
                       <FaEnvelope size={20} />
                     </span>
                     <p>demo@gmail.com</p>
                   </div>
                   <div className="flex gap-3 items-center">
                     <span className="text-red-500 text-xl">
                       <FaMapMarkerAlt size={20} />
                     </span>
                     <p>Calavi arconville</p>
                   </div>
                 </div>
                 <div className="flex gap-2  justify-start items-center mt-3">
                   <Link
                     href="https://www.facebook.com"
                     aria-label="Facebook"
                     className="transition-transform duration-300 hover:scale-125"
                   >
                     <FaFacebookF size={18} />
                   </Link>
                   <Link
                     href="https://www.instagram.com"
                     aria-label="Instagram"
                     className="transition-transform duration-300 hover:scale-125"
                   >
                     <FaInstagram size={18} />
                   </Link>
                   <Link
                     href="https://www.pinterest.com"
                     aria-label="Pinterest"
                     className="transition-transform duration-300 hover:scale-125"
                   >
                     <FaPinterestP size={18} />
                   </Link>
                   <Link
                     href="https://www.twitter.com"
                     aria-label="Twitter"
                     className="transition-transform duration-300 hover:scale-125"
                   >
                     <FaTwitter size={18} />
                   </Link>
                   <Link
                     href="https://www.tiktok.com"
                     aria-label="TikTok"
                     className="transition-transform duration-300 hover:scale-125"
                   >
                     <SiTiktok size={18} />
                   </Link>
                 </div>
               </div>
             )}

             <div className="hidden md:flex  justify-center items-center md:items-start md:justify-start gap-5">
               <div className="flex gap-3 items-center">
                 <span className="text-blue-500 text-xl">
                   <FaPhone size={20} />
                 </span>

                 <p>+1012 3456 789</p>
               </div>
               <div className="flex gap-3 items-center">
                 <span className="text-green-500 text-xl">
                   <FaEnvelope size={20} />
                 </span>
                 <p>demo@gmail.com</p>
               </div>
               <div className="flex gap-3 items-center">
                 <span className="text-red-500 text-xl">
                   <FaMapMarkerAlt size={20} />
                 </span>
                 <p>Calavi arconville</p>
               </div>
             </div>
             <div className="hidden md:flex gap-4 justify-center md:justify-start items-center">
               <Link
                 href="https://www.facebook.com"
                 aria-label="Facebook"
                 className="transition-transform duration-300 hover:scale-125"
               >
                 <FaFacebookF size={22} />
               </Link>
               <Link
                 href="https://www.instagram.com"
                 aria-label="Instagram"
                 className="transition-transform duration-300 hover:scale-125"
               >
                 <FaInstagram size={22} />
               </Link>
               <Link
                 href="https://www.pinterest.com"
                 aria-label="Pinterest"
                 className="transition-transform duration-300 hover:scale-125"
               >
                 <FaPinterestP size={22} />
               </Link>
               <Link
                 href="https://www.twitter.com"
                 aria-label="Twitter"
                 className="transition-transform duration-300 hover:scale-125"
               >
                 <FaTwitter size={25} />
               </Link>
               <Link
                 href="https://www.tiktok.com"
                 aria-label="TikTok"
                 className="transition-transform duration-300 hover:scale-125"
               >
                 <SiTiktok size={22} />
               </Link>
             </div>
           </div>
           <div className="w-full  px-4 md:pt-8">
             <form
               onSubmit={handleSubmit(onSubmit)}
               className="grid grid-cols-1   items-center gap-5"
             >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
                   <label className="block font-medium text-gray-700">
                     First Name
                   </label>
                   <input
                     {...register("firstName", {
                       required: "First name is required",
                     })}
                     placeholder="Johnathan"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-thirdly focus:border-thirdly transition-shadow shadow-sm hover:shadow-md"
                   />
                   {errors.firstName?.message && (
                     <p className="text-red-500 text-sm">
                       {String(errors.firstName.message)}
                     </p>
                   )}
                 </div>

                 {/* Last Name */}
                 <div className="w-full">
                   <label className="block font-medium text-gray-700">
                     Last Name
                   </label>
                   <input
                     {...register("lastName", {
                       required: "Last name is required",
                     })}
                     placeholder="Alex-Russel"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-thirdly focus:border-thirdly transition-shadow shadow-sm hover:shadow-md"
                   />
                   {errors.lastName?.message && (
                     <p className="text-red-500 text-sm mt-1">
                       {String(errors.lastName.message)}
                     </p>
                   )}
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div>
                   <label className="block font-medium text-gray-700">
                     Country
                   </label>
                   <input
                     {...register("country", {
                       required: "Country is required",
                     })}
                     placeholder="Togo"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-thirdly focus:border-thirdly transition-shadow shadow-sm hover:shadow-md"
                   />
                   {errors.country?.message && (
                     <p className="text-red-500 text-sm">
                       {String(errors.country.message)}
                     </p>
                   )}
                 </div>

                 {/* Email */}
                 <div>
                   <label className="block font-medium text-gray-700">
                     Email
                   </label>
                   <input
                     type="email"
                     {...register("email", {
                       required: "Email is required",
                       pattern: /^\S+@\S+\.\S+$/,
                     })}
                     placeholder="alex@gmail.com"
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-thirdly focus:border-thirdly transition-shadow shadow-sm hover:shadow-md"
                   />
                   {errors.email?.message && (
                     <p className="text-red-500 text-sm">
                       {String(errors.email.message)}
                     </p>
                   )}
                 </div>
               </div>

               <div className="flex flex-col md:flex-row gap-3 w-full">
                 <label className="block font-medium text-gray-700">
                   Select Topics
                 </label>
                 <div className="flex flex-col md:flex-row gap-1 md:gap-3  md:items-center">
                   {["Support", "Feedback", "Shipping", "International"].map(
                     (topic) => (
                       <label
                         key={topic}
                         className="flex items-center font-medium text-gray-700 gap-2"
                       >
                         <input
                           type="checkbox"
                           {...register("topics", {
                             required: "Please select at least one topic",
                           })}
                           value={topic.toLowerCase()} // Convert to lowercase for consistency
                           className="w-4 h-4 checked:bg-thirdly "
                         />
                         <span className="mt-1">{topic}</span>
                       </label>
                     )
                   )}
                 </div>
                 {errors.topics?.message && (
                   <p className="text-red-500 text-sm">
                     {String(errors.topics.message)}
                   </p>
                 )}
               </div>

               {/* Message */}
               <div>
                 <label className="block font-medium text-gray-700">
                   Message
                 </label>
                 <textarea
                   {...register("message", { required: "Message is required" })}
                   placeholder="describe"
                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-thirdly focus:border-thirdly transition-shadow shadow-sm hover:shadow-md"
                   rows={4}
                 ></textarea>
                 {errors.message?.message && (
                   <p className="text-red-500 text-sm">
                     {String(errors.message.message)}
                   </p>
                 )}
               </div>

               {/* Submit Button */}
               <div className="flex justify-start">
                 <CustomButton
                   icon={<FaEnvelope size={20} />}
                   className="text-white py-6 hover:bg-secondary w-full  md:w-fit"
                   type="submit"
                 >
                   Send Message
                 </CustomButton>
               </div>
             </form>
           </div>
         </div>
         <div className="hidden lg:flex w-full relative">
           <div className=" flex items-center w-full h-full justify-center bg-gray-700 bg-opacity-50 text-white text-lg">
             Loading, please wait...
           </div>
           <iframe
             className="w-full h-full shadow-lg absolute"
             onLoad={handleIframeLoad}
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d2.3764!3d6.3776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1948f98e1eaf1bdb%3A0x2ba8bffb47ed0317!2sCotonou%2C+Benin!5e0!3m2!1sen!2s!4v1612435176479!5m2!1sen!2s"
             allowFullScreen={true}
             loading="lazy"
           ></iframe>
         </div>

         {/*mobile Map */}
         <button
           className="flex absolute z-30 bottom-6 right-6 lg:hidden animate-bounce border p-3 bg-primary rounded-full"
           onClick={toggleMap}
         >
           <span className="text-white text-xl">
             <FaMapMarkerAlt size={24} />
           </span>
         </button>

         {isMapVisible && (
           <div className="fixed  inset-0 z-50 bg-white  shadow-lg h-full">
             <div className="absolute top-2 right-2">
               <button
                 onClick={toggleMap}
                 className="text-red-500 text-xl  bg-white p-3 rounded-full"
               >
                 <XCircle size={24} />
               </button>
             </div>
             {loading && (
               <div className=" flex items-center w-full h-full justify-center bg-gray-700 bg-opacity-50 text-white text-lg">
                 Loading, please wait...
               </div>
             )}
             <iframe
               className="w-full h-full"
               onLoad={handleIframeLoad}
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093747!2d2.3764!3d6.3776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1948f98e1eaf1bdb%3A0x2ba8bffb47ed0317!2sCotonou%2C+Benin!5e0!3m2!1sen!2s!4v1612435176479!5m2!1sen!2s"
               allowFullScreen={true}
               loading="lazy"
             ></iframe>
           </div>
         )}
       </div>
     </div>
   );
}
