import subprocess

ports = [8000, 5173]
for port in ports:
    print(f"Checking port {port}...")
    out = subprocess.getoutput(f"netstat -ano | findstr :{port}")
    for line in out.splitlines():
        if "LISTENING" in line:
            parts = line.strip().split()
            pid = parts[-1]
            if pid != "0":
                print(f"Killing PID {pid} on port {port}")
                subprocess.call(["taskkill", "/F", "/PID", pid])
print("Done killing ports.")
