import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, Video, FileText, Activity, Calendar, TrendingUp, Clock, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">Welcome to Your Dashboard</h1>
        <p className="font-body text-muted-foreground text-lg">
          Access your autism detection tools and view your assessment history.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <CardTitle className="font-heading text-xl">Voice Communication</CardTitle>
            <CardDescription className="font-body">
              Record and analyze speech patterns and communication markers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/voice">
                Start Voice Analysis <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              <Badge variant="secondary">In Development</Badge>
            </div>
            <CardTitle className="font-heading text-xl">Video Recognition</CardTitle>
            <CardDescription className="font-body">
              Upload videos for behavioral pattern and facial expression analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" disabled={true}>
              <Link href="/dashboard">
                Upload Video <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <Badge variant="outline">View Reports</Badge>
            </div>
            <CardTitle className="font-heading text-xl">Assessment Reports</CardTitle>
            <CardDescription className="font-body">
              View detailed transcripts and analysis reports from your assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard">
                View Transcripts <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Assessments */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Assessments
              </CardTitle>
              <CardDescription className="font-body">Your latest voice and video analysis sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Voice Analysis Session</p>
                    <p className="font-body text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Video className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Video Recognition Analysis</p>
                    <p className="font-body text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <Badge variant="secondary">Completed</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Assessment Report Generated</p>
                    <p className="font-body text-sm text-muted-foreground">3 days ago</p>
                  </div>
                </div>
                <Badge variant="outline">Available</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Assessment Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm text-muted-foreground">Voice Assessments</span>
                  <span className="font-body text-sm font-medium">8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm text-muted-foreground">Video Analyses</span>
                  <span className="font-body text-sm font-medium">5/8</span>
                </div>
                <Progress value={62.5} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body text-sm text-muted-foreground">Reports Generated</span>
                  <span className="font-body text-sm font-medium">12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">Total Sessions</span>
                </div>
                <span className="font-body font-semibold text-foreground">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">Active Profiles</span>
                </div>
                <span className="font-body font-semibold text-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">Reports Available</span>
                </div>
                <span className="font-body font-semibold text-foreground">12</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card className="border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Getting Started Guide</CardTitle>
          <CardDescription className="font-body">
            New to our platform? Follow these steps to get the most out of your autism detection tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-heading font-bold text-primary-foreground">1</span>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Start with Voice Analysis</h4>
                <p className="font-body text-sm text-muted-foreground">
                  Begin by recording a conversation or speech sample for initial assessment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-heading font-bold text-secondary-foreground">2</span>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Upload Video Content</h4>
                <p className="font-body text-sm text-muted-foreground">
                  Add video recordings to analyze behavioral patterns and social interactions.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-heading font-bold text-accent-foreground">3</span>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground mb-1">Review Your Reports</h4>
                <p className="font-body text-sm text-muted-foreground">
                  Access detailed transcripts and share findings with healthcare professionals.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
