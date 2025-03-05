from flask import Flask, request, jsonify
from flask_cors import CORS
from courseAnalysis import processList

app = Flask(__name__)
CORS(app)
    

@app.route('/api/courses', methods=['POST'])
def getCourses():
    try:
        data = request.get_json()
        if "input_list" not in data:
            return jsonify({"error": "Missing 'input_list' key"}), 400
        if "rem_list" not in data:
            return jsonify({"error": "Missing 'rem_list' key"}), 400
        if "cas_filter" not in data:
            return jsonify({"error": "Missing 'cas_filter' key"}), 400
        if "num_filter" not in data:
            return jsonify({"error": "Missing 'num_filter' key"}), 400
        
        input_list = data.get("input_list")
        rem_list = data.get("rem_list")
        cas_filter = data.get("cas_filter")
        num_filter = int(data.get("num_filter"))

        if len(input_list) == 0:
            out = processList(rem_list=rem_list, filterCAS=cas_filter, numFilter=num_filter)
        else:
            out = processList(hubs=input_list, rem_list=rem_list, filterCAS=cas_filter, numFilter=num_filter)
        return jsonify({"result" : out})
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
@app.route('/api/courseRem', methods=['POST'])
def courseRem():
    try:
        data = request.get_json()
        if "input_list" not in data:
            return jsonify({"error": "Missing 'input_list' key"}), 400
        if "rem_list" not in data:
            return jsonify({"error": "Missing 'rem_list' key"}), 400
        
        input_list = data.get("input_list")
        rem_list = data.get("rem_list")

        
        if len(input_list) == 0:
            out = processList(rem_list=rem_list)
        else:
            out = processList(hubs=input_list, rem_list=rem_list)
        return jsonify({"result" : out})

    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
@app.route('/api/filter', methods=['POST'])
def casFilter():
    try:
        data = request.get_json()
        if "input_list" not in data:
            return jsonify({"error": "Missing 'input_list' key"}), 400
        if "rem_list" not in data:
            return jsonify({"error": "Missing 'rem_list' key"}), 400
        
        input_list = data.get("input_list")
        rem_list = data.get("rem_list")
        
        if len(input_list) == 0:
            out = processList(rem_list=rem_list, filterCAS=True)
        else:
            out = processList(hubs=input_list, rem_list=rem_list, filterCAS=True)
        return jsonify({"result" : out})
    except Exception as e:
        return jsonify({"error" : str(e)}), 500
    
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)