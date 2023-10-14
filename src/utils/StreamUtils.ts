export async function startStream(streamUrl: string): Promise<{ onData: (data: any) => void; end: () => void }> {
  try {
    const response = await fetch(streamUrl);

    if (!response.body) {
      throw new Error('Response body not readable as a stream.');
    }

    const reader = response.body.getReader();

    return {
      onData: async (callback: (data: any) => void) => {
        for (;;) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          callback(value);
        }
      },
      end: () => {
        // Indicate the end of streaming
        reader.cancel();
      },
    };


  } catch (error) {
    console.error('Error fetching stream:', error);
    throw error; // Rethrow the error for handling at a higher level if needed
  }
}
