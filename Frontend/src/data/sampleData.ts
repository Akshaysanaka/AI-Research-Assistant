export interface Collaborator {
  id: number;
  name: string;
  title: string;
  department: string;
  researchInterests: string[];
  publications: number;
  matchScore: number;
  avatar: string;
}

export interface Grant {
  id: number;
  title: string;
  agency: string;
  amount: string;
  deadline: string;
  category: string;
  matchScore: number;
}

export const collaborators: Collaborator[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor',
    department: 'Computer Science',
    researchInterests: ['Machine Learning', 'NLP', 'AI Ethics'],
    publications: 45,
    matchScore: 95,
    avatar: 'SC'
  },
  {
    id: 2,
    name: 'Prof. Michael Rodriguez',
    title: 'Full Professor',
    department: 'Data Science',
    researchInterests: ['Deep Learning', 'Computer Vision', 'Robotics'],
    publications: 78,
    matchScore: 88,
    avatar: 'MR'
  },
  {
    id: 3,
    name: 'Dr. Emily Thompson',
    title: 'Assistant Professor',
    department: 'Biomedical Engineering',
    researchInterests: ['AI in Healthcare', 'Medical Imaging', 'Predictive Analytics'],
    publications: 32,
    matchScore: 82,
    avatar: 'ET'
  },
  {
    id: 4,
    name: 'Dr. James Park',
    title: 'Research Scientist',
    department: 'Applied AI Lab',
    researchInterests: ['Reinforcement Learning', 'Multi-Agent Systems', 'Optimization'],
    publications: 29,
    matchScore: 79,
    avatar: 'JP'
  }
];

export const grants: Grant[] = [
  {
    id: 1,
    title: 'NSF: Artificial Intelligence Research Grant',
    agency: 'National Science Foundation',
    amount: '$500,000',
    deadline: '2025-12-15',
    category: 'AI & Machine Learning',
    matchScore: 92
  },
  {
    id: 2,
    title: 'NIH: AI for Healthcare Innovation',
    agency: 'National Institutes of Health',
    amount: '$750,000',
    deadline: '2025-11-30',
    category: 'Healthcare AI',
    matchScore: 87
  },
  {
    id: 3,
    title: 'DOE: Clean Energy AI Research',
    agency: 'Department of Energy',
    amount: '$350,000',
    deadline: '2026-01-20',
    category: 'Energy & Environment',
    matchScore: 75
  },
  {
    id: 4,
    title: 'DARPA: Advanced AI Systems',
    agency: 'Defense Advanced Research Projects Agency',
    amount: '$1,200,000',
    deadline: '2025-10-31',
    category: 'Defense & Security',
    matchScore: 81
  },
  {
    id: 5,
    title: 'Google Research Grant',
    agency: 'Google AI',
    amount: '$250,000',
    deadline: '2026-02-28',
    category: 'Industry Collaboration',
    matchScore: 78
  }
];
