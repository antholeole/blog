

export const monthDiff = (dateFrom: Date, dateTo: Date = new Date()): number => 
     dateTo.getMonth() - dateFrom.getMonth() + 
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
