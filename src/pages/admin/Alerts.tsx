// src/pages/admin/Alerts.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Package, ShoppingCart, Users, Filter, Archive, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AlertsPage = () => {
  // Fetch low stock products
  const { data: lowStockAlerts, isLoading: lowStockLoading } = useQuery({
    queryKey: ['admin-alerts-low-stock'],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, title, stock_quantity, min_stock_level')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (products || [])
        .filter(p => p.stock_quantity <= p.min_stock_level)
        .map(product => ({
          id: product.id,
          type: 'low_stock',
          title: product.title,
          description: `Stock level: ${product.stock_quantity} (Minimum: ${product.min_stock_level})`,
          severity: product.stock_quantity === 0 ? 'critical' : 'warning',
          timestamp: new Date().toISOString(),
          icon: Package
        }));
    }
  });

  // Fetch pending orders
  const { data: orderAlerts, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-alerts-pending-orders'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('id, total, created_at')
        .in('status', ['pending', 'pending_payment', 'processing'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (orders || []).map(order => ({
        id: order.id,
        type: 'pending_order',
        title: `Order #${order.id} Pending`,
        description: `Total: ₹${order.total}`,
        severity: 'info',
        timestamp: order.created_at,
        icon: ShoppingCart
      }));
    }
  });

  // Combine all alerts
  const allAlerts = React.useMemo(() => {
    const lowStock = lowStockAlerts || [];
    const orders = orderAlerts || [];
    
    return [...lowStock, ...orders].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [lowStockAlerts, orderAlerts]);

  const isLoading = lowStockLoading || ordersLoading;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50 border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800',
          icon: 'text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          badge: 'bg-amber-100 text-amber-800',
          icon: 'text-amber-600'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800',
          icon: 'text-blue-600'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800',
          icon: 'text-gray-600'
        };
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'low_stock':
        return 'Low Stock';
      case 'pending_order':
        return 'Pending Order';
      default:
        return 'Alert';
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 p-6 min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-6 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Alerts & Notifications</h1>
            <p className="text-slate-600 mt-2">
              {allAlerts.length} active alert{allAlerts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive All
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Warnings</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allAlerts.filter(a => a.severity === 'warning').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending Items</p>
                <p className="text-2xl font-bold text-slate-900">
                  {allAlerts.filter(a => a.type === 'pending_order').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {allAlerts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-green-50 p-4 rounded-full inline-block mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">All Clear!</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                No active alerts at the moment. Everything is running smoothly.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {allAlerts.map((alert, index) => {
                const styles = getSeverityStyles(alert.severity);
                const IconComponent = alert.icon;
                
                return (
                  <div
                    key={`${alert.type}-${alert.id}`}
                    className={`p-6 hover:bg-slate-50 transition-colors ${styles.bg} border-l-4 ${
                      alert.severity === 'critical' ? 'border-l-red-500' :
                      alert.severity === 'warning' ? 'border-l-amber-500' :
                      'border-l-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-full ${styles.bg}`}>
                          <IconComponent className={`h-5 w-5 ${styles.icon}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`font-semibold text-lg ${styles.text}`}>
                              {alert.title}
                            </h3>
                            <Badge variant="secondary" className={styles.badge}>
                              {getAlertTypeLabel(alert.type)}
                            </Badge>
                          </div>
                          <p className={`text-sm ${styles.text} opacity-90 mb-2`}>
                            {alert.description}
                          </p>
                          <div className="flex items-center text-xs text-slate-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          Resolve
                        </Button>
                        <Button variant="ghost" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;