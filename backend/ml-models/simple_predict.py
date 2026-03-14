import sys
import json
import re

def simple_cyberbullying_detection(text):
    """Simple rule-based cyberbullying detection as fallback"""
    
    # List of cyberbullying keywords and patterns
    toxic_keywords = [
        'hate', 'kill', 'die', 'stupid', 'idiot', 'ugly', 'fat', 'loser',
        'pathetic', 'worthless', 'disgusting', 'freak', 'moron', 'retard',
        'bully', 'harass', 'threat', 'hurt', 'harm', 'abuse', 'attack'
    ]
    
    # List of safe indicators
    safe_keywords = [
        'friend', 'love', 'happy', 'good', 'nice', 'great', 'awesome',
        'wonderful', 'amazing', 'beautiful', 'kind', 'help', 'support'
    ]
    
    text_lower = text.lower()
    
    # Count toxic and safe words
    toxic_count = sum(1 for word in toxic_keywords if word in text_lower)
    safe_count = sum(1 for word in safe_keywords if word in text_lower)
    
    # Simple scoring
    if toxic_count > safe_count and toxic_count > 0:
        confidence = min(0.9, 0.5 + (toxic_count * 0.1))
        return True, confidence
    elif toxic_count == 0 and safe_count > 0:
        confidence = min(0.9, 0.5 + (safe_count * 0.1))
        return False, confidence
    elif toxic_count > 0:
        confidence = 0.6
        return True, confidence
    else:
        confidence = 0.3
        return False, confidence

if __name__ == "__main__":
    try:
        # Get input from command line argument (file path)
        if len(sys.argv) > 1:
            file_path = sys.argv[1]
            with open(file_path, 'r') as f:
                input_data = json.load(f)
            message = input_data['text']
        else:
            # Fallback to reading from stdin
            input_str = sys.stdin.read().strip()
            input_data = json.loads(input_str)
            message = input_data['text']
        
        # Make prediction
        is_bullying, confidence = simple_cyberbullying_detection(message)
        
        # Prepare result
        result = {
            'is_bullying': is_bullying,
            'confidence': confidence,
            'message': 'Cyberbullying Detected' if is_bullying else 'Safe Message'
        }
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'error': str(e),
            'is_bullying': False,
            'confidence': 0.0,
            'message': 'Error processing message'
        }
        print(json.dumps(error_result))
