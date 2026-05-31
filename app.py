from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(__name__)  # <-- INI YANG HILANG

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    pesan = request.json["message"].lower()
    
    if "halo" in pesan or "hai" in pesan or "hi" in pesan:
        balasan = "Halo Idann! Saya Veemon, aku buatanmu."
    elif "siapa kamu" in pesan:
        balasan = "Aku Veemon, asisten AI pribadimu yang lagi belajar."
    elif "jam" in pesan:
        jam = datetime.now().strftime("%H:%M")
        balasan = f"Sekarang jam {jam} Idann"
    elif "makasih" in pesan or "thanks" in pesan:
        balasan = "Sama-sama Wildan! Ada yang bisa Veemon bantu lagi?"
    elif "kamu lagi apa?" in pesan:
        balasan = "aku ini hanyalah chatbot yang gak ngapa-ngapain"
    else:
        balasan = f"Kamu ngetik: {pesan}. Veemon belum paham, ajarin dong."
        
    return jsonify({"reply": balasan})

if __name__ == '__main__':
    app.run(debug=True)  # <-- INI JUGA PENTING