import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty } = useAuth();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="px-8 py-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-gray-600 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg shadow flex gap-4"
                >
                  {/* Product Image */}
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100x100?text=No+Image";
                    }}
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-pink-600 font-bold">₹{item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateCartQty(item._id, Math.max(1, item.quantity - 1))
                      }
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartQty(item._id, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border rounded focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        updateCartQty(item._id, item.quantity + 1)
                      }
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow sticky top-10">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 border-b pb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 mb-3"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
