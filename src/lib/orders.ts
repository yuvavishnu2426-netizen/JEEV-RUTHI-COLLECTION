import { supabase } from './supabase';

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Verification Pending'
  | 'Payment Approved'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out For Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending'
  | 'Pending Verification'
  | 'Payment Approved'
  | 'Payment Rejected'
  | 'Paid'
  | 'Pending COD'
  | 'Refunded';

export interface OrderItemPayload {
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image: string;
  selected_size: string;
  selected_color: string;
  selected_color_code: string;
  quantity: number;
  mrp_price: number;
  offer_price: number;
}

export interface CreateOrderPayload {
  user_id: string;
  order_id: string;
  customer_full_name: string;
  customer_mobile: string;
  customer_email: string;
  customer_address_line: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: 'UPI' | 'COD' | 'Razorpay';
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  order_notes?: string;
  items: OrderItemPayload[];
}

// ============================================================
// CREATE ORDER
// ============================================================
export async function createOrder(payload: CreateOrderPayload) {
  const { items, ...orderData } = payload;

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const itemRows = items.map(item => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemRows);

  if (itemsError) throw itemsError;

  // Insert initial status timeline entry
  await supabase.from('order_status_timeline').insert([{
    order_id: order.id,
    status: orderData.order_status,
    updated_by: 'system',
  }]);

  return order;
}

// ============================================================
// FETCH USER ORDERS
// ============================================================
export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
  return data ?? [];
}

// ============================================================
// FETCH ORDER TIMELINE
// ============================================================
export async function fetchOrderTimeline(orderId: string) {
  const { data, error } = await supabase
    .from('order_status_timeline')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// ============================================================
// UPLOAD PAYMENT SCREENSHOT AND UPDATE ORDER
// ============================================================
export async function updateOrderPaymentScreenshot(
  orderId: string,
  screenshotUrl: string
) {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_screenshot_url: screenshotUrl,
      payment_status: 'Pending Verification',
      order_status: 'Payment Verification Pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;
}

// ============================================================
// CANCEL ORDER
// ============================================================
export async function cancelOrder(orderId: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      order_status: 'Cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;
}

// ============================================================
// ADMIN: FETCH ALL ORDERS
// ============================================================
export async function fetchAllOrdersAdmin() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch admin orders:', error);
    return [];
  }
  return data ?? [];
}

// ============================================================
// ADMIN: UPDATE ORDER STATUS
// ============================================================
export async function adminUpdateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  note?: string
) {
  const { error } = await supabase
    .from('orders')
    .update({
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;

  // Log to timeline (trigger also does this, but explicit for note)
  if (note) {
    await supabase.from('order_status_timeline').insert([{
      order_id: orderId,
      status: orderStatus,
      note,
      updated_by: 'admin',
    }]);
  }
}

// ============================================================
// ADMIN: APPROVE PAYMENT
// ============================================================
export async function adminApprovePayment(orderId: string, userId: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'Payment Approved',
      order_status: 'Payment Approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;

  // Notify customer
  await supabase.from('customer_notifications').insert([{
    user_id: userId,
    order_id: orderId,
    title: 'Payment Approved',
    message: 'Your payment has been verified and approved. Your order is now confirmed!',
    notification_type: 'payment',
  }]);
}

// ============================================================
// ADMIN: REJECT PAYMENT
// ============================================================
export async function adminRejectPayment(orderId: string, userId: string) {
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'Payment Rejected',
      order_status: 'Cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;

  await supabase.from('customer_notifications').insert([{
    user_id: userId,
    order_id: orderId,
    title: 'Payment Verification Failed',
    message: 'We could not verify your payment screenshot. Please contact support.',
    notification_type: 'payment',
  }]);
}

// ============================================================
// ADMIN: UPDATE TRACKING
// ============================================================
export async function adminUpdateTracking(
  orderId: string,
  trackingNumber: string,
  courierName: string
) {
  const { error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      courier_name: courierName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  if (error) throw error;
}

// ============================================================
// ADMIN: SEND CUSTOMER NOTIFICATION WHEN STATUS CHANGES
// ============================================================
export async function notifyCustomerOnStatusChange(
  userId: string,
  orderId: string,
  orderDisplayId: string,
  newStatus: OrderStatus
) {
  const messageMap: Partial<Record<OrderStatus, { title: string; message: string; type: string }>> = {
    'Payment Approved': {
      title: 'Payment Approved',
      message: `Payment for order ${orderDisplayId} has been approved. Your order is confirmed!`,
      type: 'payment',
    },
    'Order Confirmed': {
      title: 'Order Confirmed',
      message: `Order ${orderDisplayId} is confirmed and being prepared by our team.`,
      type: 'order',
    },
    'Shipped': {
      title: 'Order Shipped',
      message: `Great news! Order ${orderDisplayId} has been shipped. Track your package in your dashboard.`,
      type: 'shipping',
    },
    'Out For Delivery': {
      title: 'Out For Delivery',
      message: `Your order ${orderDisplayId} is out for delivery today. Please be available.`,
      type: 'delivery',
    },
    'Delivered': {
      title: 'Order Delivered',
      message: `Order ${orderDisplayId} has been delivered. Thank you for shopping with JEEV RUTHI COLLECTION!`,
      type: 'delivery',
    },
    'Cancelled': {
      title: 'Order Cancelled',
      message: `Order ${orderDisplayId} has been cancelled. Contact support for assistance.`,
      type: 'order',
    },
  };

  const notif = messageMap[newStatus];
  if (!notif) return;

  await supabase.from('customer_notifications').insert([{
    user_id: userId,
    order_id: orderId,
    order_display_id: orderDisplayId,
    title: notif.title,
    message: notif.message,
    notification_type: notif.type,
  }]);
}

// ============================================================
// REALTIME: SUBSCRIBE TO ORDER UPDATES
// ============================================================
export function subscribeToOrderUpdates(
  orderId: string,
  onUpdate: (payload: any) => void
) {
  return supabase
    .channel(`order-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      onUpdate
    )
    .subscribe();
}

// ============================================================
// REALTIME: SUBSCRIBE TO USER NOTIFICATIONS
// ============================================================
export function subscribeToUserNotifications(
  userId: string,
  onNew: (payload: any) => void
) {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'customer_notifications',
        filter: `user_id=eq.${userId}`,
      },
      onNew
    )
    .subscribe();
}

// ============================================================
// FETCH USER NOTIFICATIONS
// ============================================================
export async function fetchUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('customer_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
  return data ?? [];
}

export async function markNotificationRead(notifId: string) {
  await supabase
    .from('customer_notifications')
    .update({ is_read: true })
    .eq('id', notifId);
}

export async function markAllNotificationsRead(userId: string) {
  await supabase
    .from('customer_notifications')
    .update({ is_read: true })
    .eq('user_id', userId);
}

// ============================================================
// RETURN REQUESTS
// ============================================================
export async function createReturnRequest(data: {
  return_id: string;
  order_id: string;
  order_display_id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  product_name: string;
  reason: string;
  description: string;
  image_url?: string;
}) {
  const { data: result, error } = await supabase
    .from('return_requests')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function fetchUserReturns(userId: string) {
  const { data, error } = await supabase
    .from('return_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllReturnsAdmin() {
  const { data, error } = await supabase
    .from('return_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function adminUpdateReturnStatus(
  returnId: string,
  status: 'Approved' | 'Rejected' | 'Refunded',
  adminNote?: string
) {
  const { error } = await supabase
    .from('return_requests')
    .update({
      status,
      admin_note: adminNote,
      updated_at: new Date().toISOString(),
    })
    .eq('return_id', returnId);

  if (error) throw error;
}

// ============================================================
// ADMIN DASHBOARD STATS
// ============================================================
export async function fetchAdminDashboardStats() {
  const [ordersResult, returnsResult] = await Promise.all([
    supabase.from('orders').select('id, total_amount, order_status, payment_status, created_at, customer_full_name, order_id'),
    supabase.from('return_requests').select('id, status'),
  ]);

  const orders = ordersResult.data ?? [];
  const returns = returnsResult.data ?? [];

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o =>
    ['Pending Payment', 'Payment Verification Pending', 'Payment Approved', 'Order Confirmed', 'Processing', 'Packed'].includes(o.order_status)
  ).length;
  const deliveredOrders = orders.filter(o => o.order_status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.order_status === 'Cancelled').length;
  const pendingVerifications = orders.filter(o => o.payment_status === 'Pending Verification').length;
  const totalRevenue = orders
    .filter(o => ['Payment Approved', 'Order Confirmed', 'Processing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Paid'].includes(o.payment_status))
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return {
    totalOrders,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    pendingVerifications,
    totalRevenue,
    recentOrders,
    pendingReturns: returns.filter(r => r.status === 'Pending').length,
  };
}

// ============================================================
// ADDRESSES
// ============================================================
export async function fetchUserAddresses(userId: string) {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveUserAddress(userId: string, address: {
  full_name: string;
  mobile: string;
  email: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}) {
  const { data, error } = await supabase
    .from('addresses')
    .insert([{ ...address, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
