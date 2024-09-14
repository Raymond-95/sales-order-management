import apiClient from './apiService';
import type { SalesOrder } from '@/typings/SalesOrder';
import type { FilterOptions } from '@/typings/FilterOptions';

const getFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const response = await apiClient.get<FilterOptions>('/filterOptions');
    return response.data;
  } catch (error) {
    throw new Error('Error retrieving filter options');
  }
};

const getSalesOrders = async (): Promise<SalesOrder[]> => {
  try {
    const response = await apiClient.get<SalesOrder[]>('/salesOrders');
    return response.data;
  } catch (error) {
    throw new Error('Error retrieving sales orders');
  }
};

const addSalesOrder = async (salesOrder: SalesOrder): Promise<SalesOrder> => {
  try {
    const response = await apiClient.post<SalesOrder>(
      '/salesOrders',
      salesOrder,
    );
    return response.data;
  } catch (error) {
    throw new Error('Error adding sales order');
  }
};

const updateSalesOrder = async (
  salesOrderId: string,
  salesOrderData: SalesOrder,
): Promise<void> => {
  try {
    await apiClient.put(`/salesOrder/${salesOrderId}`, salesOrderData);
  } catch (error) {
    throw new Error('Error updating sales order');
  }
};

const deleteSalesOrder = async (orderId: string): Promise<void> => {
  try {
    await apiClient.delete(`/salesOrder/${orderId}`);
  } catch (error) {
    throw new Error('Error deleting sales order');
  }
};

export {
  getFilterOptions,
  getSalesOrders,
  addSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
};
