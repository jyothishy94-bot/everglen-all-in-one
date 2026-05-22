import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const HotelKitchen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch kitchen orders from backend API
    // fetchKitchenOrders();
    setLoading(false);
  }, []);

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    // TODO: Update order status in backend
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kitchen Management</Text>
      <Text style={styles.subtitle}>Active Orders</Text>
      
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No active orders</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>Order #{item.order_id}</Text>
              <Text style={styles.orderItems}>Items: {item.items.length}</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleOrderStatusUpdate(item.order_id, 'ready')}
              >
                <Text style={styles.statusButtonText}>Mark as Ready</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderItems: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statusButton: {
    backgroundColor: '#FF6B35',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default HotelKitchen;