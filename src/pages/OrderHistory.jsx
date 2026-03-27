import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(api.myOrders, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo, navigate]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-gray-900">{order._id.slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-semibold text-gray-900">₹{order.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isDelivered
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.isDelivered ? 'Delivered' : 'Processing'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  {order.orderItems.length} item(s) • {order.paymentMethod}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
