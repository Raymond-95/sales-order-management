import apiClient from './apiService';
import type { SalesOrder, SalesOrderPayload } from '@/typings/SalesOrder';
import type { FilterOptions } from '@/typings/FilterOptions';
import type { EnumOptions } from '@/typings/EnumOptions';

const getEnums = async (): Promise<EnumOptions> => {
  const response = await apiClient.get<EnumOptions>('/enums');
  return response.data;
};

const getFilterOptions = async (): Promise<FilterOptions> => {
  const response = await apiClient.get<FilterOptions>('/filterOptions');
  return response.data;
};

const getSalesOrders = async (): Promise<SalesOrder[]> => {
  const response = await apiClient.get<SalesOrder[]>('/salesOrders');
  return response.data;
};

const addSalesOrder = async (salesOrder: SalesOrderPayload): Promise<void> => {
  await apiClient.post<SalesOrder>('/salesOrder', salesOrder);
};

const updateSalesOrder = async (
  salesOrderId: number,
  salesOrderData: SalesOrderPayload,
): Promise<void> => {
  await apiClient.put(`/salesOrder/${salesOrderId}`, salesOrderData);
};

const deleteSalesOrder = async (orderId: number): Promise<void> => {
  await apiClient.delete(`/salesOrder/${orderId}`);
};

export {
  getEnums,
  getFilterOptions,
  getSalesOrders,
  addSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
};
