import { NextRequest, NextResponse } from 'next/server';
import { CAREERS } from '@/lib/data';

export async function POST(req: NextRequest) {
  const { profile, careerId } = await req.json();
  
  const career = CAREERS.find(c => c.id === careerId);
  if (!career) return NextResponse.json({ error: 'Career not found' }, { status: 404 });

  // Generate personalized learning pathway
  const currentClass = parseInt(profile?.currentClass?.replace('Class ', '') || '10');
  const isLowIncome = profile?.income === 'low';
  
  const pathway = {
    careerId,
    careerTitle: career.title,
    careerTitleHi: career.titleHi,
    icon: career.icon,
    estimatedTime: currentClass < 10 ? '4-6 years' : currentClass < 12 ? '2-4 years' : '1-3 years',
    avgSalary: career.avgSalary,
    demand: career.demand,
    phases: [
      {
        phase: 1,
        title: 'Foundation',
        titleHi: 'नींव',
        duration: '3-6 months',
        icon: '📐',
        steps: [
          { title: `Complete Class ${currentClass <= 10 ? '10' : '12'} with focus on relevant subjects`, platform: 'DIKSHA', free: true },
          { title: `Join SWAYAM free foundation course`, platform: 'SWAYAM', free: true },
          { title: `Practice basic skills daily (30 min)`, platform: 'Self', free: true },
        ],
        milestone: 'Strong academic foundation in core subjects'
      },
      {
        phase: 2,
        title: 'Skill Building',
        titleHi: 'कौशल निर्माण',
        duration: '6-12 months',
        icon: '🛠️',
        steps: career.path.map(p => ({ title: p, platform: 'Mixed', free: true })),
        milestone: 'Hands-on skills in ' + career.title
      },
      {
        phase: 3,
        title: 'Certification',
        titleHi: 'प्रमाणन',
        duration: '1-6 months',
        icon: '🎓',
        steps: [
          { title: `Appear for: ${career.exams[0] || 'NSQF Assessment'}`, platform: 'Govt', free: false },
          { title: 'Complete SWAYAM certification exam', platform: 'SWAYAM', free: true },
          { title: 'Build a portfolio/project to showcase skills', platform: 'Self', free: true },
        ],
        milestone: 'Recognized certification in hand'
      },
      {
        phase: 4,
        title: 'Opportunity',
        titleHi: 'अवसर',
        duration: '3-12 months',
        icon: '🚀',
        steps: [
          { title: 'Apply for NAPS apprenticeship', platform: 'NAPS', free: true },
          { title: 'Apply for government schemes (PMEGP/MUDRA)', platform: 'Govt', free: true },
          { title: 'Connect with mentor in your field', platform: 'VidyaSetu', free: true },
        ],
        milestone: 'First job, apprenticeship, or business launch!'
      }
    ],
    courses: career.courses.map((c, i) => ({
      name: c,
      platform: c.includes('SWAYAM') ? 'SWAYAM' : 'DIKSHA',
      free: true,
      link: c.includes('SWAYAM') ? 'https://swayam.gov.in' : 'https://diksha.gov.in',
      duration: ['8 weeks', '12 weeks', '6 months'][i % 3]
    })),
    exams: career.exams,
    skills: career.skills,
    schemesApplicable: career.schemeIds,
  };

  return NextResponse.json({ pathway });
}
