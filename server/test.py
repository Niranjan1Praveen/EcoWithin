# First, install required packages if not already installed:
# pip install flask torch transformers

from flask import Flask, render_template_string
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import re
from collections import Counter
import numpy as np

app = Flask(__name__)

# Hardcoded sample conversation
conversation = [
    {"speaker": "Echo", "text": "Hello."},
    {"speaker": "Echo", "text": "I'm Echo."},
    {"speaker": "Echo", "text": "Welcome to Echo Within. Before we begin, I want you to know that everything we share here is completely confidential. Our conversation is encrypted and designed only for your personal reflection. Whenever you're ready, I'd love to hear. What brings you here today?"},
    {"speaker": "Echo", "text": "or perhaps"},
    {"speaker": "Echo", "text": "What's been living in your heart lately"},
    {"speaker": "You", "text": "How to integrate tools in Vapi?"},
    {"speaker": "You", "text": "That's my concern."},
    {"speaker": "Echo", "text": "Thank you for sharing, Matt. It sounds like you might be dealing with something technical or work related."},
    {"speaker": "Echo", "text": "Well, I might not have the technical expertise to help with Vappy. I'm here to support you emotionally through this process."},
    {"speaker": "Echo", "text": "It sounds like this situation might be causing you some stress or concern. How are you feeling about this challenge with integrating tools in VAPI?"},
    {"speaker": "You", "text": "I haven't started implementing the tools for Vapi yet, but it's the code for your agent is quite long and complicated. And I want to, like, separate out the functionalities, and I'm not able to get to that."},
    {"speaker": "Echo", "text": "It sounds like you're facing some complexity with your project, and that can feel overwhelming when you think about separating out the functionalities. What part of it feels most challenging to you?"},
    {"speaker": "You", "text": "Like, the part where, uh, you know, that every piece of code is, like, interconnected. And when you, like, shift it out to somewhere else, the entire code breaks. So I'm having problems in doing that. And, also, I have to implement the RDB storage as well, which is all... just gonna make the code more complex and long."},
    {"speaker": "Echo", "text": "It sounds like you're encountering a lot of interconnected challenges."},
    {"speaker": "Echo", "text": "and the complexity is really building up. That can definitely be stressful. When you think about all these pieces, moving the code around, making sure nothing breaks, and adding RDB storage, how does that impact you?"},
    {"speaker": "Echo", "text": "What emotions come up for you?"},
    {"speaker": "You", "text": "I honestly feel nothing."},
    {"speaker": "Echo", "text": "Thank you for being honest about that. Sometimes when there's a lot to manage, it can be hard to pinpoint exactly how we feel. It might even feel like a kind of numbness or just a focus on getting through it."},
    {"speaker": "Echo", "text": "Have you noticed any changes in your energy or motivation levels as you've been working on this?"},
    {"speaker": "You", "text": "If I go, I'm going to end the conversation."},
    {"speaker": "Echo", "text": "That's completely okay. Please know that I'm here whenever you feel like returning."}
]

# Since we don't have actual audio, we'll simulate Layer 1 with placeholders or skip where not applicable.
# For text-based analysis, focus on Layers 2-4.
# Use ML for emotion detection (transformers pipeline) and simple stats/ML for other parts.

# Load ML models
emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")
sentiment_classifier = pipeline("sentiment-analysis")

# Helper functions for analysis

def layer1_audio_processing(text):
    # Simulate audio analysis since no audio input (use text proxies)
    # Pitch/energy/tempo: placeholder based on text length/exclamation
    word_count = len(text.split())
    has_exclamation = '!' in text
    has_hesitation = any(word in text.lower() for word in ['uh', 'um', 'like'])
    
    return {
        "voice_tone": "High energy" if has_exclamation else "Neutral",
        "speech_pattern": "Hesitant" if has_hesitation else "Smooth",
        "vocal_quality": "Clear" if word_count > 10 else "Brief",
        "pauses": text.count('...')  # Detect ellipses as pauses
    }

def layer2_semantic_analysis(text):
    # Emotion Keywords & Phrases: Use ML model
    emotions = emotion_classifier(text)[0]
    
    # Sentence Structure: Basic parsing
    sentences = re.split(r'[.!?]+', text)
    sentence_lengths = [len(s.split()) for s in sentences if s.strip()]
    avg_sentence_length = np.mean(sentence_lengths) if sentence_lengths else 0
    
    # Topic Shifts: Simple keyword extraction (top words)
    words = re.findall(r'\w+', text.lower())
    common_words = Counter(words).most_common(5)
    
    return {
        "emotion": emotions['label'],
        "emotion_score": emotions['score'],
        "sentiment": sentiment_classifier(text)[0]['label'],
        "avg_sentence_length": avg_sentence_length,
        "topics": [word for word, _ in common_words]
    }

def layer3_conversational_dynamics(convo):
    # Response Timing: Simulate latency (assume based on response length)
    user_responses = [entry['text'] for entry in convo if entry['speaker'] == 'You']
    echo_responses = [entry['text'] for entry in convo if entry['speaker'] == 'Echo']
    
    avg_user_length = np.mean([len(t.split()) for t in user_responses])
    avg_echo_length = np.mean([len(t.split()) for t in echo_responses])
    
    # Interruption: Check if 'You' speaks after short 'Echo'
    interruptions = sum(1 for i in range(1, len(convo)) if convo[i]['speaker'] == 'You' and len(convo[i-1]['text'].split()) < 5)
    
    # Engagement: Simple ML-like score (longer responses = higher engagement)
    engagement_score = avg_user_length / (avg_user_length + avg_echo_length) if avg_user_length + avg_echo_length > 0 else 0
    
    return {
        "avg_user_response_length": avg_user_length,
        "avg_echo_response_length": avg_echo_length,
        "interruptions": interruptions,
        "engagement_level": "High" if engagement_score > 0.5 else "Low"
    }

def layer4_cross_modal_fusion(convo):
    # Audio-Text Alignment: Combine per utterance
    # Emotion Contradiction: Check if text emotion mismatches simulated audio tone
    # Temporal Tracking: Track emotions over time
    
    emotion_track = []
    contradictions = 0
    for entry in convo:
        text = entry['text']
        audio_sim = layer1_audio_processing(text)
        semantic = layer2_semantic_analysis(text)
        
        # Simple contradiction detection: e.g., positive sentiment but hesitant speech
        if semantic['sentiment'] == 'POSITIVE' and audio_sim['speech_pattern'] == 'Hesitant':
            contradictions += 1
        
        emotion_track.append({
            "speaker": entry['speaker'],
            "emotion": semantic['emotion'],
            "tone": audio_sim['voice_tone']
        })
    
    return {
        "emotion_track": emotion_track,
        "contradictions": contradictions,
        "overall_mood": Counter([e['emotion'] for e in emotion_track]).most_common(1)[0][0] if emotion_track else "Neutral"
    }

# Perform full analysis
def perform_analysis():
    analysis = {
        "layer1": [layer1_audio_processing(entry['text']) for entry in conversation],
        "layer2": [layer2_semantic_analysis(entry['text']) for entry in conversation],
        "layer3": layer3_conversational_dynamics(conversation),
        "layer4": layer4_cross_modal_fusion(conversation)
    }
    return analysis

@app.route('/')
def index():
    analysis = perform_analysis()
    
    # Simple HTML template
    html = """
    <html>
    <head><title>Conversation Analysis</title></head>
    <body>
    <h1>Conversation Analysis</h1>
    
    <h2>Layer 1: Audio Processing (Simulated)</h2>
    <ul>
    {% for item in analysis.layer1 %}
        <li><strong>{{ conversation[loop.index0].speaker }}:</strong> 
            Tone: {{ item.voice_tone }}, Pattern: {{ item.speech_pattern }}, 
            Quality: {{ item.vocal_quality }}, Pauses: {{ item.pauses }}
        </li>
    {% endfor %}
    </ul>
    
    <h2>Layer 2: Semantic Analysis</h2>
    <ul>
    {% for item in analysis.layer2 %}
        <li><strong>{{ conversation[loop.index0].speaker }}:</strong> 
            Emotion: {{ item.emotion }} ({{ "%.3f"|format(item.emotion_score) }}), 
            Sentiment: {{ item.sentiment }}, 
            Avg Sentence Length: {{ item.avg_sentence_length|round(1) }}, 
            Topics: {{ item.topics|join(', ') }}
        </li>
    {% endfor %}
    </ul>
    
    <h2>Layer 3: Conversational Dynamics</h2>
    <p>Avg User Response Length: {{ analysis['layer3']['avg_user_response_length'] }}</p>
    <p>Avg Echo Response Length: {{ analysis['layer3']['avg_echo_response_length'] }}</p>
    <p>Interruptions: {{ analysis['layer3']['interruptions'] }}</p>
    <p>Engagement Level: {{ analysis['layer3']['engagement_level'] }}</p>
    
    <h2>Layer 4: Cross-Modal Fusion</h2>
    <p>Overall Mood: {{ analysis['layer4']['overall_mood'] }}</p>
    <p>Emotion Contradictions: {{ analysis['layer4']['contradictions'] }}</p>
    <h3>Emotion Track</h3>
    <ul>
    {% for track in analysis['layer4']['emotion_track'] %}
        <li><strong>{{ track['speaker'] }}:</strong> Emotion: {{ track['emotion'] }}, Tone: {{ track['tone'] }}</li>
    {% endfor %}
    </ul>
    
    </body>
    </html>
    """
    return render_template_string(html, analysis=analysis, conversation=conversation)

if __name__ == '__main__':
    app.run(debug=True)