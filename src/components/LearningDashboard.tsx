import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ArrowLeft, Clock, Target, TrendingUp, BookOpen, Award, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { LearningData } from '@/pages/Index';
import { MLService } from '@/services/mlService';

interface LearningDashboardProps {
  data: LearningData;
  onReset: () => void;
}

export const LearningDashboard = ({ data, onReset }: LearningDashboardProps) => {
  // Generate ML analysis
  const mlAnalysis = MLService.analyzeSkillGaps(data.goals, data.skills);
  
  console.log('ML Analysis Results:', mlAnalysis);

  const totalLearningHours = data.skills.reduce((total, skill) => {
    const gap = skill.targetLevel - skill.currentLevel;
    return total + Math.round((gap / 100) * 40);
  }, 0);

  const averageCurrentLevel = data.skills.reduce((sum, skill) => sum + skill.currentLevel, 0) / data.skills.length;
  const averageTargetLevel = data.skills.reduce((sum, skill) => sum + skill.targetLevel, 0) / data.skills.length;

  const skillGapData = mlAnalysis.skillGaps.map(gap => ({
    name: gap.skill,
    current: gap.current,
    required: gap.required,
    gap: gap.gap,
    priority: gap.priority
  }));

  const radarData = mlAnalysis.skillGaps.map(gap => ({
    skill: gap.skill,
    current: gap.current,
    target: gap.required
  }));

  const priorityData = [
    { name: 'High Priority', value: mlAnalysis.missingSkills.filter(s => s.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium Priority', value: mlAnalysis.missingSkills.filter(s => s.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low Priority', value: mlAnalysis.missingSkills.filter(s => s.priority === 'low').length, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onReset} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Setup
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">ML-Powered Learning Dashboard</h1>
            <p className="text-gray-600">learning path based on your goals and current skills</p>
          </div>
          <div className="w-24" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Missing Skills</p>
                  <p className="text-2xl font-bold text-red-600">{mlAnalysis.missingSkills.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                  <p className="text-2xl font-bold text-blue-600">{mlAnalysis.totalLearningTime}h</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{mlAnalysis.completionRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Avg</p>
                  <p className="text-2xl font-bold text-orange-600">{Math.round(averageCurrentLevel)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missing Skills Alert */}
        {mlAnalysis.missingSkills.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Critical Skills Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Based on your target role of "{data.goals.join(', ')}", you're missing {mlAnalysis.missingSkills.length} essential skills:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mlAnalysis.missingSkills.map((skill, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <Badge variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}>
                        {skill.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Need: {skill.requiredLevel}% | Current: {skill.currentLevel}% | Gap: {skill.gap}%
                    </p>
                    <Progress value={(skill.currentLevel / skill.requiredLevel) * 100} className="mb-3" />
                    {skill.learningResources.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Learning Resources:</p>
                        {skill.learningResources.slice(0, 2).map((resource, ridx) => (
                          <a
                            key={ridx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {resource.title} ({resource.duration})
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Learning Path */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              AI-Generated Learning Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mlAnalysis.learningPath.map((phase, index) => (
                <div key={index} className="relative">
                  {index < mlAnalysis.learningPath.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-20 bg-gray-300"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{phase.phase}</h3>
                      <p className="text-gray-600 mb-3">{phase.description}</p>
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline">⏱️ {phase.duration}</Badge>
                        <Badge variant="outline">📚 {phase.skills.length} skills</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skill Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Required vs Current Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillGapData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
                  <Bar dataKey="required" fill="#ef4444" name="Required Level" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Radar Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Current" dataKey="current" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name="Required" dataKey="target" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Career Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{goal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Timeframe:</strong> {data.timeframe} | <strong>Estimated completion:</strong> {mlAnalysis.completionRate}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
