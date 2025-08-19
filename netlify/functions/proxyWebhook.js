export async function handler(event, context) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook URL is not defined' }),
    };
  }

  try {
    // Forward the exact payload from the React app
    const response = await fetch(webhookUrl, {
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
