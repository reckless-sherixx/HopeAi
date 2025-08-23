"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Share,
  Search,
  Calendar,
  Mic,
  Video,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  BarChart3,
  FileDown,
  Mail,
  Printer,
} from "lucide-react"

interface TranscriptData {
  id: string
  title: string
  type: "voice" | "video" | "combined"
  date: string
  duration: string
  status: "completed" | "processing" | "draft"
  summary: string
  keyFindings: string[]
  recommendations: string[]
  scores: {
    overall: number
    communication: number
    social: number
    behavioral: number
  }
}

const mockTranscripts: TranscriptData[] = [
  {
    id: "1",
    title: "Voice Communication Assessment - Session 1",
    type: "voice",
    date: "2024-01-15",
    duration: "8:45",
    status: "completed",
    summary:
      "Comprehensive voice analysis showing typical speech patterns with good articulation and fluency. Communication markers indicate appropriate turn-taking and social interaction patterns.",
    keyFindings: [
      "Fluency score of 85% indicates typical speech development",
      "Articulation clarity at 92% shows excellent pronunciation skills",
      "Prosody variation at 78% suggests appropriate emotional expression",
      "Turn-taking patterns are within normal developmental ranges",
    ],
    recommendations: [
      "Continue regular speech practice activities",
      "Monitor progress with follow-up assessments in 3 months",
      "Share results with speech-language pathologist if available",
    ],
    scores: {
      overall: 85,
      communication: 88,
      social: 82,
      behavioral: 85,
    },
  },
  {
    id: "2",
    title: "Video Behavioral Analysis - Play Session",
    type: "video",
    date: "2024-01-12",
    duration: "12:30",
    status: "completed",
    summary:
      "Video analysis reveals typical social engagement patterns with good attention to faces and appropriate responses to social cues. Facial expression variety is within normal ranges.",
    keyFindings: [
      "Eye contact frequency at 85% shows strong social engagement",
      "Facial expression analysis indicates 78% joy/happiness responses",
      "Social engagement scores are within typical developmental ranges",
      "Minimal repetitive behaviors observed (15% occurrence)",
    ],
    recommendations: [
      "Continue encouraging social play activities",
      "Document any changes in social interaction patterns",
      "Consider follow-up video analysis in 6 months",
    ],
    scores: {
      overall: 82,
      communication: 79,
      social: 86,
      behavioral: 81,
    },
  },
  {
    id: "3",
    title: "Combined Assessment Report - Comprehensive Evaluation",
    type: "combined",
    date: "2024-01-10",
    duration: "25:15",
    status: "completed",
    summary:
      "Comprehensive evaluation combining voice and video analysis provides a holistic view of communication and behavioral patterns. Results indicate typical developmental patterns across multiple domains.",
    keyFindings: [
      "Voice analysis shows 85% fluency with excellent articulation",
      "Video analysis reveals 82% social engagement scores",
      "Combined assessment indicates typical autism screening results",
      "No significant red flags identified in current evaluation",
    ],
    recommendations: [
      "Results suggest typical developmental patterns",
      "Share comprehensive report with healthcare provider",
      "Schedule routine follow-up assessments as recommended",
      "Continue supporting communication and social development",
    ],
    scores: {
      overall: 84,
      communication: 86,
      social: 83,
      behavioral: 82,
    },
  },
]

export default function TranscriptsPage() {
  const [selectedTranscript, setSelectedTranscript] = useState<TranscriptData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredTranscripts = mockTranscripts.filter((transcript) => {
    const matchesSearch =
      transcript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transcript.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || transcript.type === filterType
    const matchesStatus = filterStatus === "all" || transcript.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Mic className="w-4 h-4" />
      case "video":
        return <Video className="w-4 h-4" />
      case "combined":
        return <Brain className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "voice":
        return "text-primary"
      case "video":
        return "text-secondary"
      case "combined":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "processing":
        return <Badge variant="outline">Processing</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Assessment Reports & Transcripts</h1>
        <p className="font-body text-muted-foreground text-lg">
          View, download, and share detailed analysis reports from your voice and video assessments.
        </p>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Search and Filter Controls */}
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reports and transcripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="voice">Voice Analysis</SelectItem>
                    <SelectItem value="video">Video Analysis</SelectItem>
                    <SelectItem value="combined">Combined Reports</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredTranscripts.map((transcript) => (
              <Card key={transcript.id} className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`${getTypeColor(transcript.type)}`}>{getTypeIcon(transcript.type)}</div>
                        <h3 className="font-heading font-semibold text-foreground text-lg">{transcript.title}</h3>
                        {getStatusBadge(transcript.status)}
                      </div>

                      <p className="font-body text-muted-foreground mb-4 line-clamp-2">{transcript.summary}</p>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className="font-body">{formatDate(transcript.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-body">{transcript.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-body">Overall Score: {transcript.scores.overall}%</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => setSelectedTranscript(transcript)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="ml-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="text-2xl font-heading font-bold text-primary">{transcript.scores.overall}</div>
                      </div>
                      <div className="text-xs font-body text-muted-foreground text-center mt-1">Overall Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {selectedTranscript ? (
            <div className="space-y-6">
              {/* Report Header */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-heading text-2xl flex items-center gap-3">
                        <div className={`${getTypeColor(selectedTranscript.type)}`}>
                          {getTypeIcon(selectedTranscript.type)}
                        </div>
                        {selectedTranscript.title}
                      </CardTitle>
                      <CardDescription className="font-body text-lg mt-2">
                        Generated on {formatDate(selectedTranscript.date)} • Duration: {selectedTranscript.duration}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <FileDown className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Report
                      </Button>
                      <Button variant="outline">
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Assessment Scores */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Assessment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="text-2xl font-heading font-bold text-primary">
                          {selectedTranscript.scores.overall}
                        </div>
                      </div>
                      <div className="font-body font-medium text-foreground">Overall</div>
                      <div className="text-sm font-body text-muted-foreground">Assessment Score</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="text-2xl font-heading font-bold text-secondary">
                          {selectedTranscript.scores.communication}
                        </div>
                      </div>
                      <div className="font-body font-medium text-foreground">Communication</div>
                      <div className="text-sm font-body text-muted-foreground">Speech & Language</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="text-2xl font-heading font-bold text-accent">
                          {selectedTranscript.scores.social}
                        </div>
                      </div>
                      <div className="font-body font-medium text-foreground">Social</div>
                      <div className="text-sm font-body text-muted-foreground">Interaction Patterns</div>
                    </div>

                    <div className="text-center">
                      <div className="w-20 h-20 bg-chart-4/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <div className="text-2xl font-heading font-bold text-chart-4">
                          {selectedTranscript.scores.behavioral}
                        </div>
                      </div>
                      <div className="font-body font-medium text-foreground">Behavioral</div>
                      <div className="text-sm font-body text-muted-foreground">Pattern Analysis</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Executive Summary */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-foreground leading-relaxed">{selectedTranscript.summary}</p>
                </CardContent>
              </Card>

              {/* Key Findings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                    Key Findings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedTranscript.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span className="font-body text-foreground">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="font-heading flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedTranscript.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <span className="font-body text-foreground">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Professional Disclaimer */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Professional Disclaimer:</strong> This report is generated by AI analysis tools and is
                  intended for informational purposes only. It should not replace professional medical evaluation or
                  diagnosis. Please consult with qualified healthcare professionals for comprehensive autism assessment
                  and diagnosis.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Select a Report to View</h3>
                <p className="font-body text-muted-foreground text-center">
                  Choose a report from the list to view detailed analysis and recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-primary mb-2">24</div>
                <p className="font-body text-sm text-muted-foreground">Completed this month</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-secondary mb-2">83%</div>
                <p className="font-body text-sm text-muted-foreground">Across all assessments</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Reports Generated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-heading font-bold text-accent mb-2">18</div>
                <p className="font-body text-sm text-muted-foreground">Ready for download</p>
              </CardContent>
            </Card>
          </div>

          {/* Assessment Type Distribution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Assessment Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="font-body text-foreground">Voice Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <span className="font-body text-sm text-muted-foreground w-12">60%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-secondary" />
                    <span className="font-body text-foreground">Video Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full" style={{ width: "25%" }} />
                    </div>
                    <span className="font-body text-sm text-muted-foreground w-12">25%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" />
                    <span className="font-body text-foreground">Combined Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: "15%" }} />
                    </div>
                    <span className="font-body text-sm text-muted-foreground w-12">15%</span>
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
