# -*- coding: utf-8 -*-
import os
import psycopg2
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

# Debug: ver se o .env foi lido
print("DEBUG VARIAVEIS:")
print("DB_HOST =", os.getenv("DB_HOST"))
print("DB_PORT =", os.getenv("DB_PORT"))
print("DB_NAME =", os.getenv("DB_NAME"))
print("DB_USER =", os.getenv("DB_USER"))
print("DB_PASS definida? ->", bool(os.getenv("DB_PASS")))
print("-" * 40)

try:
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
    )
    print("Conexao com o banco realizada com sucesso.")

    cur = conn.cursor()
    cur.execute("SELECT current_database(), current_user;")
    dbname, dbuser = cur.fetchone()
    print("Banco:", dbname, "| Usuario:", dbuser)

    cur.close()
    conn.close()
    print("Conexao encerrada.")
except Exception as e:
    print("Erro ao conectar:", e)
# Fim do arquivo db.py