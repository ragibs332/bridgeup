import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, AlertTriangle, Check, FlipHorizontal, Sparkles } from 'lucide-react';

export default function LiveCameraModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check available cameras
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Start video stream when modal opens or facingMode changes
  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    startStream(facingMode);

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {}
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startStream = async (mode) => {
    stopStream();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Direct live camera streaming is not supported on this browser. Please use the "Choose File / Gallery" option.');
      return;
    }

    try {
      const constraints = {
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser or device settings, or select a photo from your gallery.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please choose a photo from your files.');
      } else {
        // Retry with default video constraints if facingMode failed
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          streamRef.current = fallbackStream;
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play().catch(() => {});
          }
        } catch (innerErr) {
          setCameraError('Unable to open camera stream. Please use the file upload option.');
        }
      }
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      // Max dimension 600px for optimal speed and zero lag
      let targetWidth = width;
      let targetHeight = height;
      const maxDim = 600;

      if (width > height && width > maxDim) {
        targetHeight = Math.round((height * maxDim) / width);
        targetWidth = maxDim;
      } else if (height > maxDim) {
        targetWidth = Math.round((width * maxDim) / height);
        targetHeight = maxDim;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.70);
        
        stopStream();
        onCapture(dataUrl);
        onClose();
      }
    } catch (err) {
      console.error('Error capturing live photo:', err);
      setCameraError('Failed to capture photo frame.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-bold text-sm text-white">Live Camera Capture</h3>
              <p className="text-[10px] text-slate-400">Direct in-app photo capture</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {hasMultipleCameras && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Switch Camera (Front/Rear)"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative flex-1 bg-black min-h-[300px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Camera Unavailable</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => startStream(facingMode)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover max-h-[55vh]"
              />

              {/* Viewfinder Grid Guidelines */}
              <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-6 rounded-2xl flex flex-col justify-between p-4">
                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                  <span>LIVE CAM</span>
                  <span>{facingMode === 'environment' ? 'REAR' : 'FRONT'}</span>
                </div>
                <div className="text-center">
                  <span className="bg-black/50 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                    Aim at emergency situation
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
          >
            Cancel
          </button>

          {!cameraError && (
            <button
              type="button"
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-950"></div>
              </div>
              <span>{isCapturing ? 'Snapping...' : 'Take Live Photo'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
