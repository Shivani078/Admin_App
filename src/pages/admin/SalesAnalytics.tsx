import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { format } from 'date-fns';
import React from 'react';
import { Line } from 'react-chartjs-2';

// Initialize Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  user_id: string;
  updated_at: string;
  order_number?: string;
  payment_method?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  delivery_address?: string;
  delivery_city?: string;
  delivery_state?: string;
  delivery_zip_code?: string;
  payment_id?: string;
  payment_order_id?: string;
  payment_signature?: string;
  admin_visible?: boolean;
  cancelled_at?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  profiles?: {
    name?: string;
    email?: string;
  };
  order_items?: Array<{
    id: string;
    quantity: number;
    price: number;
    products?: {
      title: string;
      price: string;
      image: string;
    };
  }>;
}

interface SalesAnalyticsProps {
  orders: Order[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ orders }) => {
  // Calculate sales data
  const calculateSalesData = (orders: Order[]) => {
    const salesByMonth: Record<string, number> = {};
    orders.forEach(order => {
      const month = format(new Date(order.created_at), 'MMM yyyy');
      salesByMonth[month] = (salesByMonth[month] || 0) + (order.total || 0);
    });

    const labels = Object.keys(salesByMonth);
    const data = Object.values(salesByMonth);

    return { labels, data };
  };

  // Calculate order statistics
  const calculateOrderStats = (orders: Order[]) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { totalOrders, totalRevenue, averageOrderValue, statusCounts };
  };

  const salesData = calculateSalesData(orders);
  const orderStats = calculateOrderStats(orders);

  const lineChartData = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Monthly Sales',
        data: salesData.data,
        fill: false,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Sales Trend',
      },
    },
  };

  return (
    <main className="pt-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sales Analytics</h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Comprehensive overview of your store performance and sales trends
              </p>
            </div>
          </div>
        </header>

        {/* Sales Overview Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Total Orders</div>
                <div className="text-3xl font-bold text-slate-900">{orderStats.totalOrders}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-slate-900">₹{orderStats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500 font-medium mb-1">Average Order Value</div>
                <div className="text-3xl font-bold text-slate-900">₹{orderStats.averageOrderValue.toFixed(2)}</div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Sales Trend Section */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Sales Trend</h2>
            <div className="h-[300px]">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </section>

        {/* Order Status Distribution */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Order Status Distribution</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(orderStats.statusCounts).map(([status, count]) => (
                <div
                  key={status} 
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <h4 className="text-sm font-medium text-slate-700 capitalize mb-2">{status}</h4>
                  <p className="text-2xl font-bold text-slate-900">{count}</p> 
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Recent Orders</h3>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">
                      Order #{order.order_number || order.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {order.profiles?.name || order.customer_name || 'Unknown Customer'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">₹{order.total?.toFixed(2) || '0.00'}</div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                      order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                      order.status === 'pending' || order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-200' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {orders.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-lg font-medium mb-2">No orders found</div>
                <div className="text-sm">Start selling to see analytics data</div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

// AnalyticsTab component that fetches data and renders SalesAnalytics
const AnalyticsTab: React.FC = () => {
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery<Order[]>({
    queryKey: ['admin-orders-analytics'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds);

      const ordersWithProfiles = ordersData.map(order => ({
        ...order,
        profiles: profilesData?.find(profile => profile.id === order.user_id)
      }));

      const ordersWithItems = await Promise.all(
        (ordersWithProfiles || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select(`
              *,
              products (
                title, price, image
              )
            `)
            .eq('order_id', order.id);

          return {
            ...order,
            order_items: itemsData || []
          };
        })
      );

      return ordersWithItems as Order[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  if (ordersLoading) {
    return (
      <div className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center py-12">
              <div className="inline-flex items-center px-6 py-3 font-semibold leading-6 text-sm shadow rounded-lg text-blue-600 bg-blue-50 border border-blue-200 transition ease-in-out duration-150">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading analytics data...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="pt-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="text-center py-12">
              <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-6 inline-block max-w-md">
                <div className="font-semibold mb-2">Error loading analytics</div>
                <div className="text-sm text-red-600">{ordersError.message}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <SalesAnalytics orders={orders} />;
};

export default AnalyticsTab;