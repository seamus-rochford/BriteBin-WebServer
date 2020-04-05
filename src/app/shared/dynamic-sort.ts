export const dynamicSort = (property, sortOrder) => {
    return (a, b) => {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       * sortOrder = 1 is Ascending and sortOrder = -1 is Descending
       */
      let aValue = '';
      let bValue = '';
      if (a[property] == null) { 
        aValue = '';
      } else {
        aValue = a[property];
      }
      if (b[property] == null) { 
        bValue = '';
      } else {
        bValue = b[property];
      }

      const result = (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
      // const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
};
  
export const toggleSort = (sortOrder) => {
    if (sortOrder === 0) {
      return 1;
    } else {
      return sortOrder * -1;
    }
};