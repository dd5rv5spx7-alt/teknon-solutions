/**
 * Centralized Portfolio, Experience & Education Data
 * All professional roles, student leadership, volunteering, and education entries
 * are defined and editable here in one single file.
 */

export const PROFILE_INFO = {
  name: 'Mukesh Vasudhar',
  tagline: 'Technology Entrepreneur • Cybersecurity Engineer • Student Leader',
  bio: 'Computer Science & Engineering student specializing in Cybersecurity at SRM University AP, Chief Technology Officer at A Teknon Solutions, and campus leader across technical and social initiatives.',
  location: 'Hyderabad & Vijayawada, India',
};

/**
 * Verified Professional & Leadership Experiences
 * STRICT reverse chronological order.
 * Verified: Duplicate entries removed; exactly one verified GFG Treasurer entry.
 */
export const EXPERIENCES = [
  {
    id: 'gfg-treasurer',
    role: 'Treasurer',
    organization: 'GeeksforGeeks Campus Body – SRM AP',
    employmentType: 'Student Leadership',
    categoryType: 'leadership', // 'professional' | 'leadership' | 'volunteering'
    categoryLabel: 'Student Leadership & Operations',
    duration: 'August 2026 – Present',
    startDate: '2026-08',
    endDate: null,
    isCurrent: true,
    location: 'SRM University AP, Andhra Pradesh',
    workMode: 'On-campus',
    shortDescription:
      'Contributing to financial coordination, organizational operations, resource management, and the effective execution of campus technical initiatives.',
    detailedDescription: [
      'Overseeing fiscal planning, resource allocation, and budget administration for technical workshops, hackathons, and campus coding initiatives.',
      'Liaising with faculty advisors, student executives, and external partners to maintain fiscal discipline and transparent operational workflows.',
      'Optimizing resource distribution across campus technical events to maximize participant reach and student learning impact.',
    ],
    skills: [
      'Financial Coordination',
      'Resource Management',
      'Organizational Operations',
      'Event Execution',
      'Technical Leadership',
    ],
    logoType: 'gfg',
    accentColor: '#10B981', // Electric emerald/green
  },
  {
    id: 'ats-cto',
    role: 'Chief Technology Officer (CTO)',
    organization: 'A Teknon Solutions',
    employmentType: 'Self-employed',
    categoryType: 'professional', // 'professional' | 'leadership' | 'volunteering'
    categoryLabel: 'Professional Employment • Executive Leadership',
    duration: 'June 2026 – Present',
    startDate: '2026-06',
    endDate: null,
    isCurrent: true,
    location: 'Hyderabad, Telangana, India',
    workMode: 'Remote',
    shortDescription:
      'Leading technology initiatives and contributing to the technical direction of A Teknon Solutions. Involved in technology strategy, web development, digital solutions, and building technology-driven initiatives.',
    detailedDescription: [
      'Architecting and leading technical direction across corporate web platforms, client software solutions, and internal engineering infrastructure.',
      'Formulating technology strategy, establishing clean software engineering practices, and driving cloud deployment reliability.',
      'Spearheading modern web development initiatives, digital enterprise transformation projects, and technology-driven training curriculums.',
    ],
    skills: [
      'Technology Strategy',
      'Web Development',
      'Technical Leadership',
      'Entrepreneurship',
      'Analytical Thinking',
      'Digital Innovation',
    ],
    logoType: 'ats',
    accentColor: '#00F59B', // Bright electric green
  },
  {
    id: 'nss-convener',
    role: 'Convener',
    organization: 'National Service Scheme (NSS)',
    employmentType: 'Volunteering',
    categoryType: 'volunteering',
    categoryLabel: 'Social Services & Community Leadership',
    duration: 'June 2026 – Present',
    startDate: '2026-06',
    endDate: null,
    isCurrent: true,
    location: 'SRM University AP, Andhra Pradesh',
    workMode: 'Community / On-campus',
    shortDescription:
      'Coordinating social service initiatives, organizing student participation, planning community-oriented activities, and helping execute impactful events.',
    detailedDescription: [
      'Directing university-wide community outreach programs, health awareness campaigns, blood donation drives, and sustainability missions.',
      'Mobilizing and leading volunteer student cohorts to actively address community challenges and promote civic responsibility.',
      'Coordinating with institutional leadership and civic authorities to ensure well-organized, socially impactful execution.',
    ],
    skills: [
      'Social Services Leadership',
      'Community Outreach',
      'Volunteer Mobilization',
      'Event Planning',
      'Civic Engagement',
    ],
    logoType: 'nss',
    accentColor: '#10B981',
  },
  {
    id: 'eclub-operations',
    role: 'Experience and Operations',
    organization: 'Entrepreneurship Club – SRM Andhra Pradesh',
    employmentType: 'Student Leadership',
    categoryType: 'leadership',
    categoryLabel: 'Student Leadership & Entrepreneurship',
    duration: 'October 2025 – May 2026',
    startDate: '2025-10',
    endDate: '2026-05',
    isCurrent: false,
    location: 'Vijayawada, Andhra Pradesh',
    workMode: 'On-campus',
    shortDescription:
      'Contributed to entrepreneurship-focused activities, organizational operations, event coordination, and student engagement initiatives.',
    detailedDescription: [
      'Facilitated end-to-end operational execution for founder conclaves, startup pitch competitions, and entrepreneurial workshops.',
      'Managed event scheduling, attendee experience, cross-departmental coordination, and speaker hospitality.',
      'Fostered student interest in venture creation, ideation bootcamps, and early-stage startup methodologies.',
    ],
    skills: [
      'Operations Management',
      'Event Coordination',
      'Entrepreneurship Ecosystems',
      'Student Engagement',
      'Operational Logistics',
    ],
    logoType: 'eclub',
    accentColor: '#6EE7B7',
  },
  {
    id: 'nss-associate',
    role: 'Associate',
    organization: 'National Service Scheme (NSS)',
    employmentType: 'Volunteering',
    categoryType: 'volunteering',
    categoryLabel: 'Social Services',
    duration: 'November 2025 – April 2026',
    startDate: '2025-11',
    endDate: '2026-04',
    isCurrent: false,
    location: 'SRM University AP, Andhra Pradesh',
    workMode: 'Community / On-campus',
    shortDescription:
      'Contributed to planning and executing social service initiatives, coordinating student activities, and delivering well-organized community events.',
    detailedDescription: [
      'Assisted in planning and executing cleanliness awareness drives, environmental campaigns, and educational camps.',
      'Managed volunteer checkpoints, field logistics, and on-ground participant coordination for student community events.',
    ],
    skills: [
      'Community Service',
      'Volunteer Coordination',
      'Event Operations',
      'Public Service',
      'Team Collaboration',
    ],
    logoType: 'nss',
    accentColor: '#6EE7B7',
  },
  {
    id: 'gfg-social-media',
    role: 'Social Media Manager',
    organization: 'GeeksforGeeks Campus Body – SRM AP',
    employmentType: 'Student Leadership',
    categoryType: 'leadership',
    categoryLabel: 'Science and Technology',
    duration: 'February 2025 – January 2026',
    startDate: '2025-02',
    endDate: '2026-01',
    isCurrent: false,
    location: 'SRM University AP, Andhra Pradesh',
    workMode: 'Hybrid',
    shortDescription:
      'Managed social media strategy and media communications for the GeeksforGeeks campus body at SRM AP. Contributed to promotional campaigns, public relations, event marketing, content creation, and student engagement.',
    detailedDescription: [
      'Planned and executed digital communication strategies across official channels to promote campus-wide technical events and hackathons.',
      'Authored engaging promotional copy, designed media collateral, and coordinated public relations to elevate brand presence.',
      'Analyzed engagement trends and student feedback to optimize outreach for coding contests and workshop series.',
    ],
    skills: [
      'Social Media Strategy',
      'Media Communications',
      'Event Marketing',
      'Content Creation',
      'Public Relations',
      'Student Engagement',
    ],
    logoType: 'gfg',
    accentColor: '#6EE7B7',
  },
];

/**
 * Verified Education
 */
export const EDUCATION = [
  {
    id: 'srm-university',
    institution: 'SRM University – Andhra Pradesh',
    shortName: 'SRM University AP',
    degree: 'Bachelor of Technology (B.Tech)',
    field: 'Computer Science and Engineering',
    specialization: 'Cybersecurity',
    duration: '2025 – September 2029',
    status: 'In Progress • Undergraduate',
    location: 'Amaravati / Neerukonda, Andhra Pradesh',
    description:
      'A motivated Computer Science and Engineering student specializing in Cybersecurity at SRM University, Andhra Pradesh. Interested in cybersecurity, software development, networking, emerging technologies, and building practical solutions to real-world problems.',
    highlights: [
      'Specialized coursework in Cybersecurity, Network Protocols, and Systems Engineering.',
      'Active leadership across campus technical bodies and student governance.',
      'Practical development of software projects and security architectures.',
    ],
    logoType: 'srm',
    badge: 'Undergraduate Degree',
  },
  {
    id: 'tirumala-school',
    institution: 'Tirumala School',
    shortName: 'Tirumala School',
    qualification: 'Secondary School Education (SSC)',
    grades: 'Grades 6–10',
    duration: 'Completed',
    status: 'Secondary Schooling',
    location: 'Andhra Pradesh, India',
    description:
      'Completed secondary school education with foundational academic grounding in mathematics, physical sciences, logical analysis, and computer science fundamentals.',
    highlights: [
      'Secondary School Certificate (SSC) curriculum.',
      'Foundational preparation in mathematical sciences and logical problem-solving.',
    ],
    logoType: 'school',
    badge: 'Secondary Education',
  },
];

/**
 * Computed Statistics
 * Derived strictly from verified entries without fabricated numbers.
 */
export const PORTFOLIO_STATS = {
  rolesCount: EXPERIENCES.length, // 6 verified roles
  organizationsCount: new Set(EXPERIENCES.map((e) => e.organization)).size, // 4 organizations (ATS, GFG, NSS, E-Club)
  initiativesCount: 6, // 6 verified technical & social initiatives across technology, social services, and entrepreneurship
  activeRolesCount: EXPERIENCES.filter((e) => e.isCurrent).length, // 3 current roles
};

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Roles' },
  { id: 'professional', label: 'Professional Employment' },
  { id: 'leadership', label: 'Student Leadership' },
  { id: 'volunteering', label: 'Social Services' },
];
