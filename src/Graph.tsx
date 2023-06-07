import { generateCirclePoints } from "./generators";

export interface Position {
  x: number;
  y: number;
}

export const MESSAGE_COLORS = {
  zkp: 'red',
  asset: 'green',
  proposal: 'blue',
};
  
export class Message {
  position: Position;
  destination: Position;
  type: 'zkp' | 'asset' | 'proposal';
  processed: boolean;
  hasReachedCenter: boolean;

  constructor(start: Position, center: Position, type: 'zkp' | 'asset' | 'proposal') {
    this.position = { ...start };  // Copy the start position
    this.destination = center;
    this.type = type;
    this.processed = false;
    this.hasReachedCenter = false;
  }

  updateHasReachedCenter(center: Position, centerRadius: number) {
    let dx = center.x - this.position.x;
    let dy = center.y - this.position.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.hasReachedCenter = distance <= centerRadius;
  }
}

export class TupleOfMessages {
  origin: Position;
  messages: Message[];

  constructor(origin: Position, messages: Message[]) {
    this.origin = origin;
    this.messages = messages;
  }
}

class Graph {
  canvas: HTMLCanvasElement;
  center: Position;
  vertices: Position[];

  constructor(canvas: HTMLCanvasElement, radius: number,  numVertices: number) {
    this.canvas = canvas;
    this.center = { x: 300, y: 300 };
    this.vertices = generateCirclePoints(this.center, radius, numVertices);
    
  }

  drawMessage(ctx: CanvasRenderingContext2D, message: Message) {
    // Draw message circle
    ctx.beginPath();
    ctx.arc(message.position.x, message.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = message.type === 'zkp' ? 'green' : message.type === 'asset' ? 'blue' : 'red';
    ctx.fill();
  }
  
  drawVertex(ctx: CanvasRenderingContext2D, vertex: Position) {
    // Draw vertex circle
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  drawCenter(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, 20 /* center radius */, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
    
  animateMessages(ctx: CanvasRenderingContext2D, tuples: TupleOfMessages[]) {
    // Clear the canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    // Draw the center
    this.drawCenter(ctx);
  
    // Draw vertices
    this.vertices.forEach(vertex => {
      this.drawVertex(ctx, vertex);
    });
  
    // Update and draw messages
    tuples.forEach(tuple => {
      tuple.messages.forEach(message => {
        let dx = message.destination.x - message.position.x;
        let dy = message.destination.y - message.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 1) {
          let speed = 1; // Adjust as needed
          if (!message.processed && message.hasReachedCenter) {
            // Mark the message as processed once it reaches the center
            message.processed = true;
          }
          if (message.processed) {
            // Move the message towards its destination
            message.position.x += dx / distance * speed;
            message.position.y += dy / distance * speed;
          } else {
            // Move the message towards the center
            let dxCenter = this.center.x - message.position.x;
            let dyCenter = this.center.y - message.position.y;
            let distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
            message.position.x += dxCenter / distanceCenter * speed;
            message.position.y += dyCenter / distanceCenter * speed;
          }
        }
        
        // Draw the message
        this.drawMessage(ctx, message);
      });
    });
  }
}
export default Graph;