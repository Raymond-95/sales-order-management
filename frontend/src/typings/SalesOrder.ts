export interface SalesOrder {
  orderId: number;
  customerName: string;
  status: string;
  category: string;
  categoryGroup: string;
  country: string;
  createdDate: string;
}

export type SalesOrderHeaders = Array<keyof SalesOrder>;

export type SalesOrderPayload = Omit<
  SalesOrder,
  'orderId' | 'categoryGroup' | 'createdDate'
>;
