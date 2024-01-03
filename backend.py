from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from data import explorer as de

df = pd.read_csv("./data/data.csv")
app = Flask(__name__)
CORS(app)


@app.route('/api/get_boundaries')
def get_boundaries():
    results = de.find_min_max_values(df)
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)
