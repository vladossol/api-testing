from flask import Flask, request, jsonify
import uuid
from datetime import datetime

app = Flask(__name__)
jobs = {}

@app.route('/jobs', methods=['POST'])
def create_job():
    data = request.json
    
    # Bug: doesn't validate title length properly
    if not data.get('title'):
        return jsonify({"error": "title required"}), 400
    
    if data.get('priority') not in ['low', 'medium', 'high']:
        return jsonify({"error": "invalid priority"}), 400
    
    job_id = str(uuid.uuid4())[:8]
    job = {
        "id": job_id,
        "title": data['title'],
        "priority": data.get('priority', 'medium'),
        "status": "pending",
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    jobs[job_id] = job
    return jsonify(job), 201

@app.route('/jobs/<job_id>', methods=['GET'])
def get_job(job_id):
    if job_id not in jobs:
        return jsonify({"error": "not found"}), 404
    return jsonify(jobs[job_id])

@app.route('/jobs', methods=['GET'])
def list_jobs():
    status = request.args.get('status')
    priority = request.args.get('priority')
    limit = int(request.args.get('limit', 10))
    
    # Bug: doesn't validate status/priority values
    # Bug: doesn't cap limit at 100
    
    result = list(jobs.values())
    if status:
        result = [j for j in result if j['status'] == status]
    if priority:
        result = [j for j in result if j['priority'] == priority]
    
    return jsonify(result[:limit])

@app.route('/jobs/<job_id>', methods=['PATCH'])
def update_job(job_id):
    if job_id not in jobs:
        return jsonify({"error": "not found"}), 404
    
    data = request.json
    new_status = data.get('status')
    
    # Bug: doesn't validate status transitions
    jobs[job_id]['status'] = new_status
    return jsonify(jobs[job_id])

@app.route('/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    if job_id not in jobs:
        return jsonify({"error": "not found"}), 404
    
    # Bug: doesn't check if job is running
    del jobs[job_id]
    return '', 204

if __name__ == '__main__':
    app.run(port=5000)
    