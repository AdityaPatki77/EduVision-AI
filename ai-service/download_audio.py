# download_audio.py
import yt_dlp
import os

def download_audio(youtube_url: str) -> str:
    """
    Downloads the audio from a YouTube video.
    Returns the path to the downloaded audio file.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': 'audio_cache/%(id)s.%(ext)s',
        'noplaylist': True,
        'cachedir': False, # Disable yt-dlp's internal cache
    }

    # Ensure the audio_cache directory exists
    os.makedirs('audio_cache', exist_ok=True)

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(youtube_url, download=False)
            video_id = info_dict.get('id', None)
            if not video_id:
                raise Exception("Could not extract video ID from URL.")

            audio_filename = os.path.join('audio_cache', f"{video_id}.mp3")

            # Check if the audio file already exists in our cache
            if os.path.exists(audio_filename):
                print(f"Audio already exists in cache: {audio_filename}")
                return audio_filename

            # If not in cache, proceed with download
            ydl.download([youtube_url])
            # yt-dlp might add .webm or .m4a then convert to mp3, so we need to find the actual file
            # It usually names it like 'video_id.mp3' if preferredcodec is 'mp3'
            if os.path.exists(audio_filename):
                 print(f"Downloaded audio to: {audio_filename}")
                 return audio_filename
            else:
                # Fallback if the naming convention is different or conversion failed
                # Try to find any mp3 in the audio_cache that might belong to this video
                for f in os.listdir('audio_cache'):
                    if f.startswith(video_id) and f.endswith('.mp3'):
                        print(f"Found downloaded audio: {os.path.join('audio_cache', f)}")
                        return os.path.join('audio_cache', f)
                raise Exception("Downloaded audio file not found after extraction.")

    except Exception as e:
        print(f"Error downloading audio: {e}")
        raise

if __name__ == "_main_":
    # Example Usage:
    # url = "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
    # try:
    #     audio_path = download_audio(url)
    #     print(f"Audio downloaded to: {audio_path}")
    # except Exception as e:
    #     print(f"Failed to download audio: {e}")
    pass