"use client";
import { useState } from "react";

export default function PaymentSection() {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div className="flex flex-col items-center space-y-4 py-8 px-4">
      <h1 className="text-2xl font-semibold">Complete Your Payment</h1>
      <p className="text-center text-sm text-gray-500">
        Choose your preferred payment method to complete the transaction.
      </p>

      <form className="space-y-4">
        <div className="flex items-center">
          <input
            type="radio"
            id="mtn"
            name="paymentMethod"
            value="MTN"
            checked={paymentMethod === "MTN"}
            onChange={handleMethodChange}
            className="h-5 w-5"
          />
          <label htmlFor="mtn" className="ml-2">
            MTN
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="moven"
            name="paymentMethod"
            value="Moven"
            checked={paymentMethod === "Moven"}
            onChange={handleMethodChange}
            className="h-5 w-5"
          />
          <label htmlFor="moven" className="ml-2">
            Moven
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="celtis"
            name="paymentMethod"
            value="Celtis"
            checked={paymentMethod === "Celtis"}
            onChange={handleMethodChange}
            className="h-5 w-5"
          />
          <label htmlFor="celtis" className="ml-2">
            Celtis
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="creditCard"
            name="paymentMethod"
            value="CreditCard"
            checked={paymentMethod === "CreditCard"}
            onChange={handleMethodChange}
            className="h-5 w-5"
          />
          <label htmlFor="creditCard" className="ml-2">
            Credit Card
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="radio"
            id="bitcoin"
            name="paymentMethod"
            value="Bitcoin"
            checked={paymentMethod === "Bitcoin"}
            onChange={handleMethodChange}
            className="h-5 w-5"
          />
          <label htmlFor="bitcoin" className="ml-2">
            Bitcoin
          </label>
        </div>
      </form>
    </div>
  );
}
