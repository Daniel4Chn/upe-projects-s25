from flask import Flask, request, jsonify
from flask_cors import CORS
from courseAnalysis import processList

app = Flask(__name__)
CORS(app)

@app.route('/api/courseFind', methods=['POST'])
def courseFind():
    try:
        data = request.get_json()
        if "input_list" not in data:
            return jsonify({"error": "Missing 'input_list' key"}), 400

        input_list = data.get("input_list")
        print(input_list)
        if len(input_list) == 0:
            out = processList()
        else:
            out = processList(input_list)
        result = []

        for course in out:
            result.append(course)

        return jsonify({"result" : result})
    
    except Exception as e:
        return jsonify({"error" : str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)