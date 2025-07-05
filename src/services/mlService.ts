
import { Skill } from '@/pages/Index';

export interface SkillRequirement {
  skill: string;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export interface LearningResource {
  title: string;
  url: string;
  platform: string;
  duration: string;
  difficulty: string;
}

export interface MissingSkill extends SkillRequirement {
  currentLevel: number;
  gap: number;
  learningResources: LearningResource[];
}

export interface MLAnalysis {
  missingSkills: MissingSkill[];
  skillGaps: Array<{
    skill: string;
    current: number;
    required: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  learningPath: Array<{
    phase: string;
    skills: string[];
    duration: string;
    description: string;
  }>;
  totalLearningTime: number;
  completionRate: number;
}

// Role-based skill requirements database (based on your dataset)
const roleSkillRequirements: Record<string, SkillRequirement[]> = {
  'software engineer': [
    { skill: 'DSA', requiredLevel: 80, priority: 'high', category: 'Programming' },
    { skill: 'System Design', requiredLevel: 70, priority: 'high', category: 'Architecture' },
    { skill: 'React', requiredLevel: 75, priority: 'high', category: 'Frontend' },
    { skill: 'Node.js', requiredLevel: 70, priority: 'medium', category: 'Backend' },
    { skill: 'Database Design', requiredLevel: 65, priority: 'medium', category: 'Database' },
    { skill: 'Git', requiredLevel: 60, priority: 'medium', category: 'Tools' },
    { skill: 'Testing', requiredLevel: 65, priority: 'medium', category: 'Quality' },
    { skill: 'DevOps', requiredLevel: 50, priority: 'low', category: 'Operations' }
  ],
  'data scientist': [
    { skill: 'Python', requiredLevel: 85, priority: 'high', category: 'Programming' },
    { skill: 'Machine Learning', requiredLevel: 80, priority: 'high', category: 'ML' },
    { skill: 'Statistics', requiredLevel: 75, priority: 'high', category: 'Math' },
    { skill: 'SQL', requiredLevel: 70, priority: 'high', category: 'Database' },
    { skill: 'Data Visualization', requiredLevel: 65, priority: 'medium', category: 'Visualization' },
    { skill: 'Deep Learning', requiredLevel: 60, priority: 'medium', category: 'ML' },
    { skill: 'Big Data', requiredLevel: 55, priority: 'low', category: 'Data Engineering' }
  ],
  'full stack developer': [
    { skill: 'React', requiredLevel: 80, priority: 'high', category: 'Frontend' },
    { skill: 'Node.js', requiredLevel: 75, priority: 'high', category: 'Backend' },
    { skill: 'Database Design', requiredLevel: 70, priority: 'high', category: 'Database' },
    { skill: 'API Development', requiredLevel: 75, priority: 'high', category: 'Backend' },
    { skill: 'DSA', requiredLevel: 65, priority: 'medium', category: 'Programming' },
    { skill: 'System Design', requiredLevel: 60, priority: 'medium', category: 'Architecture' },
    { skill: 'DevOps', requiredLevel: 55, priority: 'medium', category: 'Operations' }
  ]
};

// Learning resources database (based on your dataset)
const learningResources: Record<string, LearningResource[]> = {
  'DSA': [
    { title: 'LeetCode DSA Course', url: 'https://leetcode.com/explore/', platform: 'LeetCode', duration: '3-4 months', difficulty: 'Intermediate' },
    { title: 'GeeksforGeeks DSA', url: 'https://www.geeksforgeeks.org/data-structures/', platform: 'GeeksforGeeks', duration: '2-3 months', difficulty: 'Beginner' }
  ],
  'System Design': [
    { title: 'Grokking System Design', url: 'https://www.educative.io/courses/grokking-the-system-design-interview', platform: 'Educative', duration: '6-8 weeks', difficulty: 'Advanced' },
    { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub', duration: '4-6 weeks', difficulty: 'Intermediate' }
  ],
  'React': [
    { title: 'React Official Tutorial', url: 'https://reactjs.org/tutorial/tutorial.html', platform: 'React Docs', duration: '2-3 weeks', difficulty: 'Beginner' },
    { title: 'Complete React Course', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', platform: 'Udemy', duration: '8-10 weeks', difficulty: 'Intermediate' }
  ],
  'Python': [
    { title: 'Python for Data Science', url: 'https://www.coursera.org/specializations/python', platform: 'Coursera', duration: '6-8 weeks', difficulty: 'Beginner' },
    { title: 'Advanced Python Programming', url: 'https://www.edx.org/course/introduction-to-python-programming', platform: 'edX', duration: '4-6 weeks', difficulty: 'Advanced' }
  ],
  'Machine Learning': [
    { title: 'ML Course by Andrew Ng', url: 'https://www.coursera.org/learn/machine-learning', platform: 'Coursera', duration: '11 weeks', difficulty: 'Intermediate' },
    { title: 'Hands-On Machine Learning', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/', platform: "O'Reilly", duration: '12-16 weeks', difficulty: 'Advanced' }
  ]
};

export class MLService {
  static analyzeSkillGaps(goals: string[], userSkills: Skill[]): MLAnalysis {
    console.log('Starting ML analysis for goals:', goals);
    console.log('User skills:', userSkills);

    const allRequiredSkills = this.getRequiredSkillsForGoals(goals);
    const skillGaps = this.calculateSkillGaps(userSkills, allRequiredSkills);
    const missingSkills = this.identifyMissingSkills(userSkills, allRequiredSkills);
    const learningPath = this.generateLearningPath(skillGaps, missingSkills);
    const totalLearningTime = this.calculateTotalLearningTime(skillGaps, missingSkills);
    const completionRate = this.calculateCompletionRate(userSkills, allRequiredSkills);

    return {
      missingSkills,
      skillGaps,
      learningPath,
      totalLearningTime,
      completionRate
    };
  }

  private static getRequiredSkillsForGoals(goals: string[]): SkillRequirement[] {
    const requiredSkills: SkillRequirement[] = [];
    
    goals.forEach(goal => {
      const normalizedGoal = goal.toLowerCase();
      
      // Find matching role requirements
      Object.keys(roleSkillRequirements).forEach(role => {
        if (normalizedGoal.includes(role)) {
          requiredSkills.push(...roleSkillRequirements[role]);
        }
      });
    });

    // Remove duplicates and merge requirements
    const skillMap = new Map<string, SkillRequirement>();
    requiredSkills.forEach(skill => {
      const existing = skillMap.get(skill.skill);
      if (!existing || skill.requiredLevel > existing.requiredLevel) {
        skillMap.set(skill.skill, skill);
      }
    });

    return Array.from(skillMap.values());
  }

  private static calculateSkillGaps(userSkills: Skill[], requiredSkills: SkillRequirement[]) {
    return requiredSkills.map(required => {
      const userSkill = userSkills.find(skill => 
        skill.name.toLowerCase().includes(required.skill.toLowerCase()) ||
        required.skill.toLowerCase().includes(skill.name.toLowerCase())
      );

      const currentLevel = userSkill?.currentLevel || 0;
      const gap = Math.max(0, required.requiredLevel - currentLevel);

      return {
        skill: required.skill,
        current: currentLevel,
        required: required.requiredLevel,
        gap,
        priority: required.priority
      };
    });
  }

  private static identifyMissingSkills(userSkills: Skill[], requiredSkills: SkillRequirement[]): MissingSkill[] {
    return requiredSkills
      .filter(required => {
        const userSkill = userSkills.find(skill => 
          skill.name.toLowerCase().includes(required.skill.toLowerCase())
        );
        return !userSkill || userSkill.currentLevel < required.requiredLevel;
      })
      .map(required => {
        const userSkill = userSkills.find(skill => 
          skill.name.toLowerCase().includes(required.skill.toLowerCase())
        );
        const currentLevel = userSkill?.currentLevel || 0;
        const gap = required.requiredLevel - currentLevel;

        return {
          ...required,
          currentLevel,
          gap,
          learningResources: learningResources[required.skill] || []
        };
      });
  }

  private static generateLearningPath(skillGaps: any[], missingSkills: MissingSkill[]) {
    const highPrioritySkills = missingSkills.filter(skill => skill.priority === 'high');
    const mediumPrioritySkills = missingSkills.filter(skill => skill.priority === 'medium');
    const lowPrioritySkills = missingSkills.filter(skill => skill.priority === 'low');

    return [
      {
        phase: 'Foundation Phase',
        skills: highPrioritySkills.slice(0, 2).map(s => s.skill),
        duration: '2-3 months',
        description: 'Master the core skills essential for your target role'
      },
      {
        phase: 'Development Phase',
        skills: [...highPrioritySkills.slice(2), ...mediumPrioritySkills.slice(0, 2)].map(s => s.skill),
        duration: '3-4 months',
        description: 'Build upon foundation with intermediate skills'
      },
      {
        phase: 'Specialization Phase',
        skills: [...mediumPrioritySkills.slice(2), ...lowPrioritySkills].map(s => s.skill),
        duration: '2-3 months',
        description: 'Advanced skills to excel in your chosen field'
      }
    ];
  }

  private static calculateTotalLearningTime(skillGaps: any[], missingSkills: MissingSkill[]): number {
    return missingSkills.reduce((total, skill) => {
      const hoursPerGapPoint = skill.priority === 'high' ? 8 : skill.priority === 'medium' ? 6 : 4;
      return total + (skill.gap * hoursPerGapPoint);
    }, 0);
  }

  private static calculateCompletionRate(userSkills: Skill[], requiredSkills: SkillRequirement[]): number {
    if (requiredSkills.length === 0) return 100;
    
    const totalRequired = requiredSkills.reduce((sum, skill) => sum + skill.requiredLevel, 0);
    const totalCurrent = requiredSkills.reduce((sum, required) => {
      const userSkill = userSkills.find(skill => 
        skill.name.toLowerCase().includes(required.skill.toLowerCase())
      );
      return sum + (userSkill?.currentLevel || 0);
    }, 0);

    return Math.round((totalCurrent / totalRequired) * 100);
  }
}
