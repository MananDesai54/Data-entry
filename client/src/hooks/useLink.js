export const useLink = () => {
  const link =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5000"
      : "https://post-data-api.herokuapp.com";

  return link;
};
