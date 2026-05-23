from flask import Flask, request, jsonify
from services import extract_text_from_pdf, analyze_resume_full

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    
    file = request.files['resume']
    job_description = request.form.get('job_description', '')
    
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400
        
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Only PDF files are supported"}), 400
        
    try:
        file_bytes = file.read()
        resume_text = extract_text_from_pdf(file_bytes)
        
        if not resume_text:
            return jsonify({"error": "Could not extract text from PDF"}), 400
            
        # Get full comprehensive JSON analysis from AI
        analysis_json = analyze_resume_full(resume_text, job_description)
        
        # We return the exact data structure expected by Django Tasks
        # Django task expects: ats_score, summary, skills
        # We will map the AI's "score" to "ats_score", and pass the entire 
        # rest of the JSON inside the "skills" object so it gets saved to the JSONField
        
        return jsonify({
            "status": "success",
            "data": {
                "ats_score": analysis_json.get("score", 0),
                "summary": analysis_json.get("summary", "Analysis complete."),
                # We save the full AI payload in the 'skills' JSONField in Django
                "skills": analysis_json
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
