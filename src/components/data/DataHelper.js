export default class DataHelper {
  static makeRequest = async (url, data = {}, errorMessage) => {
    const rawResponse = await fetch(url, data);
    if (!rawResponse.ok) {
      switch (rawResponse.status) {
        case 401:
          throw new Error(
            `In ${errorMessage}. Error code: ${rawResponse.status}. Message: Access token is missing or invalid`
          );
        case 417:
          throw new Error(
            `In ${errorMessage}. Error code: ${rawResponse.status}. Message: Such entity already exists`
          );
        case 422:
          throw new Error(
            `In ${errorMessage}. Error code: ${rawResponse.status}. Message: Incorrect data`
          );
        default:
          throw new Error(
            `In ${errorMessage}. Error code: ${rawResponse.status}. Message: ${rawResponse.statusText}`
          );
      }
    }
    try {
      if (rawResponse.status === 204) return {};  // DELETE operations returns no content
      return rawResponse.json();
    } catch (error) {
      throw new Error(error);
    }
  };
}
