import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const DriverLogistics = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch driver deliveries from backend API
    // fetchDeliveries();
    setLoading(false);
  }, []);

  const handleDeliveryStatusUpdate = (deliveryId, newStatus) => {
    // TODO: Update delivery status in backend
    console.log(`Updating delivery ${deliveryId} to ${newStatus}`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Logistics</Text>
      <Text style={styles.subtitle}>Assigned Deliveries</Text>
      
      {deliveries.length === 0 ? (
        <Text style={styles.emptyText}>No active deliveries</Text>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.delivery_id}
          renderItem={({ item }) => (
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryId}>Delivery #{item.delivery_id}</Text>
              <Text style={styles.deliveryLocation}>Destination: {item.delivery_location.address}</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleDeliveryStatusUpdate(item.delivery_id, 'delivered')}
              >
                <Text style={styles.statusButtonText}>Mark Delivered</Text>
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
  deliveryCard: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  deliveryId: {
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  statusButton: {
    backgroundColor: '#4CAF50',
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

export default DriverLogistics;