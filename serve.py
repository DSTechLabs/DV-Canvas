from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Allow access from any origin
        self.send_header('Access-Control-Allow-Origin', '*')
        # Add other headers if needed (e.g., methods or headers)
        super().end_headers()

if __name__ == '__main__':
    port = 8000
    print(f"Serving on http://localhost:{port} with CORS enabled...")
    HTTPServer(('localhost', port), CORSRequestHandler).serve_forever()
