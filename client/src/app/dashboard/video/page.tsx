"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  Upload,
  Download,
  Eye,
  Brain,
  Users,
  Smile,
  Clock,
  Activity,
  TrendingUp,
  CheckCircle,
  FileVideo,
  BarChart3,
  Target,
} from "lucide-react"

type UploadState = "idle" | "uploading" | "processing" | "completed" | "error"
type AnalysisState = "idle" | "analyzing" | "completed" | "error"

interface VideoAnalysisResults {
  facialExpressions: {
    joy: number
    surprise: number
    neutral: number
    concern: number
  }
  eyeContact: {
    frequency: number
    duration: number
    consistency: number
  }
  socialEngagement: {
    attentionToFaces: number
    responseToSocial: number
    jointAttention: number
  }
  behavioralPatterns: {
    repetitiveMovements: number
    stimming: number
    selfSoothing: number
  }
}

export default function VideoRecognitionPage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<VideoAnalysisResults | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setUploadState("idle")
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setVideoUrl(url)
      setUploadState("idle")
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const uploadVideo = () => {
    if (!selectedFile) return

    setUploadState("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          setUploadState("completed")
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 300)
  }

  const startAnalysis = () => {
    setAnalysisState("analyzing")
    setAnalysisProgress(0)

    // Simulate analysis progress
    const analysisInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(analysisInterval)
          setAnalysisState("completed")
          // Set mock analysis results
          setAnalysisResults({
            facialExpressions: {
              joy: 78,
              surprise: 45,
              neutral: 82,
              concern: 23,
            },
            eyeContact: {
              frequency: 85,
              duration: 72,
              consistency: 68,
            },
            socialEngagement: {
              attentionToFaces: 79,
              responseToSocial: 84,
              jointAttention: 71,
            },
            behavioralPatterns: {
              repetitiveMovements: 15,
              stimming: 8,
              selfSoothing: 12,
            },
          })
          return 100
        }
        return prev + Math.random() * 12
      })
    }, 400)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Video Recognition Analysis</h1>
        <p className="font-body text-muted-foreground text-lg">
          Upload videos to analyze behavioral patterns, facial expressions, and social interaction cues.
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Video Upload Interface */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Video className="w-5 h-5 text-secondary" />
                Video Upload & Processing
              </CardTitle>
              <CardDescription className="font-body">
                Upload video files for comprehensive behavioral pattern analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-secondary/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
                      <FileVideo className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">Drop your video file here</h3>
                      <p className="font-body text-muted-foreground mb-4">Supports MP4, MOV, AVI files up to 500MB</p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Video File
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Video Preview */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-heading font-semibold text-foreground mb-2">Selected Video</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-body text-muted-foreground">Filename:</span>
                            <span className="font-body font-medium">{selectedFile.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-body text-muted-foreground">Size:</span>
                            <span className="font-body font-medium">{formatFileSize(selectedFile.size)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-body text-muted-foreground">Type:</span>
                            <span className="font-body font-medium">{selectedFile.type}</span>
                          </div>
                        </div>
                      </div>
                      {videoUrl && (
                        <div className="w-48 h-32 bg-black rounded-lg overflow-hidden">
                          <video ref={videoRef} src={videoUrl} className="w-full h-full object-cover" controls />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploadState === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-body text-muted-foreground">Uploading...</span>
                        <span className="font-body font-medium">{Math.round(uploadProgress)}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {uploadState === "idle" && (
                      <>
                        <Button onClick={uploadVideo} size="lg">
                          <Upload className="w-5 h-5 mr-2" />
                          Upload & Process
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null)
                            setVideoUrl(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                        >
                          Choose Different File
                        </Button>
                      </>
                    )}

                    {uploadState === "completed" && (
                      <Button onClick={startAnalysis} size="lg">
                        <Brain className="w-5 h-5 mr-2" />
                        Start Analysis
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-heading font-semibold text-foreground mb-2">Video Guidelines for Best Results</h4>
                <ul className="font-body text-sm text-muted-foreground space-y-1">
                  <li>• Clear view of the subject&apos;s face and upper body</li>
                  <li>• Good lighting conditions (avoid backlighting)</li>
                  <li>• Minimal camera movement or shaking</li>
                  <li>• Duration of 2-10 minutes for comprehensive analysis</li>
                  <li>• Include natural interactions or activities</li>
                  <li>• Avoid heavily edited or filtered videos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Progress */}
          {analysisState === "analyzing" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  Analyzing Video Content
                </CardTitle>
                <CardDescription className="font-body">
                  Processing behavioral patterns, facial expressions, and social cues...
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
                    <span className="font-body text-muted-foreground">Facial expression detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Eye contact analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Social engagement patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-chart-4 rounded-full animate-pulse" />
                    <span className="font-body text-muted-foreground">Behavioral pattern recognition</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {analysisState === "idle" && (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Brain className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">No Analysis Available</h3>
                <p className="font-body text-muted-foreground text-center">
                  Upload a video file to begin behavioral pattern analysis.
                </p>
              </CardContent>
            </Card>
          )}

          {analysisState === "completed" && analysisResults && (
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Video analysis completed successfully. Review the detailed results below.
                </AlertDescription>
              </Alert>

              {/* Facial Expression Analysis */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Smile className="w-5 h-5 text-primary" />
                    Facial Expression Analysis
                  </CardTitle>
                  <CardDescription className="font-body">
                    Detection and frequency of various facial expressions throughout the video
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Joy/Happiness</span>
                        <Badge variant="secondary">{analysisResults.facialExpressions.joy}%</Badge>
                      </div>
                      <Progress value={analysisResults.facialExpressions.joy} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Surprise</span>
                        <Badge variant="secondary">{analysisResults.facialExpressions.surprise}%</Badge>
                      </div>
                      <Progress value={analysisResults.facialExpressions.surprise} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Neutral Expression</span>
                        <Badge variant="secondary">{analysisResults.facialExpressions.neutral}%</Badge>
                      </div>
                      <Progress value={analysisResults.facialExpressions.neutral} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Concern/Distress</span>
                        <Badge variant="secondary">{analysisResults.facialExpressions.concern}%</Badge>
                      </div>
                      <Progress value={analysisResults.facialExpressions.concern} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Eye Contact Analysis */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <Eye className="w-5 h-5 text-secondary" />
                    Eye Contact & Gaze Patterns
                  </CardTitle>
                  <CardDescription className="font-body">
                    Analysis of eye contact frequency, duration, and consistency
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Target className="w-8 h-8 text-secondary" />
                      </div>
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {analysisResults.eyeContact.frequency}%
                      </div>
                      <div className="text-sm font-body text-muted-foreground">Frequency</div>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {analysisResults.eyeContact.duration}%
                      </div>
                      <div className="text-sm font-body text-muted-foreground">Duration</div>
                    </div>

                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-2xl font-heading font-bold text-foreground">
                        {analysisResults.eyeContact.consistency}%
                      </div>
                      <div className="text-sm font-body text-muted-foreground">Consistency</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Engagement */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Social Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Attention to Faces</span>
                        <Badge variant="secondary">{analysisResults.socialEngagement.attentionToFaces}%</Badge>
                      </div>
                      <Progress value={analysisResults.socialEngagement.attentionToFaces} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Response to Social Cues</span>
                        <Badge variant="secondary">{analysisResults.socialEngagement.responseToSocial}%</Badge>
                      </div>
                      <Progress value={analysisResults.socialEngagement.responseToSocial} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Joint Attention</span>
                        <Badge variant="secondary">{analysisResults.socialEngagement.jointAttention}%</Badge>
                      </div>
                      <Progress value={analysisResults.socialEngagement.jointAttention} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Activity className="w-5 h-5 text-chart-4" />
                      Behavioral Patterns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Repetitive Movements</span>
                        <Badge variant="outline">{analysisResults.behavioralPatterns.repetitiveMovements}%</Badge>
                      </div>
                      <Progress value={analysisResults.behavioralPatterns.repetitiveMovements} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Stimming Behaviors</span>
                        <Badge variant="outline">{analysisResults.behavioralPatterns.stimming}%</Badge>
                      </div>
                      <Progress value={analysisResults.behavioralPatterns.stimming} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-body text-sm text-muted-foreground">Self-Soothing</span>
                        <Badge variant="outline">{analysisResults.behavioralPatterns.selfSoothing}%</Badge>
                      </div>
                      <Progress value={analysisResults.behavioralPatterns.selfSoothing} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analysis Summary */}
              <Card className="border-border bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">Analysis Summary & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-muted-foreground mb-4">
                    The video analysis shows typical social engagement patterns with good attention to faces and
                    appropriate responses to social cues. Facial expression variety is within normal ranges, and eye
                    contact patterns demonstrate consistent engagement. Behavioral patterns show minimal repetitive
                    movements, suggesting typical developmental patterns.
                  </p>
                  <div className="flex gap-4">
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download Full Report
                    </Button>
                    <Button variant="outline">
                      <FileVideo className="w-4 h-4 mr-2" />
                      View Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Analysis History */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Previous Video Analyses
              </CardTitle>
              <CardDescription className="font-body">
                Review your past video analysis results and track progress over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">Social Interaction Video</p>
                      <p className="font-body text-sm text-muted-foreground">Analyzed 2 hours ago • 5.2 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Completed</Badge>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">Play Session Recording</p>
                      <p className="font-body text-sm text-muted-foreground">Analyzed 1 day ago • 12.8 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Completed</Badge>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body font-medium text-foreground">Behavioral Assessment</p>
                      <p className="font-body text-sm text-muted-foreground">Analyzed 3 days ago • 8.7 MB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Completed</Badge>
                    <Button variant="outline" size="sm">
                      View Results
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
