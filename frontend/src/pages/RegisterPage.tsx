import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SimulationBadge } from '../components/SimulationBadge';
import { Lock, Mail, User, Phone, UserPlus, Car, ShieldAlert, Camera, Scan, Eye } from 'lucide-react';
import * as faceapi from '@vladmandic/face-api';

export const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Load Models and Camera when entering Step 2
  useEffect(() => {
    if (step === 2) {
      const loadFaceAPI = async () => {
        try {
          await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models')
          ]);
          setModelsLoaded(true);
        } catch (e) {
          console.error("Failed to load face-api models:", e);
        }
      };
      loadFaceAPI();

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          showToast('Camera Error', 'Could not access the camera for face scan.', 'warning');
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [step]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setErrorMsg('');
    setStep(2); // Proceed to Face Scan
  };

  const handleScanAndRegister = async () => {
    if (!modelsLoaded || !videoRef.current) {
      showToast('Wait', 'AI Models are still loading...', 'warning');
      return;
    }
    
    setIsScanning(true);
    try {
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      
      if (detection) {
        showToast('Biometric Scanned', 'Face successfully mapped to account profile.', 'success');
        
        // Execute final registration API call
        setIsSubmitting(true);
        try {
          await register({
            name,
            email,
            phone,
            password,
            confirm_password: confirmPassword,
          });
          
          // Save credentials temporarily for easy login
          sessionStorage.setItem('easyLoginEmail', email);
          sessionStorage.setItem('easyLoginPassword', password);
          
          showToast('Registration Successful', 'Account created! Please log in.', 'success');
          navigate('/login');
        } catch (err: any) {
          const msg = err.response?.data?.detail || 'Failed to create account.';
          setErrorMsg(msg);
          showToast('Registration Error', msg, 'danger');
          setStep(1); // Return to form
        } finally {
          setIsSubmitting(false);
        }
      } else {
        showToast('Scan Failed', 'No human face detected. Please face the camera directly.', 'danger');
      }
    } catch (e) {
      console.error(e);
      showToast('Scan Error', 'Face scan failed.', 'danger');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen cyber-bg flex flex-col justify-center items-center p-4">
      <div className="mb-6">
        <SimulationBadge size="md" />
      </div>

      <div className="w-full max-w-md rounded-2xl glass-panel-glow border border-slate-700/80 p-8 shadow-2xl relative overflow-hidden">
        {step === 1 ? (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 mb-3">
                <Car className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
              <p className="text-xs text-slate-400 mt-1">Register for AI-Powered Keyless Telematics</p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleContinue} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rohan Varma"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rohan@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Confirm</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Biometric Enrollment</span>
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="text-cyan-400 hover:underline font-medium">
                Sign In Here
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 mx-auto mb-2">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Biometric Enrollment</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please face the camera directly to map your facial mesh to your driver profile.
            </p>

            {/* Simulated Camera Viewfinder Visual */}
            <div className="relative w-full h-48 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden my-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  stream ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Grid Lines Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 z-10 pointer-events-none" />

              {/* Facial Landmark Tracking Bounding Box */}
              <div className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-cyan-400/80 flex flex-col items-center justify-center p-3 z-10 bg-cyan-950/20 backdrop-blur-[1px]">
                {!stream && (
                  <>
                    <Scan className="w-10 h-10 text-cyan-400 animate-pulse mb-1" />
                    <span className="text-[9px] font-mono font-bold text-cyan-300 mt-2 text-center">
                      INITIALIZING WEBCAM...
                    </span>
                  </>
                )}
                {isScanning && (
                  <span className="absolute bottom-2 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-900/80 px-2 py-1 rounded animate-pulse">
                    ENROLLING FACE...
                  </span>
                )}
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
              </div>
            </div>

            <button
              onClick={handleScanAndRegister}
              disabled={isScanning || isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              <span>{(isScanning || isSubmitting) ? 'Enrolling Profile...' : 'Scan & Complete Registration'}</span>
            </button>
            
            <button
              onClick={() => setStep(1)}
              disabled={isScanning || isSubmitting}
              className="mt-3 text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
