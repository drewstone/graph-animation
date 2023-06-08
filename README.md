# Graph Animation

This project is a graph animation application built using React. It simulates the exchange of messages between vertices in a graph and visualizes the movement of messages on a canvas.

## Features

- Random generation of messages from vertices to the center of the canvas.
- Special handling of `proposal` messages to trigger additional messages (`proposalGossip`) from the center to other vertices.
- Sequential submission of events to simulate a specific sequence of messages.

## Installation

1. Clone the repository:

   ```shell
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```shell
   cd graph-animation
   ```

3. Install the dependencies:

   ```shell
   yarn
   ```

4. Start the application:

   ```shell
   yarn start
   ```