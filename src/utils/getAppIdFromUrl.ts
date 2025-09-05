export const getAppIdFromUrl = () => {
  // Extract appId from URL
  const pathSegments = window.location.pathname
    .split('/')
    .filter((segment) => segment);

  // Possible prefixes where appId can be found
  const prefixes = ['apps', 'login'];

  // Find index where 'apps' or 'login' is located in the path
  const appIndex = pathSegments.findIndex((segment) =>
    prefixes.includes(segment),
  );

  let appId: string | null = null;

  if (appIndex !== -1 && pathSegments.length > appIndex + 1) {
    appId = pathSegments[appIndex + 1];

    // Store appId in sessionStorage for future use
    sessionStorage.setItem('appId', appId);

    return appId;
  }

  // If appId is not in URL, check sessionStorage
  appId = sessionStorage.getItem('appId');

  if (appId) {
    return appId;
  }

  return null;
};
