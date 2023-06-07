import { Message, Position } from "./Graph";

export function generateCirclePoints(center: Position, radius: number, count: number): Position[] {
  let angles = Array.from({length: count}, (_, i) => (i / count) * (2 * Math.PI));
  return angles.map(angle => ({
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  }));
}

export function generateRandomMessage(start: Position, center: Position): Message {
  const types: ('zkp' | 'asset' | 'proposal')[] = ['zkp', 'asset', 'proposal'];
  const randomType = types[Math.floor(Math.random() * types.length)];

  const message = new Message({ ...start }, center, randomType);  // Copy the start position
  return message;
}