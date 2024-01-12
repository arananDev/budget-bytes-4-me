from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import pandas as pd
from data import explorer as de
import json

df = pd.read_csv("./data/data.csv")
app = Flask(__name__)
CORS(app)


@app.route('/api/get_boundaries')
def get_boundaries():
    results = de.find_min_max_values(df)
    return jsonify(results)

@app.route('/api/get_data', methods=["GET"])
def get_data():
    if request.method == "GET":
        filters = json.loads(request.args.get("data"))
        filtered_data = de.find_filtered_numerical_data(filters, df)
        return jsonify( filtered_data)




if __name__ == "__main__":
    app.run(debug=True)
