import React, { useEffect, useState } from 'react';
import {startStream} from '../utils/StreamUtils';

interface StreamingHandlerProps {
  onData: (dataChunk: string) => void;
  onError: (error: Error) => void;
  streamUrl: string;
}

const StreamingHandler: React.FC<StreamingHandlerProps> = ({ onData, onError, streamUrl }) => {
  const [replyChunks, setReplyChunks] = useState<string[]>([]);

  useEffect(() => {
  const startStreaming = async () => {
    try {
      const stream = await startStream(streamUrl);

      stream.onData((dataChunk: string) => {
        onData(dataChunk);
        setReplyChunks((prevChunks) => [...prevChunks, dataChunk]);
      });
    } catch (error) {
      onError(new Error("Error occurred while retrieving data from codyAI"));
    }
  };

  startStreaming();
}, [onData, onError, streamUrl]);


  return null;
};

export default StreamingHandler;
