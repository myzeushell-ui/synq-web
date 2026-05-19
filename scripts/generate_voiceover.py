import asyncio
import edge_tts
import os

OUT = os.path.join(os.path.dirname(__file__), '..', 'video_frames')

# Voice: en-US-JennyNeural — warm, calm, professional female
VOICE = "en-US-JennyNeural"

# Each line = one audio segment, matched to a screen
SEGMENTS = [
    ("00_intro.mp3",
     "Most productivity apps assume you're already okay. "
     "That you can open a blank page, fill in the fields, and get things done. "
     "But 85% of knowledge workers feel overwhelmed regularly. "
     "And when that happens — they close the app. "
     "The thoughts stay stuck in their head. The mental load just compounds."),

    ("01_home.mp3",
     "Synq is different. It starts by asking how you're feeling — "
     "and then it listens. No blank page. No structured fields. "
     "Just you, speaking your mind."),

    ("03_voice.mp3",
     "Tap the microphone and say whatever's on your mind. "
     "Tasks, feelings, reminders — all in one sentence. "
     "For example: I feel overwhelmed. I need to buy groceries, finish the report, "
     "and call Mom today at 5pm. "
     "That's it. Synq figures out the rest."),

    ("04_results.mp3",
     "In under three seconds, Synq detects the emotion — overwhelmed. "
     "Extracts two tasks. "
     "And automatically creates a reminder for 5pm today. "
     "Zero form-filling. Everything lands exactly where it belongs."),

    ("05_thoughts.mp3",
     "Your thoughts tab keeps everything organized. "
     "Filter by status, tag, or priority. "
     "Swipe to complete. Pull to refresh. "
     "No cognitive overhead — just your list, clean and actionable."),

    ("06_emotions.mp3",
     "The emotions screen tracks your mood over time. "
     "Seven days of data, pattern recognition, intensity scores. "
     "And when you need to decompress — the box breathing exercise is one tap away. "
     "Four seconds in. Four hold. Four out. Four rest."),

    ("07_reminders.mp3",
     "Reminders with a full calendar view. "
     "Every entry linked back to the thought that created it. "
     "Nothing falls through the cracks."),

    ("08_market.mp3",
     "The productivity software market is 102 billion dollars. "
     "But the intersection of mental health and productivity — "
     "tools built for people with ADHD, anxiety, high cognitive load — "
     "that's an 8 billion dollar niche that nobody has properly claimed yet. "
     "45 million Americans report ADHD symptoms. Diagnoses are up 60% since 2020. "
     "And the stigma is gone. People will pay for tools that acknowledge how they feel."),

    ("09_close.mp3",
     "Synq is pre-seed. Fully functional. Built solo in weeks using AI-native development — "
     "itself a proof of what's possible in 2026. "
     "We're looking for Speedrun to validate our go-to-market, "
     "connect us to the consumer health ecosystem, "
     "and help find our technical co-founder. "
     "The next generation of productivity tools will need emotional intelligence as a baseline. "
     "We built that baseline. "
     "This is Synq."),
]

async def generate():
    for filename, text in SEGMENTS:
        out_path = os.path.join(OUT, filename)
        communicate = edge_tts.Communicate(text, VOICE, rate="-5%", pitch="-2Hz")
        await communicate.save(out_path)
        print(f"OK {filename}")

asyncio.run(generate())
print("\nAll audio segments saved."  )
