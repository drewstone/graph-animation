import { generateCirclePoints } from "./generators";

export interface Position {
  x: number;
  y: number;
}

export const MESSAGE_COLORS = {
  zkp: 'red',
  asset: 'green',
  proposal: 'blue',
  proposalGossip: 'light-blue',
};
  
export class Message {
  position: Position;
  origin: Position;
  destination: Position;
  type: 'zkp' | 'asset' | 'proposal' | 'proposalGossip';
  processed: boolean;
  hasReachedCenter: boolean;
  hasReachedDestination: boolean;

  constructor(start: Position, destination: Position, type: 'zkp' | 'asset' | 'proposal' | 'proposalGossip') {
    this.position = { ...start };
    this.origin = { ...start };
    this.destination = destination;
    this.type = type;
    this.processed = false;
    this.hasReachedCenter = false;
    this.hasReachedDestination = false;
  }

  updateHasReachedCenter(center: Position, centerRadius: number) {
    let dx = center.x - this.position.x;
    let dy = center.y - this.position.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.hasReachedCenter = distance <= centerRadius;
  }

  updateHasReachedDestination(destination: Position) {
    let dx = destination.x - this.position.x;
    let dy = destination.y - this.position.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    this.hasReachedDestination = distance <= 1;
  }
}

class Graph {
  canvas: HTMLCanvasElement;
  center: Position;
  centerRadius: number;
  vertices: Position[];

  constructor(canvas: HTMLCanvasElement, radius: number,  numVertices: number) {
    this.canvas = canvas;
    this.center = { x: 300, y: 300 };
    this.vertices = generateCirclePoints(this.center, radius, numVertices);
    this.centerRadius = 30;
  }

  drawMessage(ctx: CanvasRenderingContext2D, message: Message) {
    ctx.beginPath();
    ctx.arc(message.position.x, message.position.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = MESSAGE_COLORS[message.type];
    if (message.type === 'proposalGossip') {
      ctx.strokeStyle = 'black';
      ctx.stroke();
    }
    ctx.fill();
  }
  
  drawVertex(ctx: CanvasRenderingContext2D, vertex: Position) {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  }

  drawCenter(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.centerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
    
  animateMessages(ctx: CanvasRenderingContext2D, messages: Message[], proposalToDispatch: Message[]) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawCenter(ctx);
    this.vertices.forEach(vertex => this.drawVertex(ctx, vertex));

    messages.forEach(message => {
      let dx = message.destination.x - message.position.x;
      let dy = message.destination.y - message.position.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let speed = 1;

      message.updateHasReachedCenter(this.center, this.centerRadius);
      message.updateHasReachedDestination(message.destination);

      if (!message.hasReachedCenter && message.destination == this.center) {
        let dxCenter = this.center.x - message.position.x;
        let dyCenter = this.center.y - message.position.y;
        let distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
        message.position.x += dxCenter / distanceCenter * speed;
        message.position.y += dyCenter / distanceCenter * speed;
      }

      if (message.hasReachedCenter && !message.hasReachedDestination && !message.processed) {
        message.processed = true;
        if (message.type === 'proposal') {
          this.vertices.forEach(vertex => {
            if (!(vertex.x === message.origin.x && vertex.y === message.origin.y)) {
              const response = new Message(this.center, vertex, 'proposalGossip');
              proposalToDispatch.push(response);
            }
          });
        }
      }

      if (message.processed && !message.hasReachedDestination) {
        message.position.x += dx / distance * speed;
        message.position.y += dy / distance * speed;
      }

      if (distance <= 1) {
        message.hasReachedDestination = true;
      }
    });

    let remainingMessages = messages.filter(message => !message.hasReachedDestination);
    remainingMessages.forEach(message => this.drawMessage(ctx, message));

    return proposalToDispatch;
  }
}
export default Graph;
