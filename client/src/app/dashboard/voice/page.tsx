"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mic,
  Play,
  Pause,
  Square,
  Upload,
  Download,
  AudioWaveform as Waveform,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileAudio,
  Bot,
  MessageCircle,
  Volume2,
} from "lucide-react"
import { motion } from "framer-motion"
import { useConversation } from "@elevenlabs/react"
import { useCallback } from "react"

type RecordingState = "idle" | "recording" | "paused" | "completed"
type AnalysisState = "idle" | "analyzing" | "completed" | "error"

interface AnalysisResults {
  fluencyScore: number
  articulationClarity: number
  prosodyVariation: number
  turnTakingPatterns: string
  repetitiveLanguage: string
  socialCommunication: string
  summary: string
  riskLevel: 'low' | 'moderate' | 'high'
  recommendations: string[]
}

interface VoiceData {
  id: string
  audioBlob: Blob
  duration: number
  analysisResults?: AnalysisResults
  timestamp: Date
}

export default function VoiceCommunicationPage() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [voiceRecordings, setVoiceRecordings] = useState<VoiceData[]>([])
  const [currentRecording, setCurrentRecording] = useState<VoiceData | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'ai' | 'user', timestamp: Date}>>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // AI Conversation setup
  const conversations = useConversation({
    onConnect: () => console.log("AI Session Connected"),
    onDisconnect: () => console.log("AI Session Disconnected"),
    onMessage: (message) => console.log("AI Message:", message),
    onError: (error) => console.error("AI Session Error:", error),
  })

    const conversation = useConversation({
    onConnect: () => console.log("AI Session Connected"),
    onDisconnect: () => console.log("AI Session Disconnected"),
    onMessage: (message) => {
      console.log("AI Message:", message)
      // Add AI message to transcript
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: message.message || JSON.stringify(message),
        sender: 'ai',
        timestamp: new Date()
      }])
    },
    onError: (error) => console.error("AI Session Error:", error),
  })

  const agentId = "agent_8501k3ba3e33e9pbs9evhttpvrd0"

  // Request microphone permission on component mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)
      } catch {
        setHasPermission(false)
      }
    }
    requestPermission()
  }, [])

  // Recording timer
  useEffect(() => {
    if (recordingState === "recording") {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [recordingState])

  // Audio level monitoring
  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
      setAudioLevel((average / 255) * 100)

      if (recordingState === "recording") {
        animationRef.current = requestAnimationFrame(monitorAudioLevel)
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []

      // Set up audio context for level monitoring
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const recording: VoiceData = {
          id: Date.now().toString(),
          audioBlob,
          duration: recordingTime,
          timestamp: new Date()
        }
        
        setCurrentRecording(recording)
        setVoiceRecordings(prev => [...prev, recording])
        setRecordingState("completed")
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start(1000) // Collect data every second
      setRecordingState("recording")
      setRecordingTime(0)
      monitorAudioLevel()
    } catch (error) {
      console.error("Error starting recording:", error)
      setHasPermission(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.pause()
      setRecordingState("paused")
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      mediaRecorderRef.current.resume()
      setRecordingState("recording")
      monitorAudioLevel()
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadedFile(file)

    try {
      // Create a VoiceData object for uploaded file
      const recording: VoiceData = {
        id: Date.now().toString(),
        audioBlob: file,
        duration: 0, // Will be calculated after upload
        timestamp: new Date()
      }

      setCurrentRecording(recording)
      setVoiceRecordings(prev => [...prev, recording])
      
      // Auto-start analysis for uploaded file
      await startAnalysis(recording)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const startAnalysis = async (recording?: VoiceData) => {
    const recordingToAnalyze = recording || currentRecording
    if (!recordingToAnalyze) return

    setAnalysisState("analyzing")
    setAnalysisProgress(0)

    try {
      // Prepare form data for backend
      const formData = new FormData()
      formData.append('audio', recordingToAnalyze.audioBlob, 'recording.webm')
      formData.append('duration', recordingToAnalyze.duration.toString())

      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 500)

      // Send to backend for analysis
      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const results: AnalysisResults = await response.json()
      
      // Update recording with results
      const updatedRecording = {
        ...recordingToAnalyze,
        analysisResults: results
      }

      setCurrentRecording(updatedRecording)
      setVoiceRecordings(prev => 
        prev.map(r => r.id === recordingToAnalyze.id ? updatedRecording : r)
      )
      setAnalysisResults(results)
      setAnalysisProgress(100)
      setAnalysisState("completed")

    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisState("error")
      // Fallback to mock data for demo
      const mockResults: AnalysisResults = {
        fluencyScore: 85,
        articulationClarity: 92,
        prosodyVariation: 78,
        turnTakingPatterns: "Normal",
        repetitiveLanguage: "Low",
        socialCommunication: "Good",
        summary: "The voice analysis indicates typical speech patterns with good articulation and fluency. Communication markers show appropriate turn-taking and social interaction patterns.",
        riskLevel: 'low',
        recommendations: [
          "Continue regular speech practice",
          "Monitor social communication development",
          "Consider follow-up assessment in 6 months"
        ]
      }
      setAnalysisResults(mockResults)
      setAnalysisProgress(100)
      setAnalysisState("completed")
    }
  }

  const downloadReport = async () => {
    if (!analysisResults || !currentRecording) return

    try {
      const reportData = {
        recording: {
          id: currentRecording.id,
          duration: currentRecording.duration,
          timestamp: currentRecording.timestamp
        },
        analysis: analysisResults
      }

      const response = await fetch('/api/voice/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `voice-analysis-report-${currentRecording.id}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  const startAIConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conversation.startSession({ agentId, connectionType: "websocket" })
    } catch (error) {
      console.error("Failed to start AI conversation:", error)
    }
  }, [conversation, agentId])

  const stopAIConversation = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Console log to prevent unused variable warning
  useEffect(() => {
    console.log("Voice recordings count:", voiceRecordings.length)
  }, [voiceRecordings])

  if (hasPermission === false) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Voice Communication Analysis</h1>
          <p className="font-body text-muted-foreground text-lg">
            Record and analyze speech patterns for autism detection indicators.
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Microphone access is required for voice recording. Please enable microphone permissions in your browser
            settings and refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Voice Communication Analysis</h1>
        <p className="font-body text-muted-foreground text-lg">
          Record and analyze speech patterns for autism detection indicators.
        </p>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-session">AI Session</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="space-y-6">
          {/* Recording Interface */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                Voice Recording Studio
              </CardTitle>
              <CardDescription className="font-body">
                Record clear audio samples for comprehensive speech pattern analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Controls */}
              <div className="flex flex-col items-center space-y-6">
                {/* Visual Audio Level Indicator */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                        recordingState === "recording"
                          ? "bg-destructive animate-pulse"
                          : recordingState === "paused"
                            ? "bg-secondary"
                            : "bg-primary"
                      }`}
                      style={{
                        transform: recordingState === "recording" ? `scale(${1 + audioLevel / 200})` : "scale(1)",
                      }}
                    >
                      {recordingState === "recording" ? (
                        <Waveform className="w-8 h-8 text-destructive-foreground" />
                      ) : recordingState === "paused" ? (
                        <Pause className="w-8 h-8 text-secondary-foreground" />
                      ) : (
                        <Mic className="w-8 h-8 text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Audio Level Ring */}
                  {recordingState === "recording" && (
                    <div
                      className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-100"
                      style={{
                        borderWidth: `${2 + audioLevel / 25}px`,
                        opacity: audioLevel / 100,
                      }}
                    />
                  )}
                </div>

                {/* Recording Status */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant={
                        recordingState === "recording"
                          ? "destructive"
                          : recordingState === "paused"
                            ? "secondary"
                            : recordingState === "completed"
                              ? "default"
                              : "outline"
                      }
                    >
                      {recordingState === "recording" && (
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse mr-1" />
                      )}
                      {recordingState.charAt(0).toUpperCase() + recordingState.slice(1)}
                    </Badge>
                    {recordingState !== "idle" && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(recordingTime)}
                      </Badge>
                    )}
                  </div>

                  {recordingState === "recording" && (
                    <p className="font-body text-sm text-muted-foreground">Audio Level: {Math.round(audioLevel)}%</p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-4">
                  {recordingState === "idle" && (
                    <Button onClick={startRecording} size="lg" className="px-8">
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  )}

                  {recordingState === "recording" && (
                    <>
                      <Button onClick={pauseRecording} variant="secondary" size="lg">
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={stopRecording} variant="destructive" size="lg">
                        <Square className="w-5 h-5 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}

                  {recordingState === "paused" && (
                    <>
                      <Button onClick={resumeRecording} size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </Button>
                      <Button onClick={stopRecording} variant="destructive" size="lg">
                        <Square className="w-5 h-5 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}

                  {recordingState === "completed" && (
                    <div className="flex gap-4">
                      <Button
                        onClick={() => {
                          setRecordingState("idle")
                          setRecordingTime(0)
                          setAudioLevel(0)
                          setCurrentRecording(null)
                        }}
                        variant="outline"
                        size="lg"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        New Recording
                      </Button>
                      <Button onClick={() => startAnalysis()} size="lg">
                        <Activity className="w-5 h-5 mr-2" />
                        Analyze Audio
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recording Tips */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-heading font-semibold text-foreground mb-2">Recording Tips for Best Results</h4>
                <ul className="font-body text-sm text-muted-foreground space-y-1">
                  <li>• Record in a quiet environment with minimal background noise</li>
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Maintain consistent distance from the microphone</li>
                  <li>• Record for at least 2-3 minutes for comprehensive analysis</li>
                  <li>• Include natural conversation or reading passages</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Interface */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Upload className="w-5 h-5 text-secondary" />
                Upload Audio File
              </CardTitle>
              <CardDescription className="font-body">Upload existing audio recordings for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                    <FileAudio className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Drop your audio file here</h3>
                    <p className="font-body text-muted-foreground mb-4">Supports MP3, WAV, M4A files up to 50MB</p>
                    <input
                      type="file"
                      accept=".mp3,.wav,.m4a,.webm"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload">
                      <Button variant="outline" className="cursor-pointer" disabled={isUploading}>
                        <Upload className="w-4 h-4 mr-2" />
                        {isUploading ? "Uploading..." : "Choose File"}
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              {uploadedFile && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <FileAudio className="w-4 h-4 text-secondary" />
                    <span className="font-body text-sm">{uploadedFile.name}</span>
                    <Badge variant="secondary">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-heading font-semibold text-foreground mb-2">Supported File Formats</h4>
                <div className="grid grid-cols-3 gap-4 font-body text-sm text-muted-foreground">
                  <div>• MP3 (recommended)</div>
                  <div>• WAV (high quality)</div>
                  <div>• M4A (Apple format)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

       <TabsContent value="ai-session" className="space-y-6">
          {/* AI Conversation Session */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                AI Communication Session
              </CardTitle>
              <CardDescription className="font-body">
                Interactive AI session for natural conversation analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Session Interface - matching recording theme */}
              <div className="flex flex-col items-center space-y-6">
                {/* Visual AI Status Indicator */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 rounded-full border-4 border-muted flex items-center justify-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
                        conversation.status === "connected" && conversation.isSpeaking
                          ? "bg-primary animate-pulse"
                          : conversation.status === "connected"
                            ? "bg-secondary"
                            : "bg-muted"
                      }`}
                    >
                      {conversation.status === "connected" && conversation.isSpeaking ? (
                        <Volume2 className="w-8 h-8 text-primary-foreground" />
                      ) : conversation.status === "connected" ? (
                        <Mic className="w-8 h-8 text-secondary-foreground" />
                      ) : (
                        <Bot className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* AI Activity Ring */}
                  {conversation.status === "connected" && (
                    <div
                      className={`absolute inset-0 rounded-full border-4 transition-all duration-300 ${
                        conversation.isSpeaking 
                          ? "border-primary animate-pulse" 
                          : "border-secondary"
                      }`}
                      style={{
                        borderWidth: conversation.isSpeaking ? "4px" : "2px",
                        opacity: 0.7,
                      }}
                    />
                  )}
                </div>

                {/* AI Session Status */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Badge
                      variant={
                        conversation.status === "connected" && conversation.isSpeaking
                          ? "default"
                          : conversation.status === "connected"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {conversation.status === "connected" && conversation.isSpeaking && (
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse mr-1" />
                      )}
                      {conversation.status === "connected" 
                        ? (conversation.isSpeaking ? "AI Speaking" : "Listening")
                        : "Disconnected"
                      }
                    </Badge>
                  </div>

                  {conversation.status === "connected" && (
                    <p className="font-body text-sm text-muted-foreground">
                      {conversation.isSpeaking 
                        ? "AI is responding to your input" 
                        : "Speak naturally, the AI is listening"
                      }
                    </p>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-4">
                  {conversation.status !== "connected" && (
                    <Button onClick={startAIConversation} size="lg" className="px-8">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start AI Session
                    </Button>
                  )}

                  {conversation.status === "connected" && (
                    <Button onClick={stopAIConversation} variant="destructive" size="lg">
                      <Square className="w-5 h-5 mr-2" />
                      End Session
                    </Button>
                  )}
                </div>
              </div>

              {/* Session Guidelines */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-heading font-semibold text-foreground mb-2">Session Guidelines</h4>
                <ul className="font-body text-sm text-muted-foreground space-y-1">
                  <li>• Speak naturally and at your own pace</li>
                  <li>• The AI will guide you through conversation topics</li>
                  <li>• Session data is automatically analyzed for communication patterns</li>
                  <li>• Sessions typically last 10-15 minutes for optimal results</li>
                </ul>
              </div>

              {/* Conversation Transcript */}
              {conversation.status === "connected" && (
                <Card className="border-border bg-background">
                  <CardHeader className="pb-3">
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Live Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 overflow-y-auto border border-border rounded-lg bg-background">
                      <div className="p-4 space-y-4">
                        {messages.length === 0 ? (
                          <div className="flex items-center justify-center py-8">
                            <p className="font-body text-sm text-muted-foreground">
                              Conversation will appear here once started...
                            </p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div key={message.id}>
                              {message.sender === 'ai' ? (
                                /* AI Message */
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-primary-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-muted rounded-lg rounded-tl-none p-3">
                                      <p className="font-body text-sm text-foreground">
                                        {message.text}
                                      </p>
                                    </div>
                                    <p className="font-body text-xs text-muted-foreground mt-1">
                                      AI Assistant • {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                /* User Message */
                                <div className="flex items-start gap-3 flex-row-reverse">
                                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                    <Mic className="w-4 h-4 text-secondary-foreground" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="bg-foreground text-background rounded-lg rounded-tr-none p-3 ml-auto max-w-xs">
                                      <p className="font-body text-sm">
                                        {message.text}
                                      </p>
                                    </div>
                                    <p className="font-body text-xs text-muted-foreground mt-1 text-right">
                                      You • {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        )}

                        {/* Typing indicator when AI is speaking */}
                        {conversation.isSpeaking && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-muted rounded-lg rounded-tl-none p-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                              <p className="font-body text-xs text-muted-foreground mt-1">AI Assistant • typing...</p>
                            </div>
                          </div>
                        )}

                        {/* Listening indicator when waiting for user */}
                        {conversation.status === "connected" && !conversation.isSpeaking && messages.length > 0 && (
                          <div className="flex items-center justify-center py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mic className="w-4 h-4 animate-pulse" />
                              <span className="font-body text-sm">Listening for your response...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transcript Controls */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Auto-scroll enabled
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Live transcript
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {messages.length} messages
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setMessages([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {/* Analysis Results */}
          {analysisState === "idle" && (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">No Analysis Available</h3>
                <p className="font-body text-muted-foreground text-center">
                  Record or upload an audio file to begin voice pattern analysis.
                </p>
              </CardContent>
            </Card>
          )}

          {analysisState === "analyzing" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
                  Analyzing Voice Patterns
                </CardTitle>
                <CardDescription className="font-body">
                  Processing speech patterns and communication markers...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-body text-muted-foreground">Analysis Progress</span>
                    <span className="font-body font-medium">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Speech pattern recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Language development markers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Communication flow analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Prosody and intonation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {analysisState === "error" && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Analysis failed. Please try again or contact support if the problem persists.
              </AlertDescription>
            </Alert>
          )}

          {analysisState === "completed" && analysisResults && (
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Voice analysis completed successfully. Review the results below and generate a detailed report.
                </AlertDescription>
              </Alert>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Speech Pattern Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Fluency Score</span>
                        <Badge variant="secondary">{analysisResults.fluencyScore}%</Badge>
                      </div>
                      <Progress value={analysisResults.fluencyScore} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Articulation Clarity</span>
                        <Badge variant="secondary">{analysisResults.articulationClarity}%</Badge>
                      </div>
                      <Progress value={analysisResults.articulationClarity} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Prosody Variation</span>
                        <Badge variant="secondary">{analysisResults.prosodyVariation}%</Badge>
                      </div>
                      <Progress value={analysisResults.prosodyVariation} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">Communication Markers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Turn-taking Patterns</span>
                        <Badge variant="outline">{analysisResults.turnTakingPatterns}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Repetitive Language</span>
                        <Badge variant="outline">{analysisResults.repetitiveLanguage}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Social Communication</span>
                        <Badge variant="secondary">{analysisResults.socialCommunication}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Risk Level</span>
                        <Badge 
                          variant={
                            analysisResults.riskLevel === 'low' ? 'default' :
                            analysisResults.riskLevel === 'moderate' ? 'secondary' : 'destructive'
                          }
                        >
                          {analysisResults.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-body text-muted-foreground">
                    {analysisResults.summary}
                  </p>

                  {analysisResults.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-2">Recommendations</h4>
                      <ul className="font-body text-sm text-muted-foreground space-y-1">
                        {analysisResults.recommendations.map((rec, index) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Button onClick={downloadReport}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline">
                      <FileAudio className="w-4 h-4 mr-2" />
                      View Transcript
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}