# api.py — servidor HTTP simples sem frameworks
import os, json
from http.server import BaseHTTPRequestHandler, HTTPServer
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

def get_conn():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        options='-c client_encoding=UTF8'
    )

# ---------- Consultas ----------
def fetch_projects():
    """
    Busca todos os projetos com suas habilidades e imagem associada.
    """
    sql = """
        SELECT 
            p.id,
            p.title,
            p.kind,
            p.description,
            p.repo_url,
            p.live_url,
            p.certificate_url,
            p.image_url,
            COALESCE(string_agg(s.name, ', ' ORDER BY s.name), '') AS skills
        FROM project p
        LEFT JOIN project_skill ps ON ps.project_id = p.id
        LEFT JOIN skill s          ON s.id = ps.skill_id
        GROUP BY 
            p.id, p.title, p.kind, p.description,
            p.repo_url, p.live_url, p.certificate_url, p.image_url
        ORDER BY p.id;
    """
    with get_conn() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql)
        return cur.fetchall()



def fetch_profile():
    sql = "SELECT full_name, headline, bio, email, phone, github, linkedin, instagram FROM profile ORDER BY id LIMIT 1;"
    with get_conn() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql)
        return cur.fetchone() or {}

def fetch_skills():
    sql = "SELECT id, name, category FROM skill ORDER BY category, name;"
    with get_conn() as conn, conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql)
        return cur.fetchall()

# ---------- Handler HTTP ----------
class Handler(BaseHTTPRequestHandler):
    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        try:
            if self.path == "/api/projects":
                self._json({"projects": fetch_projects()})
            elif self.path == "/api/profile":
                self._json({"profile": fetch_profile()})
            elif self.path == "/api/skills":
                self._json({"skills": fetch_skills()})
            else:
                self._json({"error": "rota não encontrada"}, status=404)
        except Exception:
            self._json({"error": "falha ao processar a requisição"}, status=500)

if __name__ == "__main__":
    PORT = 8000
    print(f"Servidor rodando em http://localhost:{PORT}")
    with HTTPServer(("localhost", PORT), Handler) as httpd:
        httpd.serve_forever()
# Fim do arquivo api.py