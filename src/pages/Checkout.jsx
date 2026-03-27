import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import axios from "axios";
import api from "../utils/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, user, clearCart } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxPrice = subtotal * 0.18;
  const shippingPrice = subtotal > 500 ? 0 : 50;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("user"));

      // Place order
      const orderRes = await axios.post(
        api.orders,
        {
          cartItems: cart,
          shippingAddress: formData,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      const order = orderRes.data;

      if (paymentMethod === "Razorpay") {
        // Create Razorpay order
        const paymentRes = await axios.post(
          api.createPaymentOrder,
          { amount: totalPrice },
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        const razorpayOrder = paymentRes.data;

        // Open Razorpay checkout
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // Verify payment
              await axios.post(
                api.getUrl(`/orders/${order._id}/payment`),
                {
                  razorpayOrderId: razorpayOrder.id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization: `Bearer ${userInfo?.token}`,
                  },
                }
              );

              clearCart();
              alert("Payment successful! Order placed.");
              navigate(`/order/${order._id}`);
            } catch (error) {
              alert("Payment verification failed");
            }
          },
          prefill: {
            name: formData.fullName,
            email: user?.email,
            contact: formData.phone,
          },
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      } else {
        // COD oder directly confirmed
        clearCart();
        alert("Order placed successfully! You can pay on delivery.");
        navigate(`/order/${order._id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error placing order: " + error.message);
    }

    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="px-8 py-10 text-center">
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />

                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="border p-2 rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-pink-600"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {["COD", "Razorpay", "UPI", "Card"].map((method) => (
                    <label key={method} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="ml-3">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-10">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4 border-b pb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-4 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{shippingPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  );
};

export default Checkout;
