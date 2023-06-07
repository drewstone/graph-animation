import React, { useRef, useEffect } from 'react';
import Graph, { Message, Position, TupleOfMessages } from './Graph';
import { generateRandomMessage } from './generators';

class EventScheduler {
  vertices: Position[];
  center: Position;

  constructor(vertices: Position[], center: Position) {
    this.vertices = vertices;
    this.center = center;
  }

  generateRandomTuple(): TupleOfMessages {
    // Choose a random vertex
    const start = this.vertices[Math.floor(Math.random() * this.vertices.length)];

    // Generate 1 to 3 random messages from this vertex
    const numMessages = 1 + Math.floor(Math.random() * 3);
    const messages: Message[] = [];
    for (let i = 0; i < numMessages; i++) {
      messages.push(generateRandomMessage(start, this.center));
    }

    // Create the tuple
    const tuple = new TupleOfMessages(start, messages);

    return tuple;
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
    let tuples: TupleOfMessages[] = [];
  
    // Generate the first tuple of messages
    const initialTuple = scheduler.generateRandomTuple();
    tuples.push(initialTuple);
  
    // Schedule future events
    const intervalId = setInterval(() => {
      const newTuple = scheduler.generateRandomTuple();
      tuples.push(newTuple);
    }, 2000 /* generate a new event every 2 seconds */);
  
    // Animate messages
    const animate = () => {
      graph.animateMessages(ctx, tuples);
      requestAnimationFrame(animate);
    }
    animate();
  
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <div className="App">
      <canvas ref={canvasRef} width="600" height="600" />
    </div>
  );
}

export default App;