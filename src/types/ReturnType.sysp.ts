export const DEFAULT_JSON = `
  Please provide your response in a valid JSON format without any additional commentary. The JSON object should include the following keys:
- "status": A string indicating the status (e.g., "success", "error").
- "message": A brief message explaining the result.
- "data": An object containing details with the keys "id" (an integer), "name" (a string), and "description" (a string).

Ensure that your entire reply is valid JSON.
`;
