export async function handler(event, context) {
  const chatUrl = process.env.CHAT_SERVICE_URL;

  if (!chatUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Chat service URL is not defined' }),
    };
  }

  try {
    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
    });

    const resultText = await response.text();

    return {
      statusCode: response.status,
      body: resultText,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
