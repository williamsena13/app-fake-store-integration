export const getBaseURL = (): string => {
  const nodeEnv = import.meta.env.VITE_NODE_ENV;
  switch (nodeEnv) {
    case 'production':
      return import.meta.env.VITE_API_PRODUCTION_URL;
    case 'development':
      return import.meta.env.VITE_API_DEVELOPER_URL;
    case 'local':
      return import.meta.env.VITE_API_LOCAL_URL;
    default:
      return import.meta.env.VITE_API_LOCAL_URL;
  }
};