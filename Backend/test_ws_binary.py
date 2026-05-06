import asyncio
import websockets
import json
import struct

async def test_ws_binary():
    uri = "ws://localhost:8000/stream-audio?session_id=test_session_binary"
    async with websockets.connect(uri) as websocket:
        print("Connected!")
        
        # Build a binary message like streamClient.ts does
        header = json.dumps({
            "sessionId": "test_session_binary",
            "chunkIndex": 0,
            "sampleRate": 16000,
            "timestamp": 0
        })
        header_bytes = header.encode('utf-8')
        pcm_bytes = b'\x00' * 3200 # 0.1s of silence (16000Hz * 0.1s * 2 bytes/sample... wait, sample_width is 4 in metrics call?)
        
        # Wire format: [4 bytes header len] [header] [pcm]
        msg = struct.pack("<I", len(header_bytes)) + header_bytes + pcm_bytes
        
        await websocket.send(msg)
        print("Sent binary chunk")
        
        try:
            # We expect metrics and maybe an ack
            for _ in range(5):
                response = await websocket.recv()
                print(f"Received: {response}")
        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")

if __name__ == "__main__":
    asyncio.run(test_ws_binary())
