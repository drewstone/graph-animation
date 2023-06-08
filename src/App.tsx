import React, { useRef, useEffect } from 'react';
import Graph, { Message, Position } from './Graph';
import { generateRandomMessage } from './generators';

class EventScheduler {
  vertices: Position[];
  center: Position;

  constructor(vertices: Position[], center: Position) {
    this.vertices = vertices;
    this.center = center;
  }

  generateRandomMessages(): Message[] {
    // Generate 1 to 3 random messages from this vertex
    const numMessages = 1 + Math.floor(Math.random() * 3);
    const messages: Message[] = [];
    for (let i = 0; i < numMessages; i++) {
      const start = this.vertices[Math.floor(Math.random() * this.vertices.length)];
      messages.push(generateRandomMessage(start, this.center));
    }

    return messages;
  }
}


function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Get canvas context
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
  
    // Initialize the graph
    const numVertices = 8; // Changed the number of vertices to 8 as you specified
    const graph = new Graph(canvas, 200 /* radius */, numVertices);
  
    // Initialize the event scheduler
    const scheduler = new EventScheduler(graph.vertices, graph.center);
  
    // Initialize an empty list of tuples
    let messages: Message[] = [];

    // Initialize an empty list of proposal messages to dispatch
    let proposalToDispatch: Message[] = [];
  
    // Generate the first tuple of messages
    const initialMessages = scheduler.generateRandomMessages();
    messages = messages.concat(initialMessages);
  
    // Animate messages
    const animate = () => {
      proposalToDispatch = graph.animateMessages(ctx, messages, proposalToDispatch);
      messages = messages.filter(message => !message.hasReachedCenter || message.processed);
      requestAnimationFrame(animate);
    }
    animate();
  
    // Schedule future events
    let intervalId: any;
    const intervalFunc = () => {
      if (!document.hidden) {
        // Dispatch queued proposal messages
        console.log(proposalToDispatch);
        messages = messages.concat(proposalToDispatch);
        proposalToDispatch = [];

        const newMessages = scheduler.generateRandomMessages();
        messages = messages.concat(newMessages);
      }
    };
    intervalId = setInterval(intervalFunc, 2000 /* generate a new event every 2 seconds */);

    // Event listener for visibility change
    const visibilityChangeHandler = () => {
      if (document.hidden) {
        // Clear the interval when the tab is not active
        clearInterval(intervalId);
      } else {
        // Set the interval when the tab becomes active
        intervalId = setInterval(intervalFunc, 2000);
      }
    };
    document.addEventListener("visibilitychange", visibilityChangeHandler);

    // Clear interval and remove event listener on unmount
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", visibilityChangeHandler);
    };
  }, []);
  

  return (
    <div className="App">
      <canvas ref={canvasRef} width="600" height="600" />
    </div>
  );
}

export default App;