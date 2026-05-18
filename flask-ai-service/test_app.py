import pytest
import io
from app import app
from services import calculate_ats_score

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json == {"status": "healthy"}

def test_analyze_no_file(client):
    response = client.post('/api/analyze')
    assert response.status_code == 400
    assert "error" in response.json

def test_ats_score_calculation():
    resume = "I am a skilled Python developer with experience in Django and Flask."
    job = "Looking for a Python developer with Django experience."
    score = calculate_ats_score(resume, job)
    assert score > 0
