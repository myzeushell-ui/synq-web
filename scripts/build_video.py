import subprocess, os, json, sys

FFMPEG  = r'C:\Users\PC\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe'
FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe')

FRAMES = os.path.join(os.path.dirname(__file__), '..', 'video_frames')
OUT_VIDEO = os.path.join(os.path.dirname(__file__), '..', 'SYNQ_DEMO.mp4')

# Map: audio segment -> which image to show
# Some segments share an image (intro uses desktop, close uses desktop again)
PLAN = [
    ("00_intro.mp3",  "09_desktop.png"),   # Problem narration over desktop view
    ("01_home.mp3",   "01_home.png"),       # Home screen
    ("03_voice.mp3",  "03_voice_modal.png"),# Voice modal
    ("04_results.mp3","04_thoughts.png"),   # Results -> thoughts
    ("05_thoughts.mp3","04_thoughts.png"),  # Thoughts tab
    ("06_emotions.mp3","06_breathing.png"), # Emotions + breathing
    ("07_reminders.mp3","08_calendar.png"), # Reminders calendar
    ("08_market.mp3", "09_desktop.png"),    # Market slide -> desktop
    ("09_close.mp3",  "09_desktop.png"),    # Close on desktop
]

def get_duration(mp3_path):
    r = subprocess.run(
        [FFPROBE, '-v', 'quiet', '-print_format', 'json',
         '-show_format', mp3_path],
        capture_output=True, text=True
    )
    return float(json.loads(r.stdout)['format']['duration'])

def build():
    # Build concat list: for each segment, create a video clip
    segments = []
    total = 0.0
    for audio_file, img_file in PLAN:
        audio_path = os.path.join(FRAMES, audio_file)
        img_path   = os.path.join(FRAMES, img_file)
        dur = get_duration(audio_path)
        segments.append((img_path, audio_path, dur))
        total += dur
        print(f"  {audio_file}: {dur:.1f}s")

    print(f"\nTotal duration: {total:.1f}s ({total/60:.1f} min)")

    # Build individual clips then concat
    clips = []
    concat_lines = []
    for i, (img, audio, dur) in enumerate(segments):
        clip_path = os.path.join(FRAMES, f'clip_{i:02d}.mp4')
        clips.append(clip_path)
        cmd = [
            FFMPEG, '-y', '-loop', '1',
            '-i', img,
            '-i', audio,
            '-c:v', 'libx264', '-tune', 'stillimage',
            '-c:a', 'aac', '-b:a', '192k',
            '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x0A0A0D,format=yuv420p',
            '-shortest',
            '-r', '30',
            clip_path
        ]
        subprocess.run(cmd, capture_output=True)
        concat_lines.append(f"file '{clip_path.replace(chr(92), '/')}'\n")
        print(f"  Built clip {i+1}/{len(segments)}")

    # Write concat list
    concat_file = os.path.join(FRAMES, 'concat.txt')
    with open(concat_file, 'w') as f:
        f.writelines(concat_lines)

    # Concat all clips
    cmd = [
        FFMPEG, '-y',
        '-f', 'concat', '-safe', '0',
        '-i', concat_file,
        '-c', 'copy',
        OUT_VIDEO
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("CONCAT ERROR:", r.stderr[-1000:])
        sys.exit(1)

    size_mb = os.path.getsize(OUT_VIDEO) / 1024 / 1024
    print(f"\nVideo saved: {OUT_VIDEO} ({size_mb:.1f} MB, {total:.0f}s)")

build()
