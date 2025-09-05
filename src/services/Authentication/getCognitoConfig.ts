export const getCognitoConfig = async (appId: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/devportal/cognito/userpool/${appId}`,
    );
    if (!response.ok) {
      throw new Error('Failed to fetch Cognito configuration');
    }

    const config = await response.json();
    return {
      userPoolId: config.data.userPoolId as string,
      userPoolClientId: config.data.clients[0].ClientId as string,
    };
  } catch (error) {
    console.error('Error fetching Cognito configuration:', error);
    throw error;
  }
};
