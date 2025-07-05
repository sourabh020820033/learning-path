
import { useState } from 'react';
import { SkillInputForm } from '@/components/SkillInputForm';
import { LearningDashboard } from '@/components/LearningDashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

export interface Skill {
  name: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
}

export interface LearningData {
  goals: string[];
  skills: Skill[];
  timeframe: string;
}

const Index = () => {
  const [step, setStep] = useState<'input' | 'dashboard'>('input');
  const [learningData, setLearningData] = useState<LearningData | null>(null);

  const handleDataSubmit = (data: LearningData) => {
    setLearningData(data);
    setStep('dashboard');
  };

  const handleReset = () => {
    setStep('input');
    setLearningData(null);
  };

  if (step === 'dashboard' && learningData) {
    return <LearningDashboard data={learningData} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Learning Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your skills with personalized learning paths powered by machine learning
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Goal Setting</h3>
            <p className="text-gray-600">Define your learning objectives and career goals</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Skill Assessment</h3>
            <p className="text-gray-600">Evaluate your current skill levels and identify gaps</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Learning Path</h3>
            <p className="text-gray-600">Get personalized recommendations and time estimates</p>
          </Card>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto">
          <SkillInputForm onSubmit={handleDataSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Index;
