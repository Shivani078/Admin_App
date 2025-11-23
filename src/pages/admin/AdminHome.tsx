import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Users, 
  RefreshCw,
  Plus,
  CheckCircle,
  Eye
} from 'lucide-react';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const AdminHome: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Orders pending count
  const { data: ordersPending = 0, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin', 'ordersPending'],
    queryFn: async () => {
      const { count, error } = await (supabase as any)
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'pending_payment', 'processing']);
      if (error) throw error;
      return count || 0;
    }
  });

  // Live stock map: product_id -> actual_stock
  const { data: liveStock = [] } = useQuery({
    queryKey: ['admin', 'liveStock'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('stock_movements')
        .select('product_id, new_quantity, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const map = new Map<string, number>();
      data?.forEach((m: any) => {
        if (!map.has(m.product_id)) map.set(m.product_id, m.new_quantity);
      });
      return Array.from(map.entries()).map(([product_id, actual_stock]) => ({ product_id, actual_stock }));
    }
  });

  // Products with min_stock_level to compute low stock count
  const { data: products = [] } = useQuery({
    queryKey: ['admin', 'productsBasic'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('id, title, min_stock_level, stock_quantity')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Total sales today
  const { data: totalSalesToday = 0, isLoading: salesLoading } = useQuery({
    queryKey: ['admin', 'salesToday'],
    queryFn: async () => {
      const start = startOfToday();
      const { data, error } = await (supabase as any)
        .from('orders')
        .select('total')
        .gte('created_at', start)
        .in('status', ['paid', 'shipped', 'delivered']);
      if (error) throw error;
      const sum = (data || []).reduce((s: number, o: any) => s + (o.total || 0), 0);
      return sum;
    }
  });

  // Recent customers count (last 7 days)
  const { data: recentCustomers = 0 } = useQuery({
    queryKey: ['admin', 'recentCustomers'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count, error } = await (supabase as any)
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      if (error) throw error;
      return count || 0;
    }
  });

  React.useEffect(() => {
    const channel = supabase
      .channel('admin-home-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'ordersPending'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'salesToday'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'recentCustomers'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_movements' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'liveStock'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'productsBasic'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        queryClient.invalidateQueries({ queryKey: ['admin', 'recentCustomers'] });
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  const lowStockItems = React.useMemo(() => {
    const stockMap = new Map((liveStock as any[]).map((s: any) => [s.product_id, s.actual_stock]));
    return (products as any[])
      .map(p => ({
        id: p.id,
        title: p.title,
        actual_stock: stockMap.has(p.id) ? stockMap.get(p.id) : (p.stock_quantity ?? 0),
        min_stock_level: p.min_stock_level ?? 10,
      }))
      .filter(p => p.actual_stock <= p.min_stock_level);
  }, [products, liveStock]);

  // Recent alerts/activities (low stock or out of stock)
  const alerts = React.useMemo(() => {
    return (lowStockItems as any[]).slice(0, 6).map(p => ({
      id: p.id,
      title: p.title,
      message: p.actual_stock === 0 ? `Out of stock` : `Stock is ${p.actual_stock} (min ${p.min_stock_level})`,
      level: p.actual_stock === 0 ? 'critical' : 'warning'
    }));
  }, [lowStockItems]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
  };

  return (
    <main className="pt-20 bg-slate-50 min-h-screen">
      {/* Increased side spacing with proper container padding */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section with proper spacing */}
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome Back!</h1>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">
                Here's what's happening with your store today
              </p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border flex items-center">
                <Clock className="h-4 w-4 mr-2 hidden sm:block" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        {/* Stats Grid with increased spacing */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
          {/* Orders Pending */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-500 font-medium mb-2">Orders Pending</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {ordersLoading ? '-' : ordersPending}
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Needs attention
                </div>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
            {ordersPending > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4 text-xs"
                onClick={() => navigate('/admin/orders')}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Orders
              </Button>
            )}
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-500 font-medium mb-2">Low Stock</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{lowStockItems.length}</div>
                <div className="text-xs text-slate-400 mt-3 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires restocking
                </div>
              </div>
              <div className="bg-amber-100 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
            {lowStockItems.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4 text-xs"
                onClick={() => navigate('/admin/products')}
              >
                <Plus className="h-3 w-3 mr-1" />
                Manage Stock
              </Button>
            )}
          </div>

          {/* Total Sales Today */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-500 font-medium mb-2">Sales Today</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {salesLoading ? '-' : `₹${totalSalesToday.toLocaleString()}`}
                </div>
                <div className="text-xs text-slate-400 mt-3 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Today's revenue
                </div>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs sm:text-sm text-slate-500 font-medium mb-2">New Customers</div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">{recentCustomers}</div>
                <div className="text-xs text-slate-400 mt-3 flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  Last 7 days
                </div>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-full group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions with proper spacing */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Quick Actions</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="sm:hidden"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <Button 
              onClick={() => navigate('/admin/products')} 
              className="bg-red-600 hover:bg-red-700 h-12 sm:h-14 text-sm sm:text-base font-medium shadow-sm"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Product
            </Button>
            <Button 
              onClick={() => navigate('/admin/orders')} 
              variant="outline" 
              className="h-12 sm:h-14 text-sm sm:text-base font-medium border-slate-300 hover:bg-slate-50"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Process Orders
            </Button>
            <Button 
              onClick={() => navigate('/admin/analytics')}
              variant="outline"
              className="h-12 sm:h-14 text-sm sm:text-base font-medium border-slate-300 hover:bg-slate-50"
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              View Reports
            </Button>
          </div>
        </section>

        {/* Recent Activity / Alerts with proper spacing */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
              Recent Activity & Alerts
              {alerts.length > 0 && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  {alerts.length}
                </span>
              )}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-600 hidden sm:flex"
              onClick={() => navigate('/admin/alerts')} // ✅ Fixed: Added onClick handler
            >
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {alerts.length === 0 ? (
              <div className="p-8 sm:p-10 text-center">
                <div className="bg-green-50 p-4 rounded-lg inline-block">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mt-5">All Clear!</h3>
                <p className="text-slate-600 mt-2">
                  No alerts at the moment. Everything is running smoothly.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {alerts.map((alert, index) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      index === 0 ? 'rounded-t-xl' : ''
                    } ${index === alerts.length - 1 ? 'rounded-b-xl' : ''}`}
                    onClick={() => navigate('/admin/products')}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        alert.level === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900 text-base truncate">
                            {alert.title}
                          </h4>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                            Just now
                          </span>
                        </div>
                        <p className={`text-sm mt-2 ${
                          alert.level === 'critical' ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-slate-50 sm:hidden">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-slate-600"
                    onClick={() => navigate('/admin/alerts')} // ✅ Fixed: Added onClick handler for mobile
                  >
                    View all alerts
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* System Status Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">System Status</h3>
              <p className="text-slate-600 text-sm mt-1">All systems operational</p>
            </div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminHome;