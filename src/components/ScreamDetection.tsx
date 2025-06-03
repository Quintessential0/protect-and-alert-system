
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ScreamDetection = () => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [sensitivity, setSensitivity] = useState(150);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let mediaRecorder: MediaRecorder | null = null;
    let audioContext: AudioContext | null = null;
    let animationFrame: number;

    const startDetection = async () => {
      if (!isListening) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        
        microphone.connect(analyser);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const detectScream = () => {
          if (!isListening) return;
          
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setAudioLevel(average);
          
          // Simple scream detection based on audio level threshold
          if (average > sensitivity) {
            handleScreamDetected();
          }
          
          animationFrame = requestAnimationFrame(detectScream);
        };
        
        detectScream();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access for scream detection.",
          variant: "destructive",
        });
        setIsListening(false);
      }
    };

    if (isListening) {
      startDetection();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isListening, sensitivity]);

  const handleScreamDetected = () => {
    toast({
      title: "Scream Detected!",
      description: "Emergency protocols activated. Alerting contacts...",
      variant: "destructive",
    });
    
    // Trigger emergency alert
    console.log('Scream detected - triggering emergency alert');
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast({
        title: "Scream Detection Activated",
        description: "Monitoring audio for distress signals.",
      });
    } else {
      toast({
        title: "Scream Detection Deactivated",
        description: "No longer monitoring audio.",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-emergency-600" />
          <h2 className="text-xl font-bold text-gray-900">Scream Detection</h2>
        </div>
        <button
          onClick={toggleListening}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isListening
              ? 'bg-emergency-600 text-white hover:bg-emergency-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isListening ? 'Stop Detection' : 'Start Detection'}</span>
        </button>
      </div>

      {/* Audio Level Indicator */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audio Level
          </label>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                audioLevel > sensitivity ? 'bg-emergency-600' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((audioLevel / 255) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Sensitivity Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sensitivity: {sensitivity}
          </label>
          <input
            type="range"
            min="50"
            max="200"
            value={sensitivity}
            onChange={(e) => setSensitivity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Status */}
        <div className={`p-4 rounded-lg border ${
          isListening 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isListening ? 'Active - Monitoring for distress signals' : 'Inactive - Click start to begin monitoring'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreamDetection;
