# Uni: multiuser activities for learning a foreign language #

[Demo](https://jazyx.github.io/uni)

This project uses Vite React and WebSocket to provide activities to encourage beginning language learners to speak.

## Memory
A turn-based game for any number of players, to provide vocabulary for common items, and encourage the use of numbers and prepositions. For example: "The cat is under the camel."

## Trumps
A turn-based game for asking and answering questions about numbers and quantities, while learning the names of a variety of animals and their young.

---

## Protection against dropped connections
The app is designed to withstand constantly-dropped connections. It uses WebSocket rather than Socket.io, as the handshake used by WebSocket is much simpler and less likely to be interfered with through Deep Packet Inspection.

When a player is waiting for input from other players, the app checks the connection every few seconds, and reloads the entire game state if the connection is dropped and has to be reinstated.