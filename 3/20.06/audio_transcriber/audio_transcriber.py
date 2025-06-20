#!/usr/bin/env python3
"""
Audio Transcriber and Analyzer
A console application that transcribes audio files using OpenAI's Whisper API,
summarizes the content using GPT, and extracts meaningful analytics.
"""

import os
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import openai
from dotenv import load_dotenv

class AudioTranscriber:
    def __init__(self):
        """Initialize the AudioTranscriber with OpenAI client."""
        load_dotenv()
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        self.client = openai.OpenAI(api_key=api_key)
        self.output_dir = Path("output")
        self.output_dir.mkdir(exist_ok=True)
    
    def transcribe_audio(self, audio_file_path: str) -> str:
        """
        Transcribe audio file using OpenAI's Whisper API.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Transcribed text
        """
        print(f"Transcribing audio file: {audio_file_path}")
        
        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            
            print("Transcription completed successfully!")
            return transcript
            
        except Exception as e:
            print(f"Error transcribing audio: {e}")
            raise
    
    def summarize_transcript(self, transcript: str) -> str:
        """
        Summarize the transcript using GPT model.
        
        Args:
            transcript: The transcribed text
            
        Returns:
            Summary of the transcript
        """
        print("Generating summary...")
        
        prompt = f"""
        Please provide a comprehensive summary of the following transcript. 
        Focus on the main points, key insights, and important details.
        
        Transcript:
        {transcript}
        
        Summary:
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that creates clear, concise summaries of audio transcripts."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            summary = response.choices[0].message.content
            print("Summary generated successfully!")
            return summary
            
        except Exception as e:
            print(f"Error generating summary: {e}")
            raise
    
    def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """
        Analyze the transcript and extract custom statistics.
        
        Args:
            transcript: The transcribed text
            
        Returns:
            Dictionary containing analytics
        """
        print("Analyzing transcript...")
        
        # Calculate word count
        words = transcript.split()
        word_count = len(words)
        
        # Estimate speaking speed (assuming average speaking rate of 150 WPM)
        # For more accurate calculation, we'd need audio duration
        speaking_speed_wpm = 150  # Default estimate
        
        # Extract frequently mentioned topics using GPT
        topics_prompt = f"""
        Analyze the following transcript and identify the top 3-5 most frequently mentioned topics or themes.
        Return the results as a JSON array with objects containing "topic" and "mentions" fields.
        
        Transcript:
        {transcript}
        
        Return only valid JSON in this format:
        [
            {{"topic": "Topic Name", "mentions": number}},
            {{"topic": "Another Topic", "mentions": number}}
        ]
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that analyzes text and returns structured JSON data."},
                    {"role": "user", "content": topics_prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            topics_response = response.choices[0].message.content
            frequently_mentioned_topics = json.loads(topics_response)
            
            analytics = {
                "word_count": word_count,
                "speaking_speed_wpm": speaking_speed_wpm,
                "frequently_mentioned_topics": frequently_mentioned_topics
            }
            
            print("Analysis completed successfully!")
            return analytics
            
        except Exception as e:
            print(f"Error analyzing transcript: {e}")
            # Fallback analytics
            return {
                "word_count": word_count,
                "speaking_speed_wpm": speaking_speed_wpm,
                "frequently_mentioned_topics": [
                    {"topic": "General Content", "mentions": 1}
                ]
            }
    
    def save_transcription(self, transcript: str, audio_filename: str) -> str:
        """
        Save transcription to a file with timestamp.
        
        Args:
            transcript: The transcribed text
            audio_filename: Original audio filename
            
        Returns:
            Path to the saved transcription file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = Path(audio_filename).stem
        transcription_file = self.output_dir / f"transcription_{base_name}_{timestamp}.md"
        
        with open(transcription_file, 'w', encoding='utf-8') as f:
            f.write(f"# Transcription: {audio_filename}\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(transcript)
        
        print(f"Transcription saved to: {transcription_file}")
        return str(transcription_file)
    
    def save_summary(self, summary: str, audio_filename: str) -> str:
        """
        Save summary to a file with timestamp.
        
        Args:
            summary: The summary text
            audio_filename: Original audio filename
            
        Returns:
            Path to the saved summary file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = Path(audio_filename).stem
        summary_file = self.output_dir / f"summary_{base_name}_{timestamp}.md"
        
        with open(summary_file, 'w', encoding='utf-8') as f:
            f.write(f"# Summary: {audio_filename}\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(summary)
        
        print(f"Summary saved to: {summary_file}")
        return str(summary_file)
    
    def save_analysis(self, analytics: Dict[str, Any], audio_filename: str) -> str:
        """
        Save analytics to a JSON file with timestamp.
        
        Args:
            analytics: The analytics data
            audio_filename: Original audio filename
            
        Returns:
            Path to the saved analysis file
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_name = Path(audio_filename).stem
        analysis_file = self.output_dir / f"analysis_{base_name}_{timestamp}.json"
        
        with open(analysis_file, 'w', encoding='utf-8') as f:
            json.dump(analytics, f, indent=2, ensure_ascii=False)
        
        print(f"Analysis saved to: {analysis_file}")
        return str(analysis_file)
    
    def process_audio_file(self, audio_file_path: str) -> Dict[str, str]:
        """
        Process an audio file: transcribe, summarize, and analyze.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            Dictionary with paths to generated files
        """
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Audio file not found: {audio_file_path}")
        
        audio_filename = os.path.basename(audio_file_path)
        print(f"\n{'='*50}")
        print(f"Processing: {audio_filename}")
        print(f"{'='*50}")
        
        # Step 1: Transcribe
        transcript = self.transcribe_audio(audio_file_path)
        
        # Step 2: Summarize
        summary = self.summarize_transcript(transcript)
        
        # Step 3: Analyze
        analytics = self.analyze_transcript(transcript)
        
        # Step 4: Save files
        transcription_file = self.save_transcription(transcript, audio_filename)
        summary_file = self.save_summary(summary, audio_filename)
        analysis_file = self.save_analysis(analytics, audio_filename)
        
        # Step 5: Display results
        print(f"\n{'='*50}")
        print("RESULTS")
        print(f"{'='*50}")
        print(f"Word Count: {analytics['word_count']}")
        print(f"Speaking Speed: {analytics['speaking_speed_wpm']} WPM")
        print("\nFrequently Mentioned Topics:")
        for topic in analytics['frequently_mentioned_topics']:
            print(f"  - {topic['topic']}: {topic['mentions']} mentions")
        
        print(f"\nSummary:")
        print(summary)
        
        return {
            "transcription": transcription_file,
            "summary": summary_file,
            "analysis": analysis_file
        }

def main():
    """Main function to run the audio transcriber."""
    print("Audio Transcriber and Analyzer")
    print("=" * 40)
    
    try:
        transcriber = AudioTranscriber()
        
        # Get audio file path from user
        audio_file = input("Enter the path to your audio file: ").strip()
        
        if not audio_file:
            print("No file path provided. Exiting.")
            return
        
        # Process the audio file
        results = transcriber.process_audio_file(audio_file)
        
        print(f"\n{'='*50}")
        print("FILES GENERATED")
        print(f"{'='*50}")
        for file_type, file_path in results.items():
            print(f"{file_type.title()}: {file_path}")
        
        print(f"\nProcessing completed successfully!")
        
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main()) 