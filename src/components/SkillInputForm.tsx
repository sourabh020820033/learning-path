
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ArrowRight } from 'lucide-react';
import { LearningData, Skill } from '@/pages/Index';

interface SkillInputFormProps {
  onSubmit: (data: LearningData) => void;
}

export const SkillInputForm = ({ onSubmit }: SkillInputFormProps) => {
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    currentLevel: 0,
    targetLevel: 80,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [timeframe, setTimeframe] = useState('');

  const addGoal = () => {
    if (currentGoal.trim() && !goals.includes(currentGoal.trim())) {
      setGoals([...goals, currentGoal.trim()]);
      setCurrentGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    if (currentSkill.name.trim()) {
      setSkills([...skills, { ...currentSkill, name: currentSkill.name.trim() }]);
      setCurrentSkill({
        name: '',
        currentLevel: 0,
        targetLevel: 80,
        priority: 'medium' as 'high' | 'medium' | 'low'
      });
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (goals.length > 0 && skills.length > 0 && timeframe) {
      onSubmit({ goals, skills, timeframe });
    }
  };

  const isFormValid = goals.length > 0 && skills.length > 0 && timeframe;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Setup Your Learning Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Goals Section */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Career Goals & Target Roles</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Software Engineer, Data Scientist, Full Stack Developer"
              value={currentGoal}
              onChange={(e) => setCurrentGoal(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            />
            <Button onClick={addGoal} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {goal}
                <button
                  onClick={() => removeGoal(index)}
                  className="ml-2 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Current Skills Assessment</Label>
          
          {/* Add Skill Form */}
          <Card className="p-4 bg-gray-50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    placeholder="e.g., React, Python, DSA, System Design"
                    value={currentSkill.name}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select 
                    value={currentSkill.priority} 
                    onValueChange={(value: 'high' | 'medium' | 'low') => 
                      setCurrentSkill({ ...currentSkill, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Current Level: {currentSkill.currentLevel}%</Label>
                  <Slider
                    value={[currentSkill.currentLevel]}
                    onValueChange={(value) => setCurrentSkill({ ...currentSkill, currentLevel: value[0] })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Target Level: {currentSkill.targetLevel}%</Label>
                  <Slider
                    value={[currentSkill.targetLevel]}
                    onValueChange={(value) => setCurrentSkill({ ...currentSkill, targetLevel: value[0] })}
                    max={100}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>
              
              <Button onClick={addSkill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </Card>

          {/* Skills List */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <Label>Your Skills ({skills.length})</Label>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant={skill.priority === 'high' ? 'destructive' : skill.priority === 'medium' ? 'default' : 'secondary'}>
                            {skill.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          Current: {skill.currentLevel}% → Target: {skill.targetLevel}%
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeframe Section */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Learning Timeframe</Label>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger>
              <SelectValue placeholder="Select your preferred timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-months">3 Months</SelectItem>
              <SelectItem value="6-months">6 Months</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid}
          className="w-full py-6 text-lg"
        >
          Generate ML-Powered Learning Dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
