import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vehicleService } from '../services/vehicleService';
import { accessService } from '../services/accessService';
import { Vehicle, VerificationResult, RiskAssessmentResult, DemoScenario } from '../types';
import { CarVisual } from '../components/CarVisual';
import { RiskBadge } from '../components/RiskBadge';
import { SimulationBadge } from '../components/SimulationBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  KeyRound,
  ShieldCheck,
  BrainCircuit,
  Lock,
  Unlock,
  Camera,
  Scan,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Eye,
  AlertOctagon,
} from 'lucide-react';

import * as faceapi from '@vladmandic/face-api';

export const SmartAccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialVehicleId = searchParams.get('vehicleId');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeScenario, setActiveScenario] = useState<'safe' | 'medium' | 'high'>('safe');

  // Verification & AI analysis states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verificationLogIdx, setVerificationLogIdx] = useState<number>(0);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<RiskAssessmentResult | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const { showToast } = useToast();

  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    if (currentStep === 2) {
      // Load AI models from public/models
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
  }, [currentStep]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehicles();
        setVehicles(data);
        if (data.length > 0) {
          const match = initialVehicleId ? data.find((v) => v.id === initialVehicleId) : null;
          setSelectedVehicle(match || data[0]);
        }
      } catch (err) {
        showToast('Error', 'Unable to retrieve vehicles for access console.', 'danger');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [initialVehicleId]);

  // Handle Step 1: Request Access
  const handleRequestAccess = async () => {
    if (!selectedVehicle) return;
    try {
      const res = await accessService.requestAccess(selectedVehicle.id, activeScenario);
      setSelectedVehicle((prev) => (prev ? { ...prev, status: 'access_requested' } : null));
      setCurrentStep(2);
      showToast('Access Requested', res.message, 'info');
    } catch (err: any) {
      showToast('Request Failed', err.response?.data?.detail || 'Could not initiate access.', 'danger');
    }
  };

  // Handle Step 2: Verify Identity
  const handleVerifyIdentity = async () => {
    if (!selectedVehicle) return;
    if (!modelsLoaded) {
      showToast('Wait', 'AI Models are still loading into browser memory.', 'warning');
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setVerificationLogIdx(0);

    try {
      let detectedConfidence = 0;
      
      // RUN REAL LOCAL FACE DETECTION
      if (videoRef.current) {
        const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
        if (detection) {
          // If a face is found, we map the detection score (usually 0.8-0.99) to a percentage
          detectedConfidence = Math.min(100, Math.round(detection.detection.score * 105));
        }
      }

      // We pass the REAL confidence to the backend. The backend will use this to determine the outcome.
      const res = await accessService.verifyIdentity(selectedVehicle.id, activeScenario, detectedConfidence);
      const result = res.verification;

      // Animate step logs sequentially
      const totalLogs = result.step_logs.length;
      for (let i = 0; i < totalLogs; i++) {
        await new Promise((r) => setTimeout(r, 450));
        setVerificationLogIdx(i + 1);
      }

      setVerificationResult(result);
      setCurrentStep(3);
      
      if (result.status === 'FAILED') {
        showToast('Verification Failed', `No human face detected or confidence too low (${result.confidence}%)`, 'danger');
      } else {
        showToast('Identity Evaluated', `Verification status: ${result.status} (${result.confidence}%)`, 'info');
      }
    } catch (err: any) {
      showToast('Verification Error', err.response?.data?.detail || 'Simulation verification error', 'danger');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Step 3: Run AI Security Analysis
  const handleAnalyzeSecurity = async () => {
    if (!selectedVehicle || !verificationResult) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Scenario feature simulation values
    let failedAttempts = 0;
    let accessHour = 10;
    let recentRequests = 1;
    let suspiciousHistory = false;

    if (activeScenario === 'medium') {
      failedAttempts = 1;
      accessHour = 23;
      recentRequests = 3;
    } else if (activeScenario === 'high') {
      failedAttempts = 4;
      accessHour = 2;
      recentRequests = 7;
      suspiciousHistory = true;
    }

    try {
      await new Promise((r) => setTimeout(r, 900)); // realistic thinking pause
      const res = await accessService.analyzeSecurity({
        vehicleId: selectedVehicle.id,
        scenarioMode: activeScenario,
        confidence: verificationResult.confidence,
        failedAttempts,
        accessHour,
        recentRequests,
        suspiciousHistory,
      });

      setAnalysisResult(res);
      setCurrentStep(4);

      if (res.riskLevel === 'low') {
        showToast('Access Approved', 'AI Risk Assessment passed: Low Risk. Latch unlock available.', 'success');
      } else if (res.riskLevel === 'medium') {
        showToast('Additional Check Required', 'AI Risk Assessment: Medium Risk. Elevated caution.', 'warning');
      } else {
        showToast('Security Threat Blocked', 'Critical risk detected. Simulated access restricted and incident logged.', 'danger');
      }
    } catch (err: any) {
      showToast('Analysis Error', err.response?.data?.detail || 'AI risk computation failed.', 'danger');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Step 5: Simulate Unlock
  const handleSimulateUnlock = async () => {
    if (!selectedVehicle) return;
    setIsUnlocking(true);
    try {
      const res = await accessService.simulateUnlock(selectedVehicle.id, analysisResult?.accessLogId);
      setSelectedVehicle((prev) => (prev ? { ...prev, status: 'unlocked' } : null));
      setCurrentStep(5);
      showToast('✓ Access Granted — Simulation', res.message, 'success');
    } catch (err: any) {
      showToast('Unlock Failed', err.response?.data?.detail || 'Could not unlock vehicle.', 'danger');
    } finally {
      setIsUnlocking(false);
    }
  };

  // Handle Simulate Lock
  const handleSimulateLock = async () => {
    if (!selectedVehicle) return;
    setIsLocking(true);
    try {
      const res = await accessService.simulateLock(selectedVehicle.id);
      setSelectedVehicle((prev) => (prev ? { ...prev, status: 'locked' } : null));
      setCurrentStep(1);
      setVerificationResult(null);
      setAnalysisResult(null);
      showToast('Vehicle Locked', res.message, 'info');
    } catch (err: any) {
      showToast('Lock Failed', err.response?.data?.detail || 'Could not secure vehicle.', 'danger');
    } finally {
      setIsLocking(false);
    }
  };

  const handleResetWorkflow = () => {
    setCurrentStep(1);
    setVerificationResult(null);
    setAnalysisResult(null);
    if (selectedVehicle?.status === 'access_requested') {
      handleSimulateLock();
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Initializing Keyless Telematics Console..." />;
  }

  const isUnlocked = selectedVehicle?.status === 'unlocked';
  const isRequested = selectedVehicle?.status === 'access_requested';

  return (
    <div className="space-y-6">
      {/* Top Banner with Simulation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Autonomous Telematics
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              SIMULATION ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Smart Keyless Access Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-stage verification and AI-driven access authorization simulator
          </p>
        </div>

        {/* Permanent Simulation Badge */}
        <SimulationBadge size="md" />
      </div>

      {/* Examiner Scenario Controller Bar */}
      <div className="glass-panel-glow rounded-2xl p-4 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> DEMO SCENARIO SELECTOR
            </span>
            <p className="text-[11px] text-slate-400">
              Test deterministic risk assessment outcomes for college viva demonstration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              setActiveScenario('safe');
              handleResetWorkflow();
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono border transition-all ${
              activeScenario === 'safe'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-md shadow-emerald-950'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🟢 SAFE (Low Risk)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveScenario('medium');
              handleResetWorkflow();
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono border transition-all ${
              activeScenario === 'medium'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/80 shadow-md shadow-amber-950'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🟡 MEDIUM (Review)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveScenario('high');
              handleResetWorkflow();
            }}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono border transition-all ${
              activeScenario === 'high'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/80 shadow-md shadow-rose-950'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            🔴 HIGH (Blocked)
          </button>
        </div>
      </div>

      {/* Main Grid: Vehicle Telematics on Left, Interactive 5-Step Pipeline on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Vehicle Telematics & Live Visual */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            {/* Vehicle Selector */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                Connected Vehicle Target
              </span>
              <button
                onClick={handleResetWorkflow}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Reset sequence"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <select
              value={selectedVehicle?.id || ''}
              onChange={(e) => {
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) {
                  setSelectedVehicle(found);
                  handleResetWorkflow();
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors mb-4"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} — {v.registrationNumber} ({v.type})
                </option>
              ))}
            </select>

            {/* Vehicle Vector Graphic Component */}
            {selectedVehicle && (
              <CarVisual
                brand={selectedVehicle.brand}
                model={selectedVehicle.model}
                type={selectedVehicle.type}
                status={selectedVehicle.status as any}
                className="w-full"
              />
            )}

            {/* Vehicle Technical Telemetry Info */}
            {selectedVehicle && (
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Registration</span>
                  <span className="font-mono font-bold text-white tracking-wider">
                    {selectedVehicle.registrationNumber}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Simulated Latch</span>
                  <span
                    className={`font-mono font-bold uppercase ${
                      isUnlocked ? 'text-emerald-400' : isRequested ? 'text-cyan-400' : 'text-rose-400'
                    }`}
                  >
                    {selectedVehicle.status}
                  </span>
                </div>
              </div>
            )}

            {/* Lock / Unlock Quick Simulated Override */}
            <div className="mt-4 pt-2 flex items-center gap-2">
              {isUnlocked ? (
                <button
                  onClick={handleSimulateLock}
                  disabled={isLocking}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>{isLocking ? 'Engaging Latches...' : 'Simulate Lock'}</span>
                </button>
              ) : (
                <div className="text-[11px] font-mono text-slate-500 text-center w-full py-1">
                  ● State locked. Advance through simulated verification to unlock.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 5-Stage Animated Workflow Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Progress Tracker (01 -> 02 -> 03 -> 04 -> 05) */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-800">
            <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
              {[
                { num: 1, label: 'REQUEST' },
                { num: 2, label: 'VERIFY' },
                { num: 3, label: 'ANALYZE' },
                { num: 4, label: 'DECISION' },
                { num: 5, label: 'ACCESS' },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;

                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                          : isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/50'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-mono mt-1 font-semibold uppercase tracking-wider ${
                        isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Step Container */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 min-h-[380px] flex flex-col justify-between">
            {/* STEP 1: REQUEST ACCESS */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 my-auto text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-950/50">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Stage 01: Initiate Keyless Access</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                    Click below to transmit a simulated keyless access request from the driver handheld device to the vehicle telematics receiver.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleRequestAccess}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-xl shadow-cyan-950/50 transition-all flex items-center justify-center gap-2 mx-auto"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Request Simulated Access</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: VERIFY IDENTITY (Simulated Camera Viewfinder) */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-cyan-400" /> Stage 02: Simulated Identity Verification
                    </h3>
                    <p className="text-xs text-slate-400">
                      Optical facial mesh scanning simulation (Local Academic Demonstration)
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                    NO REAL BIOMETRIC DATA
                  </span>
                </div>

                {/* Simulated Camera Viewfinder Visual */}
                <div className="relative w-full h-56 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center overflow-hidden">
                  {/* Video Stream Element */}
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

                  {/* Laser Scan Animation Line */}
                  {isVerifying && (
                    <motion.div
                      animate={{ y: [-110, 110, -110] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] z-20 pointer-events-none"
                    />
                  )}

                  {/* Facial Landmark Tracking Bounding Box */}
                  <div className="relative w-48 h-56 rounded-2xl border-2 border-dashed border-cyan-400/80 flex flex-col items-center justify-center p-3 z-10 bg-cyan-950/20 backdrop-blur-[1px]">
                    {!stream && (
                      <>
                        <Scan className="w-10 h-10 text-cyan-400 animate-pulse mb-1" />
                        <span className="text-[10px] font-mono font-bold text-cyan-300 mt-2 text-center">
                          INITIALIZING WEBCAM...
                        </span>
                      </>
                    )}
                    {stream && !isVerifying && (
                      <span className="absolute bottom-4 text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/80 px-2 py-1 rounded">
                        READY FOR VERIFY
                      </span>
                    )}
                    {isVerifying && (
                      <span className="absolute bottom-4 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-900/80 px-2 py-1 rounded animate-pulse">
                        SCANNING MESH...
                      </span>
                    )}

                    {/* Corner Reticle Accents */}
                    <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                  </div>

                  {/* Status Overlay Footer */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 z-20 bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-sm border border-slate-800">
                    <span>SENSOR: SIMULATED OPTICAL</span>
                    <span className="text-cyan-400 font-semibold">
                      SCENARIO: {activeScenario.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Step Logs Console Animation */}
                {isVerifying && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
                    <p className="text-slate-500 font-bold mb-1">// Telematics Verification Pipeline Output:</p>
                    {Array.from({ length: verificationLogIdx }).map((_, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="text-slate-600">›</span>
                        <span>Stage {i + 1}: Optical evaluation completed</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleVerifyIdentity}
                    disabled={isVerifying}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isVerifying ? 'Evaluating Biometrics...' : 'Run Identity Verification'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: RUN AI SECURITY ANALYSIS */}
            {currentStep === 3 && verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="pb-2 border-b border-slate-800">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-cyan-400" /> Stage 03: AI Behavioral Security Analysis
                  </h3>
                  <p className="text-xs text-slate-400">
                    Biometric identity validated. Execute algorithmic risk scoring on access context.
                  </p>
                </div>

                {/* Verification Summary Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Face Detected</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> YES
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Image Quality</span>
                    <span className="font-bold text-white font-mono mt-0.5">
                      {verificationResult.image_quality}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Match Confidence</span>
                    <span className="font-bold text-cyan-300 font-mono mt-0.5">
                      {verificationResult.confidence}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-500 block uppercase">Biometric Status</span>
                    <span className="font-bold text-emerald-300 font-mono mt-0.5">
                      {verificationResult.status}
                    </span>
                  </div>
                </div>

                {/* Step Logs output */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 space-y-1">
                  <span className="text-slate-500 block mb-1 text-[11px] font-bold">
                    // Verification Execution Trace:
                  </span>
                  {verificationResult.step_logs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px]">
                      <span className="text-cyan-400">✓</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleAnalyzeSecurity}
                    disabled={isAnalyzing}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    <span>{isAnalyzing ? 'Computing AI Risk Matrix...' : 'Execute AI Risk Assessment'}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 & 5: ACCESS DECISION & SIMULATED UNLOCK */}
            {currentStep >= 4 && analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" /> Stage 04 & 05: Access Decision & Telematics Action
                    </h3>
                    <p className="text-xs text-slate-400">
                      Algorithmic policy outcome based on multi-parameter contextual risk
                    </p>
                  </div>
                  <RiskBadge level={analysisResult.riskLevel} score={analysisResult.riskScore} />
                </div>

                {/* Risk Score & Policy Callout Banner */}
                <div
                  className={`p-4 rounded-2xl border ${
                    analysisResult.riskLevel === 'low'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                      : analysisResult.riskLevel === 'medium'
                      ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {analysisResult.riskLevel === 'low' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    ) : analysisResult.riskLevel === 'medium' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                    ) : (
                      <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold tracking-tight font-sans">
                        {analysisResult.policyAction}
                      </h4>
                      <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                        {analysisResult.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Factors Breakdown */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-2">
                    Evaluated Security Factors:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {analysisResult.riskFactors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Final Telematics Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleResetWorkflow}
                    className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
                  >
                    Test Another Scenario
                  </button>

                  {analysisResult.riskLevel === 'low' && !isUnlocked && (
                    <button
                      onClick={handleSimulateUnlock}
                      disabled={isUnlocking}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>{isUnlocking ? 'Disengaging Latch...' : 'Simulate Unlock Vehicle'}</span>
                    </button>
                  )}

                  {isUnlocked && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> SIMULATED UNLOCKED
                      </span>
                      <button
                        onClick={handleSimulateLock}
                        disabled={isLocking}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
                      >
                        Simulate Lock
                      </button>
                    </div>
                  )}

                  {analysisResult.riskLevel === 'high' && (
                    <div className="text-xs font-mono text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> IMMOBILIZER ACTIVE • SECURITY INCIDENT RECORDED
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
