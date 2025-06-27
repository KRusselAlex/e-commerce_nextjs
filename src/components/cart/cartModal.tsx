// "use client";

// import React, {  useState } from "react";
// import { ShoppingCart } from "lucide-react";
// import { useCartStore } from "@/store/cartStore";
// import CartItemCard from "./cartItem";

// const CartModal: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   // const [cartItems, setCartItems] = useState([]);
//   const { cartItems} = useCartStore();

//   // const user =
//   //   typeof window !== "undefined"
//   //     ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
//   //     : null;

//   // useEffect(() => {
//   //   const loadCart = async () => {
//   //     try {
//   //       await fetchCart(user.id);
      
//   //     } catch (error) {
//   //       console.error("Erreur lors du chargement du panier:", error);
        
//   //     }
//   //   };

//   //   loadCart();
//   // }, [cartItems]);

//   return (
//     <div>
//       <button onClick={() => setIsOpen(true)} className="relative">
//         <ShoppingCart className="w-6 h-6 transition-transform duration-300 hover:scale-125" />
//         {cartItems.length > 0 && (
//           <span className="absolute -top-1 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
//             {cartItems.length}
//           </span>
//         )}
//       </button>

//       <div
//         className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full z-30 bg-fourthly shadow-lg transform transition-transform duration-500 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="p-4">
//           <button
//             onClick={() => setIsOpen(false)}
//             className="mb-4 text-gray-600"
//           >
//             ✖ Fermer
//           </button>
//           <h2 className="text-xl font-semibold mb-4 text-black">
//             Votre Panier
//           </h2>
//           <div className="grid grid-cols-1 gap-4">
//             {cartItems.length > 0 ? (
//               cartItems.map((item) => (
//                 <CartItemCard
//                   key={item.productId}
//                   id={item.productId}
//                   name={item.name}
//                   price={item.price}
//                   image={item.image || "/placeholder.jpg"}
//                   quantity={item.quantity}
//                 />
//               ))
//             ) : (
//               <p className="text-center text-black">Votre panier est vide.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartModal;


"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartItemCard from "./cartItem";
import { toast } from "sonner";



const CartModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, fetchCart } = useCartStore();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userFeudjo") || "null")
      : null;
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (user && user.id) {
          await fetchCart(user.id);
        } else {
          console.warn("Aucun utilisateur trouvé dans le localStorage.");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du panier:", error);
      }
    };

    loadCart();
  }, []);

  const handleCheckout = () => {
    // This is where you would initiate the payment process
    // alert("Redirection vers le paiement...");
    // You could redirect to /checkout or trigger Stripe/PayPal, etc.
    toast.error(
      "Nous avaons des problèmes avec le paiement, veuillez contacter le service client directment pour passer command"
    );
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="relative">
        <ShoppingCart className="w-6 h-6 transition-transform duration-300 hover:scale-125" />
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
            {cartItems.length}
          </span>
        )}
      </button>

      <div
        className={`fixed top-0 right-0 w-full sm:w-1/2 md:w-1/3 h-full z-30 bg-fourthly shadow-lg transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <button
              onClick={() => setIsOpen(false)}
              className="mb-4 text-gray-600"
            >
              ✖ Fermer
            </button>
            <h2 className="text-xl font-semibold mb-4 text-black">
              Votre Panier
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItemCard
                    key={item.productId}
                    id={item.productId}
                    name={item.name}
                    price={item.price}
                    image={item.image || "/placeholder.jpg"}
                    quantity={item.quantity}
                  />
                ))
              ) : (
                <p className="text-center text-black">Votre panier est vide.</p>
              )}
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              🛒 Passer au paiement
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;

