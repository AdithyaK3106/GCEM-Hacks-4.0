import asyncio
import websockets
import json

async def test_ws():
    uri = "ws://localhost:8000/stream-audio?session_id=test_session"
    async with websockets.connect(uri) as websocket:
        print("Connected!")
        # Send a PING
        await websocket.send(json.dumps({"type": "PING"}))
        response = await websocket.recv()
        print(f"Received: {response}")
        # Send a STOP
        await websocket.send(json.dumps({"type": "STOP"}))
        print("Sent STOP")
        try:
            while True:
                response = await websocket.recv()
                print(f"Received: {response}")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")

if __name__ == "__main__":
    asyncio.run(test_ws())
