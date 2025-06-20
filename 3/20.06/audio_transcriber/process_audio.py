#!/usr/bin/env python3
"""
Script to process the specific audio file CAR0004.mp3
and generate the required output files for the task.
"""

import os
import sys
from audio_transcriber import AudioTranscriber

def main():
    """Process the CAR0004.mp3 audio file."""
    audio_file = "audio/CAR0004.mp3"
    
    # Check if audio file exists
    if not os.path.exists(audio_file):
        print(f"Error: Audio file not found at {audio_file}")
        return 1
    
    try:
        # Initialize the transcriber
        transcriber = AudioTranscriber()
        
        print(f"Processing audio file: {audio_file}")
        print("=" * 50)
        
        # Process the audio file
        results = transcriber.process_audio_file(audio_file)
        
        print(f"\n{'='*50}")
        print("PROCESSING COMPLETED")
        print(f"{'='*50}")
        print("Generated files:")
        for file_type, file_path in results.items():
            print(f"  {file_type.title()}: {file_path}")
        
        print("\n✓ All required files created successfully!")
        print("  - transcription.md")
        print("  - summary.md") 
        print("  - analysis.json")
        
        return 0
        
    except Exception as e:
        print(f"Error processing audio: {e}")
        return 1

if __name__ == "__main__":
    exit(main()) 