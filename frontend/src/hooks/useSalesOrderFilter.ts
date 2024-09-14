import type { Filteration } from '@/typings/Filteration';
import type { SalesOrder } from '@/typings/SalesOrder';

export const useSalesOrdersFilter = () => {
  const filterSalesOrders = (
    salesOrderList: SalesOrder[],
    filters: Filteration,
  ) => {
    // filter the list based on filter criteria
    return salesOrderList.filter((salesOrder) => {
      // filter by created date range
      const isValidFromDate = filters.createdDateRange.from !== '';
      const isValidToDate = filters.createdDateRange.to !== '';
      const createdDate = new Date(salesOrder.createdDate);
      const fromDate = new Date(filters.createdDateRange.from);
      const toDate = new Date(filters.createdDateRange.to);

      const isWithinDateRange =
        (!isValidFromDate && !isValidToDate) ||
        (isValidFromDate &&
          isValidToDate &&
          createdDate >= fromDate &&
          createdDate <= toDate) ||
        (isValidFromDate && !isValidToDate && createdDate >= fromDate) ||
        (!isValidFromDate && isValidToDate && createdDate <= toDate);

      // filter by customer name
      const isMatchingCustomerName = salesOrder.customerName.includes(
        filters.customerName,
      );

      // filter by status
      const isMatchingStatus =
        filters.status.length === 0 ||
        filters.status.includes('All') ||
        filters.status.includes(salesOrder.status);

      // filter by category
      const isMatchingCategory =
        filters.category.length === 0 ||
        filters.category.includes('All') ||
        filters.category.includes(salesOrder.categoryGroup);

      // filter by country
      const isMatchingCountry =
        filters.country === '' || salesOrder.country === filters.country;

      // return true if all criteria match
      return (
        isWithinDateRange &&
        isMatchingCustomerName &&
        isMatchingStatus &&
        isMatchingCategory &&
        isMatchingCountry
      );
    });
  };

  return {
    filterSalesOrders,
  };
};
