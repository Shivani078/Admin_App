import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DriverCard from '@/components/admin/DriverCard';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle, Package, User, MapPin, Clock, Send, Loader2, RefreshCw, ChevronLeft, ChevronRight, Users, ShoppingBag } from 'lucide-react';

interface DriverProfile {
    id: string;
    full_name?: string;
    name?: string;
    phone?: string;
    city?: string;
    address?: string;
    created_at?: string;
    latitude?: number;
    longitude?: number;
}

interface OrderItem {
    id: string;
    order_number?: string;
    delivery_address?: string;
    delivery_city?: string;
    delivery_state?: string;
    status?: string;
    created_at?: string;
    latitude?: number;
    longitude?: number;
    name?: string;  // This is customer name in DB
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    order_items?: Array<{
        id: string;
        quantity: number;
        price: number;
        products?: {
            title?: string;
            price?: string | number;
            image?: string;
        };
    }>;
}

const DeliveryAssign: React.FC = () => {
    const [drivers, setDrivers] = useState<DriverProfile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [selectedDriver, setSelectedDriver] = useState<string>('');
    const [assigning, setAssigning] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [assignedOrders, setAssignedOrders] = useState<Record<string, OrderItem[]>>({});
    const [showSuccess, setShowSuccess] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'orders' | 'drivers'>('orders');

    useEffect(() => {
        fetchDrivers();
        fetchOrders();
    }, []);

    const fetchDrivers = async () => {
        try {
            const { data, error } = await supabase
                .from('drivers')
                .select('*')
                .order('full_name', { ascending: true });
            
            if (error) throw error;
            setDrivers(data || []);
        } catch (err) {
            console.error('Error fetching drivers:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        id,
                        quantity,
                        price,
                        products (
                            title,
                            price,
                            image
                        )
                    )
                `)
                .eq('status', 'pending')
                .is('driver_id', null)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setOrders(data || []);
            await fetchAssignedOrders();
        } catch (err) {
            console.error('Error fetching orders:', err);
            setOrders([]);
        }
    };

    const fetchAssignedOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .not('driver_id', 'is', null)
                .order('assigned_at', { ascending: false });
            
            if (error) throw error;
            
            const grouped: Record<string, OrderItem[]> = {};
            (data || []).forEach(order => {
                if (order.driver_id) {
                    if (!grouped[order.driver_id]) grouped[order.driver_id] = [];
                    grouped[order.driver_id].push(order);
                }
            });
            setAssignedOrders(grouped);
        } catch (err) {
            console.error('Error fetching assigned orders:', err);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchDrivers();
        await fetchOrders();
        setSelectedOrders([]);
        setSelectedDriver('');
        setRefreshing(false);
    };

    const toggleOrderSelection = (orderId: string) => {
        setSelectedOrders(prev => 
            prev.includes(orderId) 
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const selectAllOrders = () => {
        if (selectedOrders.length === orders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(orders.map(o => o.id));
        }
    };

    const handleAssignOrders = async () => {
        if (!selectedDriver || selectedOrders.length === 0) {
            alert('Please select a driver and at least one order');
            return;
        }

        setAssigning(true);
        try {
            // IMPORTANT: Keep status as 'pending' - not 'assigned'
            // Driver will change to 'in_progress' when they start delivery
            const { error } = await supabase
                .from('orders')
                .update({
                    driver_id: selectedDriver,
                    assigned_at: new Date().toISOString(),
                    // status remains 'pending' - assignment doesn't change delivery status
                })
                .in('id', selectedOrders);

            if (error) throw error;

            const driverName = drivers.find(d => d.id === selectedDriver)?.full_name || 'Driver';
            setShowSuccess(`Successfully assigned ${selectedOrders.length} order(s) to ${driverName}`);
            
            setSelectedOrders([]);
            setSelectedDriver('');
            await fetchOrders();
            
            setTimeout(() => setShowSuccess(''), 3000);
        } catch (error) {
            console.error('Error assigning orders:', error);
            alert('Failed to assign orders. Please try again.');
        } finally {
            setAssigning(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getOrderTotal = (order: OrderItem) => {
        if (!order.order_items) return 0;
        return order.order_items.reduce((total, item) => {
            const price = typeof item.price === 'number' ? item.price : parseFloat(item.price as any) || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 pb-20 md:pb-0 pt-20 md:pt-24">
            {/* Mobile Header */}
            <div className="md:hidden sticky top-20 z-30 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                Assign Deliveries
                            </h1>
                            <p className="text-xs text-blue-100 mt-1">
                                {drivers.length} drivers • {orders.length} orders
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Tab Navigation */}
                <div className="flex border-t border-blue-500/30">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'orders'
                                ? 'bg-white/20 text-white'
                                : 'text-blue-100 hover:bg-white/10'
                        }`}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Orders ({orders.length})
                        {selectedOrders.length > 0 && activeTab === 'orders' && (
                            <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                {selectedOrders.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('drivers')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'drivers'
                                ? 'bg-white/20 text-white'
                                : 'text-blue-100 hover:bg-white/10'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        Drivers ({drivers.length})
                        {selectedDriver && activeTab === 'drivers' && (
                            <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                ✓
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 pt-6 pb-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Package className="w-7 h-7" />
                                Assign Deliveries
                            </h1>
                            <p className="text-sm text-blue-100 mt-1">
                                {drivers.length} drivers • {orders.length} unassigned orders
                            </p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="fixed top-24 left-4 right-4 z-40 md:top-28 md:left-auto md:right-4 md:max-w-sm bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top duration-300">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{showSuccess}</span>
                </div>
            )}

            {/* Desktop Layout */}
            <div className="hidden md:block max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Desktop Orders Column */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Package className="w-5 h-5 text-yellow-600" />
                                    Unassigned Orders
                                    <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        {orders.length}
                                    </span>
                                </h2>
                                {orders.length > 0 && (
                                    <button
                                        onClick={selectAllOrders}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        {selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                )}
                            </div>
                            {selectedOrders.length > 0 && (
                                <div className="mt-2 text-sm text-blue-600">
                                    {selectedOrders.length} order(s) selected
                                </div>
                            )}
                        </div>
                        <div className="p-4 max-h-[600px] overflow-y-auto">
                            {renderOrdersList()}
                        </div>
                    </div>

                    {/* Desktop Drivers Column */}
                    <div className="space-y-6">
                        {renderDriversSelection()}
                        {renderAssignButton()}
                        {renderAssignedSummary()}
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                {activeTab === 'orders' && (
                    <div className="p-4 pb-24">
                        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-medium">Select Orders</span>
                                    {selectedOrders.length > 0 && (
                                        <p className="text-xs text-blue-600 mt-1">{selectedOrders.length} selected</p>
                                    )}
                                </div>
                                {orders.length > 0 && (
                                    <button
                                        onClick={selectAllOrders}
                                        className="text-sm text-blue-600 px-3 py-1 rounded-lg bg-blue-50"
                                    >
                                        {selectedOrders.length === orders.length ? 'Clear' : 'Select All'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pb-20">
                            {orders.length === 0 ? (
                                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                    <p>All orders assigned!</p>
                                </div>
                            ) : (
                                orders.map(order => {
                                    const isSelected = selectedOrders.includes(order.id);
                                    return (
                                        <div
                                            key={order.id}
                                            onClick={() => toggleOrderSelection(order.id)}
                                            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all ${
                                                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        {isSelected && <CheckCircle className="w-4 h-4 text-blue-500" />}
                                                        <span className="font-semibold text-sm">
                                                            #{order.order_number || order.id.slice(0, 8)}
                                                        </span>
                                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                                            Pending
                                                        </span>
                                                    </div>
                                                    {/* FIXED: Using order.name instead of order.customer_name */}
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {order.name || 'Customer'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex items-start gap-1 mt-1">
                                                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words">
                                                            {order.address || order.delivery_address}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-semibold text-gray-700 mt-2">
                                                        {formatCurrency(getOrderTotal(order))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {selectedOrders.length > 0 && (
                            <div className="fixed bottom-20 left-4 right-4 z-30">
                                <button
                                    onClick={() => setActiveTab('drivers')}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2"
                                >
                                    Next: Select Driver ({selectedOrders.length} orders)
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'drivers' && (
                    <div className="p-4 pb-24">
                        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-medium">Select Driver</span>
                                    {selectedDriver && (
                                        <p className="text-xs text-green-600 mt-1">Driver selected</p>
                                    )}
                                </div>
                                {selectedOrders.length > 0 && (
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className="text-sm text-gray-600 px-3 py-1 rounded-lg bg-gray-100 flex items-center gap-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                )}
                            </div>
                            {selectedOrders.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Assigning {selectedOrders.length} order(s)
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pb-32">
                            {drivers.length === 0 ? (
                                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No drivers found</p>
                                </div>
                            ) : (
                                drivers.map(driver => {
                                    const isSelected = selectedDriver === driver.id;
                                    const assignedCount = assignedOrders[driver.id]?.length || 0;
                                    
                                    return (
                                        <div
                                            key={driver.id}
                                            onClick={() => setSelectedDriver(driver.id)}
                                            className={`bg-white rounded-lg p-4 shadow-sm border-l-4 transition-all ${
                                                isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-900">
                                                            {driver.full_name || driver.name}
                                                        </span>
                                                        {assignedCount > 0 && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                {assignedCount} orders
                                                            </span>
                                                        )}
                                                    </div>
                                                    {driver.phone && (
                                                        <div className="text-xs text-gray-500 mt-1">{driver.phone}</div>
                                                    )}
                                                    {driver.city && (
                                                        <div className="text-xs text-gray-400 mt-1">{driver.city}</div>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {selectedOrders.length > 0 && selectedDriver && (
                            <div className="fixed bottom-20 left-4 right-4 z-30">
                                <button
                                    onClick={handleAssignOrders}
                                    disabled={assigning}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {assigning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Assign {selectedOrders.length} Order(s)
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    // Helper render functions for desktop
    function renderOrdersList() {
        if (orders.length === 0) {
            return (
                <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p>All orders have been assigned!</p>
                </div>
            );
        }

        return (
            <div className="space-y-3">
                {orders.map(order => {
                    const isSelected = selectedOrders.includes(order.id);
                    const orderTotal = getOrderTotal(order);
                    
                    return (
                        <div
                            key={order.id}
                            onClick={() => toggleOrderSelection(order.id)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                                        <span className="font-semibold text-gray-900">
                                            Order #{order.order_number || order.id.slice(0, 8)}
                                        </span>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                            Pending
                                        </span>
                                    </div>
                                    
                                    {/* FIXED: Using order.name instead of order.customer_name */}
                                    <div className="text-sm text-gray-700 mb-1">
                                        {order.name || 'Customer'}
                                    </div>
                                    
                                    <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                        <MapPin className="w-3 h-3" />
                                        {order.address || order.delivery_address}
                                        {order.city || order.delivery_city && `, ${order.city || order.delivery_city}`}
                                    </div>
                                    
                                    <div className="font-semibold text-gray-900 mt-2">
                                        {formatCurrency(orderTotal)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    function renderDriversSelection() {
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        Select Driver
                        {selectedDriver && (
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">
                                Selected
                            </span>
                        )}
                    </h2>
                </div>
                
                <div className="p-4 max-h-[400px] overflow-y-auto">
                    {drivers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No drivers found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {drivers.map(driver => {
                                const assignedCount = assignedOrders[driver.id]?.length || 0;
                                const isSelected = selectedDriver === driver.id;
                                
                                return (
                                    <div
                                        key={driver.id}
                                        onClick={() => setSelectedDriver(driver.id)}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                                            isSelected
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {driver.full_name || driver.name || 'Driver'}
                                                </div>
                                                {driver.phone && (
                                                    <div className="text-sm text-gray-600">{driver.phone}</div>
                                                )}
                                            </div>
                                            {assignedCount > 0 && (
                                                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {assignedCount} assigned
                                                </div>
                                            )}
                                        </div>
                                        
                                        {driver.city && (
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {driver.city}
                                            </div>
                                        )}
                                        
                                        {isSelected && (
                                            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                Ready to assign
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function renderAssignButton() {
        if (selectedOrders.length === 0 || !selectedDriver) return null;
        
        return (
            <div className="bg-white rounded-xl shadow-md p-4 border-t-4 border-blue-500">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <div className="font-semibold text-gray-900">Ready to Assign</div>
                        <div className="text-sm text-gray-600">
                            {selectedOrders.length} order(s) to {drivers.find(d => d.id === selectedDriver)?.full_name}
                        </div>
                    </div>
                    <button
                        onClick={handleAssignOrders}
                        disabled={assigning}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                    >
                        {assigning ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Assign Orders
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    function renderAssignedSummary() {
        if (Object.keys(assignedOrders).length === 0) return null;
        
        return (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Currently Assigned
                    </h2>
                </div>
                <div className="p-4 max-h-[300px] overflow-y-auto">
                    <div className="space-y-3">
                        {drivers
                            .filter(d => assignedOrders[d.id]?.length > 0)
                            .map(driver => (
                                <div key={driver.id} className="border-l-4 border-blue-500 pl-3">
                                    <div className="font-medium text-gray-900">
                                        {driver.full_name || driver.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {assignedOrders[driver.id].length} active order(s)
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
};

export default DeliveryAssign;








































// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import DriverCard from '@/components/admin/DriverCard';
// import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// interface DriverProfile {
//     id: string;
//     full_name?: string;
//     name?: string;
//     phone?: string;
//     city?: string;
//     address?: string;
//     created_at?: string;
//     latitude?: number;
//     longitude?: number;
// }

// interface OrderItem {
//     id: string;
//     order_number?: string;
//     delivery_address?: string;
//     delivery_city?: string;
//     delivery_state?: string;
//     status?: string;
//     created_at?: string;
//     latitude?: number;
//     longitude?: number;
//     // fields matching provided SQL schema
//     name?: string;
//     email?: string;
//     phone?: string;
//     address?: string;
//     city?: string;
//     state?: string;
//     zip_code?: string;
//     // order items
//     order_items?: Array<{
//         id: string;
//         quantity: number;
//         price: number;
//         products?: {
//             title?: string;
//             price?: string | number;
//             image?: string;
//         };
//     }>;
// }

// const DeliveryAssign: React.FC = () => {
//     const [drivers, setDrivers] = useState<DriverProfile[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [orders, setOrders] = useState<OrderItem[]>([]);
//     const [assignments, setAssignments] = useState<Record<string, string>>({}); // orderId -> driverId
//     const [autoAssigned, setAutoAssigned] = useState<boolean>(false);
//     const [geocodedDrivers, setGeocodedDrivers] = useState<DriverProfile[]>([]);
//     const [geocodedOrders, setGeocodedOrders] = useState<OrderItem[]>([]);

//     // Simple in-memory cache to avoid repeated geocode requests
//     const geocodeCache = React.useRef<Record<string, { lat: number; lng: number } | null>>({});

//     useEffect(() => {
//         const fetchDrivers = async () => {
//             try {
//                 const primary = await (supabase as any).from('drivers').select('*');
//                 console.debug('DeliveryAssign: primary drivers response', primary);
//                 let data = primary.data as any[] | null;
//                 let error = primary.error;

//                 if ((!data || (Array.isArray(data) && data.length === 0)) && !error) {
//                     const res = await (supabase as any).from('profiles').select('*');
//                     console.debug('DeliveryAssign: fallback profiles response', res);
//                     data = res.data as any[];
//                     error = res.error;
//                 }

//                 console.debug('DeliveryAssign: drivers data after fallbacks', { data, error });
//                 setDrivers((data as DriverProfile[]) || []);
//             } catch (err) {
//                 console.error('Error fetching drivers:', err);
//                 setDrivers([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const fetchOrders = async () => {
//             try {
//                 const res = await (supabase as any)
//                     .from('orders')
//                     .select('*')
//                     // only fetch orders that are explicitly 'pending'
//                     .eq('status', 'pending')
//                     .order('created_at', { ascending: false });
//                 if (res.error) throw res.error;
//                 setOrders((res.data as any[]) || []);
//             } catch (err) {
//                 console.error('Error fetching orders:', err);
//                 setOrders([]);
//             }
//         };

//         fetchDrivers();
//         fetchOrders();
//     }, []);

//     // Levenshtein kept (unused by assignment) in case you want to preserve fuzzy fallback
//     const levenshtein = (a: string, b: string) => {
//         if (!a || !b) return Math.max(a?.length || 0, b?.length || 0);
//         const an = a.length;
//         const bn = b.length;
//         const matrix: number[][] = Array.from({ length: an + 1 }, () => Array(bn + 1).fill(0));
//         for (let i = 0; i <= an; i++) matrix[i][0] = i;
//         for (let j = 0; j <= bn; j++) matrix[0][j] = j;
//         for (let i = 1; i <= an; i++) {
//             for (let j = 1; j <= bn; j++) {
//                 const cost = a[i - 1] === b[j - 1] ? 0 : 1;
//                 matrix[i][j] = Math.min(
//                     matrix[i - 1][j] + 1,
//                     matrix[i][j - 1] + 1,
//                     matrix[i - 1][j - 1] + cost
//                 );
//             }
//         }
//         return matrix[an][bn];
//     };

//     const similarity = (a?: string, b?: string) => {
//         if (!a && !b) return 0;
//         a = (a || '').toLowerCase().trim();
//         b = (b || '').toLowerCase().trim();
//         if (a === b) return 1;
//         const dist = levenshtein(a, b);
//         const maxLen = Math.max(a.length, b.length) || 1;
//         return 1 - dist / maxLen;
//     };

//     // ---------------- Nominatim geocoding (OpenStreetMap) ----------------
//     // No API key required. Be polite: set User-Agent. Use in-memory cache and concurrency limit.

//     async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
//         if (!address || !address.trim()) return null;
//         const key = address.trim().toLowerCase();
//         if (geocodeCache.current[key] !== undefined) return geocodeCache.current[key];

//         try {
//             const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
//             const res = await fetch(url, {
//                 headers: {
//                     'User-Agent': 'delivery-app/1.0 (your-email@example.com)', // replace email if you have one
//                 },
//             });

//             if (!res.ok) {
//                 console.warn('geocodeAddress: non-ok response', res.status, address);
//                 geocodeCache.current[key] = null;
//                 return null;
//             }

//             const data = await res.json();
//             if (!Array.isArray(data) || data.length === 0) {
//                 console.debug('geocodeAddress: no results for', address);
//                 geocodeCache.current[key] = null;
//                 return null;
//             }

//             const out = { lat: Number(data[0].lat), lng: Number(data[0].lon) };
//             geocodeCache.current[key] = out;
//             return out;
//         } catch (err) {
//             console.error('geocodeAddress error:', err);
//             geocodeCache.current[key] = null;
//             return null;
//         }
//     }

//     // Concurrency-safe batch geocode (limit concurrent requests)
//     async function batchGeocode<T extends { address?: string; fullAddr?: string }>(
//         items: T[],
//         makeAddress: (it: T) => string,
//         concurrency = 4
//     ) {
//         const out: (T & { _coords?: { lat?: number; lng?: number } | null })[] = [];

//         const queue = items.slice(); // clone
//         const workers: Promise<void>[] = [];

//         const worker = async () => {
//             while (queue.length > 0) {
//                 const item = queue.shift();
//                 if (!item) break;
//                 const addr = makeAddress(item);
//                 const coords = await geocodeAddress(addr);
//                 (item as any)._coords = coords;
//                 out.push(item as any);
//                 // polite pause to reduce chance of throttling
//                 await new Promise((r) => setTimeout(r, 120));
//             }
//         };

//         for (let i = 0; i < concurrency; i++) {
//             workers.push(worker());
//         }

//         await Promise.all(workers);
//         return out;
//     }

//     const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//         const toRad = (v: number) => (v * Math.PI) / 180;
//         const R = 6371; // Earth radius km
//         const dLat = toRad(lat2 - lat1);
//         const dLon = toRad(lon2 - lon1);
//         const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         return R * c;
//     };

//     // Geocode drivers and orders when initial data arrives
//     useEffect(() => {
//         let cancelled = false;

//         const run = async () => {
//             if (!drivers || drivers.length === 0 || !orders || orders.length === 0) return;
//             console.debug('Starting geocode for drivers and orders', { driversCount: drivers.length, ordersCount: orders.length });

//             // Map drivers -> ensure an address string exists
//             const driversWithAddr = drivers.map((d) => ({
//                 ...d,
//                 fullAddr: [d.address, d.city]
//                     .filter(Boolean)
//                     .join(', ')
//                     .trim(),
//             }));

//             // Map orders -> full address
//             const ordersWithAddr = orders.map((o) => ({
//                 ...o,
//                 fullAddr: [o.delivery_address, o.delivery_city, o.delivery_state]
//                     .filter(Boolean)
//                     .join(', ')
//                     .trim(),

//             }));

//             // Do batch geocode with concurrency
//             const dd = await batchGeocode(driversWithAddr, (d) => d.fullAddr || '', 4);
//             const oo = await batchGeocode(ordersWithAddr, (o) => o.fullAddr || '', 4);

//             if (cancelled) return;

//             // copy coords into typed objects
//             const typedDrivers = dd.map((d) => {
//                 const coords = (d as any)._coords;
//                 return { ...(d as any), latitude: coords?.lat, longitude: coords?.lng };
//             }) as DriverProfile[];

//             const typedOrders = oo.map((o) => {
//                 const coords = (o as any)._coords;
//                 return { ...(o as any), latitude: coords?.lat, longitude: coords?.lng };
//             }) as OrderItem[];

//             setGeocodedDrivers(typedDrivers);
//             setGeocodedOrders(typedOrders);
//             console.debug('Geocoding complete', { geocodedDrivers: typedDrivers.length, geocodedOrders: typedOrders.length });
//         };

//         run();
//         return () => {
//             cancelled = true;
//         };
//     }, [drivers, orders]);

//     // Assign orders to nearest driver (Haversine distance) with load balancing penalty
//     const runProximityAssign = () => {
//         try {
//             const srcDrivers = geocodedDrivers.length ? geocodedDrivers : drivers;
//             const srcOrders = geocodedOrders.length ? geocodedOrders : orders;
//             console.debug('runProximityAssign start (geo aware)', { driversCount: srcDrivers.length, ordersCount: srcOrders.length });
//             if (srcDrivers.length === 0 || srcOrders.length === 0) {
//                 console.debug('runProximityAssign: nothing to assign');
//                 return;
//             }

//             const newAssignments: Record<string, string> = {};
//             const driverLoad: Record<string, number> = {};
//             srcDrivers.forEach((d) => (driverLoad[d.id] = 0));

//             srcOrders.forEach((order) => {
//                 // Try Haversine assignment if coordinates available
//                 const oLat = Number((order as any).latitude);
//                 const oLng = Number((order as any).longitude);

//                 const driversWithCoords = srcDrivers.filter((d) => isFinite(Number((d as any).latitude)) && isFinite(Number((d as any).longitude)));

//                 let assignedDriverId: string | null = null;

//                 if (isFinite(oLat) && isFinite(oLng) && driversWithCoords.length > 0) {
//                     // assign by nearest adjusted distance
//                     let bestAdjDistance = Number.POSITIVE_INFINITY;
//                     driversWithCoords.forEach((driver) => {
//                         const dLat = Number((driver as any).latitude);
//                         const dLng = Number((driver as any).longitude);
//                         const dist = distanceKm(oLat, oLng, dLat, dLng);
//                         const adjusted = dist + (driverLoad[driver.id] || 0) * 0.5;
//                         if (adjusted < bestAdjDistance) {
//                             bestAdjDistance = adjusted;
//                             assignedDriverId = driver.id;
//                         }
//                     });
//                     console.debug('order distance match', { orderId: order.id, assignedDriverId, bestAdjDistance });
//                 } else {
//                     // Fallback strategies when geocoding missing
//                     const orderCity = (order.delivery_city || '').toString().toLowerCase().trim();
//                     const orderAddr = (order.delivery_address || '').toString().toLowerCase().trim();

//                     // 1) Exact city match
//                     const cityMatches = srcDrivers.filter((d) => ((d.city || '').toString().toLowerCase().trim()) === orderCity);
//                     if (cityMatches.length > 0) {
//                         // pick least-loaded driver among matches
//                         cityMatches.sort((a, b) => (driverLoad[a.id] || 0) - (driverLoad[b.id] || 0));
//                         assignedDriverId = cityMatches[0].id;
//                         console.debug('order fallback city match', { orderId: order.id, assignedDriverId });
//                     }

//                     // 2) Address contains
//                     if (!assignedDriverId && orderAddr) {
//                         const addrMatches = srcDrivers.filter((d) => {
//                             const daddr = (d.address || '').toString().toLowerCase().trim();
//                             return daddr && (orderAddr.includes(daddr) || daddr.includes(orderAddr));
//                         });
//                         if (addrMatches.length > 0) {
//                             addrMatches.sort((a, b) => (driverLoad[a.id] || 0) - (driverLoad[b.id] || 0));
//                             assignedDriverId = addrMatches[0].id;
//                             console.debug('order fallback address match', { orderId: order.id, assignedDriverId });
//                         }
//                     }

//                     // 3) Fuzzy similarity on city/address
//                     if (!assignedDriverId) {
//                         let bestSim = 0;
//                         let bestId: string | null = null;
//                         srcDrivers.forEach((d) => {
//                             const dcity = (d.city || '').toString().toLowerCase().trim();
//                             const daddr = (d.address || '').toString().toLowerCase().trim();
//                             const simCity = orderCity ? similarity(dcity, orderCity) : 0;
//                             const simAddr = orderAddr ? similarity(daddr, orderAddr) : 0;
//                             const sim = Math.max(simCity * 0.9, simAddr * 0.95);
//                             if (sim > bestSim) {
//                                 bestSim = sim;
//                                 bestId = d.id;
//                             }
//                         });
//                         if (bestId && bestSim >= 0.25) {
//                             assignedDriverId = bestId;
//                             console.debug('order fallback fuzzy match', { orderId: order.id, assignedDriverId, bestSim });
//                         }
//                     }

//                     // 4) Final fallback: assign to least-loaded driver (round-robin style)
//                     if (!assignedDriverId) {
//                         const sorted = srcDrivers.slice().sort((a, b) => (driverLoad[a.id] || 0) - (driverLoad[b.id] || 0));
//                         assignedDriverId = sorted[0]?.id || null;
//                         console.debug('order fallback least-loaded', { orderId: order.id, assignedDriverId });
//                     }
//                 }

//                 if (assignedDriverId) {
//                     newAssignments[String(order.id)] = String(assignedDriverId);
//                     driverLoad[assignedDriverId] = (driverLoad[assignedDriverId] || 0) + 1;
//                 }
//             });

//             console.debug('runProximityAssign result', { assignedCount: Object.keys(newAssignments).length });
//             setAssignments(newAssignments);
//         } catch (err) {
//             console.error('runProximityAssign error', err);
//         }
//     };

//     // Auto-run once geocoded data ready (or raw data if geocoding failed)
//     useEffect(() => {
//         const readyDrivers = geocodedDrivers.length ? geocodedDrivers.length : drivers.length;
//         const readyOrders = geocodedOrders.length ? geocodedOrders.length : orders.length;
//         if (!autoAssigned && readyDrivers > 0 && readyOrders > 0) {
//             runProximityAssign();
//             setAutoAssigned(true);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [drivers, orders, geocodedDrivers, geocodedOrders]);

//     // Copy/Clear assignment UI and helpers removed per request

//     // choose driver list used for display (geocoded if available)
//     const srcDriversForDisplay = geocodedDrivers.length ? geocodedDrivers : drivers;

//     return (
//         <main className="pt-20 min-h-screen bg-sky-50">
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
//                 <div className="bg-white rounded-xl shadow-md p-6">
//                     <h1 className="text-3xl font-bold mb-2 text-slate-800">Delivery Assign</h1>
//                     <p className="text-sm text-slate-500 mb-4">Drivers fetched from Supabase are listed below. Assignments use geocoding when available and fallbacks otherwise.</p>

//                     {loading ? (
//                         <p className="mt-4 text-gray-500">Loading drivers...</p>
//                     ) : (
//                         <>
//                             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
//                                 <div>
//                                     <Dialog>
//                                         <div className="flex items-center gap-2">
//                                             <DialogTrigger asChild>
//                                                 <button className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition">
//                                                     <span className="mr-2 text-sm">Drivers</span>
//                                                     <span className="inline-flex items-center justify-center bg-white text-indigo-700 font-semibold text-sm rounded-full px-2 py-0.5">{drivers.length}</span>
//                                                 </button>
//                                             </DialogTrigger>
//                                         </div>

//                                         <DialogContent>
//                                             <DialogTitle className="mb-2">Drivers ({srcDriversForDisplay.length})</DialogTitle>
//                                             <DialogDescription className="mb-4">Details for all registered drivers</DialogDescription>
//                                             <div className="space-y-3 max-h-72 overflow-auto">
//                                                 {srcDriversForDisplay.map((d) => (
//                                                     <div key={d.id} className="p-3 border rounded bg-white shadow-sm">
//                                                         <div className="font-medium text-slate-800">{d.full_name || d.name || 'Unnamed Driver'}</div>
//                                                         {d.phone && <div className="text-sm text-slate-600">{d.phone}</div>}
//                                                         {(d.city || d.address) && <div className="text-sm text-slate-500">{d.city || ''}{d.address ? ` • ${d.address}` : ''}</div>}
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </DialogContent>
//                                     </Dialog>

//                                     <p className="text-sm text-slate-500 mt-1">
//                                         Open Orders: <span className="font-semibold text-slate-700">{orders.length}</span>
//                                     </p>
//                                 </div>

//                                 {/* controls removed: copy assignments and clear assignments buttons were removed */}
//                             </div>

//                             {/* If we have assignments, render per-driver boxes showing assigned orders */}
//                             {Object.keys(assignments).length > 0 ? (
//                                 <div className="mb-6">
//                                     <h3 className="text-lg font-medium mb-3">Assigned Orders by Driver</h3>
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                         {srcDriversForDisplay.map((driver) => {
//                                             const assignedOrders = orders.filter(
//                                                 (o) => String(assignments[String(o.id)] || '') === String(driver.id)
//                                             );
//                                             return <DriverCard key={driver.id} driver={driver} orders={assignedOrders} />;
//                                         })}
//                                     </div>

//                                     {/* Unassigned orders */}
//                                     {orders.filter((o) => !assignments[String(o.id)]).length > 0 && (
//                                         <div className="mt-6">
//                                             <h4 className="font-medium mb-2">Unassigned Orders</h4>
//                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                                                 {orders.filter((o) => !assignments[String(o.id)]).map((o) => {
//                                                     const shortId = (id: string) => (id && id.length > 8 ? id.slice(0, 8) : id);
//                                                     // prefer `name/phone/email/address` columns; fall back to delivery_* names
//                                                     const customer = (o as any).name || (o as any).customer_name || (o as any).profiles?.name || '';
//                                                     const customerPhone = (o as any).phone || (o as any).customer_phone || '';
//                                                     const customerEmail = (o as any).email || (o as any).customer_email || '';
//                                                     const title = o.order_number ? `Order #${o.order_number}` : `Order ${shortId(o.id)}`;
//                                                     const addrParts = [] as string[];
//                                                     if ((o as any).address) addrParts.push((o as any).address);
//                                                     if ((o as any).delivery_address) addrParts.push((o as any).delivery_address);
//                                                     if ((o as any).city) addrParts.push((o as any).city);
//                                                     if ((o as any).delivery_city) addrParts.push((o as any).delivery_city);
//                                                     if ((o as any).state) addrParts.push((o as any).state);
//                                                     if ((o as any).delivery_state) addrParts.push((o as any).delivery_state);
//                                                     if ((o as any).zip_code) addrParts.push((o as any).zip_code);
//                                                     const addrDisplay = addrParts.join(' • ');
//                                                     return (
//                                                         <div key={o.id} className="p-3 border rounded bg-white">
//                                                             <div className="text-sm font-medium">{title}</div>
//                                                             {customer ? (
//                                                                 <div className="text-xs text-gray-500">{customer}{customerPhone ? ` • ${customerPhone}` : ''}{customerEmail ? ` • ${customerEmail}` : ''}</div>
//                                                             ) : (
//                                                                 addrDisplay && <div className="text-xs text-gray-500">{addrDisplay}</div>
//                                                             )}
//                                                             {/* optionally show small items summary */}
//                                                             {o.order_items && o.order_items.length > 0 && (
//                                                                 <div className="mt-2 text-xs text-gray-600">
//                                                                     {o.order_items.map(it => `${it.quantity}× ${it.products?.title || 'Item'}`).join(', ')}
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     );
//                                                 })}
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             ) : (
//                                 // No assignments yet - show driver cards (empty)
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                     {srcDriversForDisplay.map((d) => (
//                                         <DriverCard key={d.id} driver={d} orders={[]} />
//                                     ))}
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default DeliveryAssign;
