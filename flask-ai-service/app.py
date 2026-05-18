from flask import Flask, request, jsonify
from services import extract_text_from_pdf, calculate_ats_score, extract_skills, generate_summary

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
            
        ats_score = calculate_ats_score(resume_text, job_description)
        skills = extract_skills(resume_text)
        summary = generate_summary(resume_text)
        
        return jsonify({
            "status": "success",
            "data": {
                "ats_score": ats_score,
                "skills": skills,
                "summary": summary
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
