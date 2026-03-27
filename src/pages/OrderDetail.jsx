import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(api.getUrl(`/orders/${id}`), {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, userInfo, navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!order) return <div className="text-center py-10 text-gray-600">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/orders')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h1>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold text-gray-900">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date & Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold mt-1 ${
                      order.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.isPaid
                      ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}`
                      : 'Payment Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Status</p>
                  <span
                    className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold mt-1 ${
                      order.isDelivered
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {order.isDelivered
                      ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}`
                      : 'Processing'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <p className="text-lg font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                <p className="text-gray-700">{order.shippingAddress.address}</p>
                <p className="text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-700">{order.shippingAddress.country}</p>
                <p className="text-gray-700 border-t pt-3">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">₹{item.price}</p>
                  <p className="text-sm text-gray-500">₹{item.price * item.quantity} total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Price Summary</h2>
          <div className="space-y-3 border-b pb-6 mb-6">
            <div className="flex justify-between">
              <p className="text-gray-700">Subtotal</p>
              <p className="font-semibold text-gray-900">₹{order.subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Shipping</p>
              <p className="font-semibold text-gray-900">₹{order.shippingPrice}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-700">Tax (18% GST)</p>
              <p className="font-semibold text-gray-900">₹{order.taxPrice}</p>
            </div>
          </div>
          <div className="flex justify-between text-xl">
            <p className="font-bold text-gray-900">Total</p>
            <p className="font-bold text-green-600">₹{order.totalPrice}</p>
          </div>

          {/* Payment Info */}
          {order.paymentInfo && order.paymentInfo.razorpayPaymentId && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-900">{order.paymentInfo.razorpayPaymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-900">{order.paymentInfo.razorpayOrderId}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
