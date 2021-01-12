export const setDue = (years, date) => {
  const newDate = new Date(
    +years === 8.7
      ? new Date(
          `${date.split("/")[2]}/${date.split("/")[1]}/${date.split("/")[0]}`
        ).setMonth(
          new Date(
            `${date.split("/")[2]}/${date.split("/")[0]}/${date.split("/")[1]}`
          ).getMonth() + 103
        )
      : new Date(
          `${date.split("/")[2]}/${date.split("/")[1]}/${date.split("/")[0]}`
        ).setFullYear(
          new Date(
            `${date.split("/")[2]}/${date.split("/")[0]}/${date.split("/")[1]}`
          ).getFullYear() + +years
        )
  );
  return newDate;
};
