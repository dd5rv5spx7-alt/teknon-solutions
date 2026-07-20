import {
  GraduationCap, Users, Code2, Briefcase, Target, Clock, Award,
  BookOpen, TrendingUp, Headphones, FileText, UserCheck,
  Layers, Trophy, Calendar, Building2,
  HeartHandshake, Rocket, Sparkles, Globe,
} from 'lucide-react';

export const CONTACT = {
  phone: '+91 8897571616',
  phoneRaw: '918897571616',
  location: 'Rajahmundry, Andhra Pradesh',
  classes: 'Online & Offline',
  email: 'info@ateknonsolutions.com',
  whatsappMessage: "Hi A Teknon Solutions, I'd like to know more about your internship programs.",
};

export const SOCIAL_LINKS = [
  { name: 'Instagram', icon: 'Instagram', href: '#' },
  { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
  { name: 'GitHub', icon: 'Github', href: '#' },
  { name: 'Facebook', icon: 'Facebook', href: '#' },
  { name: 'YouTube', icon: 'Youtube', href: '#' },
];

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Courses', href: '#courses' },
  { label: 'Technologies', href: '#technologies' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
];

export const FOOTER_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Courses', href: '#courses' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '#contact' },
];

export const STATS = [
  { value: 500, suffix: '+', label: 'Students Trained' },
  { value: 50, suffix: '+', label: 'Live Projects' },
  { value: 20, suffix: '+', label: 'Technologies' },
  { value: 100, suffix: '%', label: 'Practical Learning' },
];

export const ABOUT_HIGHLIGHTS = [
  { icon: Code2, label: 'Hands-on Learning' },
  { icon: Users, label: 'Industry Experts' },
  { icon: Layers, label: 'Real Projects' },
  { icon: TrendingUp, label: 'Career Growth' },
  { icon: Clock, label: 'Flexible Learning' },
  { icon: Globe, label: 'Online & Offline Classes' },
];

export const WHY_CHOOSE = [
  { icon: Briefcase, title: 'Hands-on Internships', desc: 'Learn by doing, not just watching — every track is built around real internship work.' },
  { icon: GraduationCap, title: 'Expert Trainers', desc: 'Mentors who work in the industry and teach what actually gets used on the job.' },
  { icon: Target, title: 'Industry-Oriented Curriculum', desc: 'Course content shaped around what companies are hiring for right now.' },
  { icon: Layers, title: 'Real-world Projects', desc: 'Build a portfolio of live projects, not just tutorial clones.' },
  { icon: FileText, title: 'Resume Building', desc: 'One-on-one help turning your new skills into a resume recruiters notice.' },
  { icon: UserCheck, title: 'Interview Preparation', desc: 'Mock interviews and structured practice so the real one feels familiar.' },
  { icon: Award, title: 'Certification', desc: 'A recognized certificate for every program you complete.' },
  { icon: HeartHandshake, title: 'Career Guidance', desc: 'Ongoing direction on which skills, roles and paths fit your goals.' },
  { icon: Clock, title: 'Flexible Timings', desc: 'Batches designed around students and working learners alike.' },
  { icon: Sparkles, title: 'Affordable Pricing', desc: 'Career-focused training priced to stay accessible, starting at ₹1,999.' },
  { icon: Headphones, title: 'Live Support', desc: 'Real answers from real mentors — not a ticket queue.' },
  { icon: Rocket, title: 'Placement Assistance', desc: 'Support that continues past graduation, into your job search.' },
];

export const PROGRAMS = [
  {
    id: 'two-week',
    name: 'Two Weeks',
    tag: 'Starter',
    tagline: 'Perfect for beginners.',
    duration: '2 Weeks',
    skills: 'Programming fundamentals + 1 core language',
    projects: '2 mini projects',
    certificate: 'Certificate of Completion',
    mentorship: 'Group mentorship sessions',
    price: '₹1,999',
    icon: Rocket,
    highlighted: false,
  },
  {
    id: 'four-week',
    name: 'Four Weeks',
    tag: 'Foundation',
    tagline: 'Strengthen your foundation with practical assignments.',
    duration: '4 Weeks',
    skills: 'Core language + Git, GitHub & dev tools',
    projects: '4 guided projects',
    certificate: 'Certificate of Completion',
    mentorship: 'Weekly 1:1 mentor check-ins',
    price: '₹3,999',
    icon: Code2,
    highlighted: true,
  },
  {
    id: 'eight-week',
    name: 'Eight Weeks',
    tag: 'Advanced',
    tagline: 'Advanced learning with live projects and portfolio development.',
    duration: '8 Weeks',
    skills: 'Full-stack / specialization track',
    projects: 'Live project + full portfolio',
    certificate: 'Advanced Certificate',
    mentorship: 'Dedicated mentor + mock interviews',
    price: '₹6,999',
    icon: Layers,
    highlighted: false,
  },
  {
    id: 'custom',
    name: 'Custom Learning',
    tag: 'Tailored',
    tagline: 'Personalized training based on student goals.',
    duration: 'You choose',
    skills: 'Curriculum built around your goals',
    projects: 'Scoped to your track',
    certificate: 'Certificate of Completion',
    mentorship: 'Personalized mentorship plan',
    price: 'Custom',
    icon: Target,
    highlighted: false,
  },
];

export const TECHNOLOGIES = {
  languages: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'C#', 'PHP', 'Go', 'Rust'],
  tools: [
    'React', 'Next.js', 'Angular', 'Node.js', 'Express', 'Flutter', 'React Native',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'Git', 'GitHub', 'Docker',
    'Linux', 'VS Code', 'Figma', 'AWS', 'Azure',
  ],
  emerging: [
    'Cloud Computing', 'Cybersecurity', 'Artificial Intelligence', 'Machine Learning',
    'Data Science', 'Prompt Engineering', 'Generative AI', 'UI/UX Design', 'DevOps', 'Kubernetes',
  ],
};

export const PROCESS_STEPS = [
  { step: '01', title: 'Register', desc: 'Sign up in minutes through our online registration form.', icon: FileText },
  { step: '02', title: 'Choose Your Program', desc: 'Pick the duration and track that fits your goals.', icon: Target },
  { step: '03', title: 'Attend Training', desc: 'Learn from industry mentors, online or offline.', icon: GraduationCap },
  { step: '04', title: 'Build Projects', desc: 'Apply what you learn to real, portfolio-ready projects.', icon: Layers },
  { step: '05', title: 'Receive Certificate', desc: 'Graduate with a certificate that proves your skills.', icon: Award },
  { step: '06', title: 'Career Support', desc: 'Get resume help, mock interviews and placement assistance.', icon: Rocket },
];

export const COURSE_CATEGORIES = [
  'All', 'Programming', 'Web Development', 'Mobile', 'Security', 'AI & Data', 'Cloud & DevOps', 'Career Prep',
];

export const COURSES = [
  { title: 'Python Development', category: 'Programming', desc: 'From syntax to scripting real applications.' },
  { title: 'Full Stack Web Development', category: 'Web Development', desc: 'Frontend, backend and databases, end to end.' },
  { title: 'Frontend Development', category: 'Web Development', desc: 'React-driven interfaces that feel fast and polished.' },
  { title: 'Backend Development', category: 'Web Development', desc: 'APIs, databases and server-side architecture.' },
  { title: 'Java Programming', category: 'Programming', desc: 'Core Java through to object-oriented application design.' },
  { title: 'Flutter App Development', category: 'Mobile', desc: 'One codebase, native apps for iOS and Android.' },
  { title: 'React Development', category: 'Web Development', desc: 'Component-driven UI, hooks, and state management.' },
  { title: 'Node.js', category: 'Web Development', desc: 'Server-side JavaScript and REST API development.' },
  { title: 'Cybersecurity', category: 'Security', desc: 'Core principles of defending systems and data.' },
  { title: 'Ethical Hacking', category: 'Security', desc: 'Think like an attacker to build stronger defenses.' },
  { title: 'AI & Machine Learning', category: 'AI & Data', desc: 'Models, training pipelines and real-world use cases.' },
  { title: 'Cloud Computing', category: 'Cloud & DevOps', desc: 'Deploy and scale on AWS and Azure with confidence.' },
  { title: 'Data Structures & Algorithms', category: 'Programming', desc: 'The problem-solving core every interview tests.' },
  { title: 'Interview Preparation', category: 'Career Prep', desc: 'Mock interviews, technical rounds and HR prep.' },
  { title: 'Git & GitHub', category: 'Cloud & DevOps', desc: 'Version control and collaboration, the way teams work.' },
  { title: 'DevOps', category: 'Cloud & DevOps', desc: 'CI/CD, containers and infrastructure fundamentals.' },
];

export const STUDENT_BENEFITS = [
  { icon: FileText, label: 'Practical Assignments' },
  { icon: Layers, label: 'Live Projects' },
  { icon: Users, label: 'Industry Mentorship' },
  { icon: UserCheck, label: 'Mock Interviews' },
  { icon: FileText, label: 'Resume Reviews' },
  { icon: TrendingUp, label: 'LinkedIn Optimization' },
  { icon: Code2, label: 'Coding Challenges' },
  { icon: Award, label: 'Internship Certificate' },
  { icon: HeartHandshake, label: 'Career Guidance' },
  { icon: Briefcase, label: 'Portfolio Development' },
  { icon: Users, label: 'Community Access' },
  { icon: BookOpen, label: 'Lifetime Learning Resources' },
];

export const TESTIMONIALS = [
  {
    name: 'Sai Kiran Reddy',
    role: 'Full Stack Web Development · 8-Week Program',
    quote: "The mentors didn't just teach syntax, they showed me how real teams build products. I walked out with a portfolio, not just notes.",
    rating: 5,
  },
  {
    name: 'Divya Sri Chowdary',
    role: 'Python Development · 4-Week Program',
    quote: 'My first week I could barely write a loop. By week four I had two working projects and the confidence to explain them in an interview.',
    rating: 5,
  },
  {
    name: 'Rohit Varma',
    role: 'AI & Machine Learning · Custom Track',
    quote: 'The mock interviews were tougher than my actual placement interview — which is exactly why I walked in calm and got the offer.',
    rating: 5,
  },
  {
    name: 'Lakshmi Prasanna',
    role: 'Cybersecurity · 8-Week Program',
    quote: 'Hands-on labs from day one. I finally understood concepts I had only read about in textbooks for two years.',
    rating: 5,
  },
  {
    name: 'Arjun Vijay',
    role: 'React Development · 4-Week Program',
    quote: 'Small batches meant the trainer actually knew my name and where I was stuck. That personal attention made all the difference.',
    rating: 5,
  },
  {
    name: 'Harika Nallamothu',
    role: 'Full Stack Web Development · 8-Week Program',
    quote: 'Between the live projects and resume workshops, I had three interview calls before my certificate even arrived.',
    rating: 5,
  },
  {
    name: 'Venkata Sai Teja',
    role: 'DevOps · 8-Week Program',
    quote: 'I came from a non-CS background. Eight weeks later I was explaining CI/CD pipelines to my new team lead in my first job.',
    rating: 5,
  },
  {
    name: 'Meghana Reddy',
    role: 'Java Programming · 4-Week Program',
    quote: 'Clear explanations, real assignments every night, and a mentor who actually answered doubts at 10pm. Worth every rupee.',
    rating: 5,
  },
  {
    name: 'Pavan Kalyan Rao',
    role: 'Cloud Computing · Custom Track',
    quote: 'They built the syllabus around the AWS role I was targeting instead of a generic cloud course. That focus got me shortlisted.',
    rating: 5,
  },
  {
    name: 'Sindhu Priya',
    role: 'Ethical Hacking · Custom Track',
    quote: "I'd tried two YouTube playlists before this and understood less than my first week here. The labs make it click.",
    rating: 5,
  },
  {
    name: 'Naga Charan',
    role: 'Flutter App Development · 4-Week Program',
    quote: 'Shipped my first real app to the Play Store before the program even ended. Nothing builds confidence like that.',
    rating: 5,
  },
  {
    name: 'Anusha Devi',
    role: 'Data Structures & Algorithms · 2-Week Program',
    quote: 'Two weeks completely changed how I approach problems in interviews. I stopped freezing on the whiteboard.',
    rating: 5,
  },
  {
    name: 'Kiran Kumar Yadav',
    role: 'Backend Development · 8-Week Program',
    quote: "The project we built wasn't a toy — it had auth, a real database, and deployment. I still reference the code I wrote here.",
    rating: 4,
  },
  {
    name: 'Swathi Reddy',
    role: 'Frontend Development · 4-Week Program',
    quote: 'I switched careers from teaching to tech at 29. The instructors never made me feel behind for starting later.',
    rating: 5,
  },
  {
    name: 'Vamsi Krishna',
    role: 'Node.js · 4-Week Program',
    quote: 'Debugging sessions with the mentor taught me more than the lectures did — watching someone actually think through a bug live.',
    rating: 5,
  },
  {
    name: 'Deepika Sharma',
    role: 'AI & Machine Learning · Custom Track',
    quote: 'Went in only knowing Python basics. Came out having trained and deployed an actual model. Still surprises me.',
    rating: 5,
  },
  {
    name: 'Ravi Teja Naidu',
    role: 'Cybersecurity · 8-Week Program',
    quote: 'The interview prep alone justified the cost. I walked into three interviews knowing exactly what to expect.',
    rating: 5,
  },
  {
    name: 'Pooja Lakshmi',
    role: 'Python Development · 4-Week Program',
    quote: 'I work full-time and did this on evenings and weekends. The flexible batch timing is the only reason I finished.',
    rating: 4,
  },
  {
    name: 'Charan Tej',
    role: 'Full Stack Web Development · 8-Week Program',
    quote: "My resume went from zero projects to three real ones. Recruiters actually asked about them by name in interviews.",
    rating: 5,
  },
  {
    name: 'Nikitha Rao',
    role: 'React Development · 4-Week Program',
    quote: 'Every assignment mapped to something I later saw in my actual job. Nothing felt like busywork.',
    rating: 5,
  },
  {
    name: 'Sathya Narayana',
    role: 'DevOps · 8-Week Program',
    quote: "Understanding Docker and Kubernetes finally stuck once I set them up myself instead of just watching slides.",
    rating: 5,
  },
  {
    name: 'Bhavya Sri',
    role: 'Interview Preparation · 2-Week Program',
    quote: 'Just did the two-week interview prep track after finishing my degree. Got an offer within a month of completing it.',
    rating: 5,
  },
  {
    name: 'Manoj Kumar Chowdary',
    role: 'Java Programming · 4-Week Program',
    quote: 'The mentor corrected bad habits I didn\u2019t know I had from self-teaching. That alone was worth joining for.',
    rating: 4,
  },
  {
    name: 'Priyanka Vissa',
    role: 'Cloud Computing · Custom Track',
    quote: 'I needed a very specific Azure-focused track for a job I already had lined up. They actually built it around that.',
    rating: 5,
  },
  {
    name: 'Surya Prakash',
    role: 'Ethical Hacking · Custom Track',
    quote: 'Learned to think like an attacker, not just memorize tool names. That mindset shift is what the certification exam actually tests.',
    rating: 5,
  },
  {
    name: 'Keerthi Reddy',
    role: 'Full Stack Web Development · 8-Week Program',
    quote: "Eight weeks felt long when I signed up. Looking back, I wish it were longer — I was building real things by week three.",
    rating: 5,
  },
  {
    name: 'Yaswanth Kumar',
    role: 'Flutter App Development · 4-Week Program',
    quote: 'Came in only knowing web development. The trainer made the jump to mobile way less intimidating than I expected.',
    rating: 5,
  },
  {
    name: 'Aparna Devi',
    role: 'Backend Development · 8-Week Program',
    quote: 'The resume review session rewrote three lines that I later found out were the exact ones recruiters asked about.',
    rating: 5,
  },
  {
    name: 'Karthik Varma',
    role: 'Python Development · 4-Week Program',
    quote: 'Group mentorship sounded impersonal on paper. In practice the batch was small enough that it never felt that way.',
    rating: 4,
  },
  {
    name: 'Sneha Latha',
    role: 'AI & Machine Learning · Custom Track',
    quote: "I'm a working professional who switched domains entirely. The custom pacing meant I never had to choose between my job and learning.",
    rating: 5,
  },
];

export const GALLERY_CATEGORIES = [
  {
    label: 'Classroom Sessions',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=80',
    alt: 'Students seated at desks during a classroom training session',
  },
  {
    label: 'Workshops',
    icon: Users,
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    alt: 'Two students reviewing code together on a laptop during a hands-on workshop',
  },
  {
    label: 'Live Coding',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    alt: 'Laptop screen showing lines of code during a live coding session',
  },
  {
    label: 'Hackathons',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    alt: 'Large group of participants working on laptops during a hackathon',
  },
  {
    label: 'Certificates & Achievements',
    icon: Award,
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    alt: 'Graduates throwing their caps in the air to celebrate their achievement',
  },
  {
    label: 'Events',
    icon: Calendar,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    alt: 'Audience seated at an A Teknon Solutions community event',
  },
];

export const PRICING = [
  {
    name: 'Starter',
    price: '₹1,999',
    period: '2-week program',
    icon: Rocket,
    features: [
      { label: 'Certificate of Completion', included: true },
      { label: 'Practical Assignments', included: true },
      { label: 'Group Mentorship', included: true },
      { label: '2 Mini Projects', included: true },
      { label: 'Career Guidance', included: false },
      { label: 'Interview Preparation', included: false },
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹3,999',
    period: '4-week program',
    icon: Code2,
    features: [
      { label: 'Certificate of Completion', included: true },
      { label: 'Practical Assignments', included: true },
      { label: 'Weekly 1:1 Mentorship', included: true },
      { label: '4 Guided Projects', included: true },
      { label: 'Career Guidance', included: true },
      { label: 'Interview Preparation (Basic)', included: true },
    ],
    highlighted: true,
  },
  {
    name: 'Advanced',
    price: '₹6,999',
    period: '8-week program',
    icon: Layers,
    features: [
      { label: 'Advanced Certificate', included: true },
      { label: 'Practical Assignments', included: true },
      { label: 'Dedicated Mentor', included: true },
      { label: 'Live Project + Portfolio', included: true },
      { label: 'Career Guidance', included: true },
      { label: 'Full Mock Interviews', included: true },
    ],
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored program',
    icon: Building2,
    features: [
      { label: 'Everything in Advanced', included: true },
      { label: 'Custom Curriculum', included: true },
      { label: 'Flexible Scheduling', included: true },
      { label: 'Group / Institution Pricing', included: true },
      { label: 'Career Guidance', included: true },
      { label: 'Dedicated Support', included: true },
    ],
    highlighted: false,
  },
];

export const FAQS = [
  { q: 'Who can join A Teknon Solutions?', a: 'Anyone looking to build practical IT skills — college students, recent graduates, and working professionals looking to upskill. Programs are structured for beginners through to advanced learners.' },
  { q: 'Do I need coding experience?', a: "No prior experience is required for our Starter and Foundation programs — we start from the fundamentals. If you already code, you can move straight into an Advanced or Custom track." },
  { q: 'Is the internship online?', a: 'You can choose either — we run both online and offline (in-person, Rajahmundry) classes, so pick whichever fits your schedule and location.' },
  { q: 'Will I receive a certificate?', a: 'Yes. Every program, from the 2-week Starter track to Custom Learning, ends with a certificate you can add to your resume and LinkedIn profile.' },
  { q: 'Are projects included?', a: 'Yes — every program includes hands-on projects, scaling from mini projects in the 2-week track up to a full live project and portfolio in the 8-week Advanced track.' },
  { q: 'Is placement assistance available?', a: 'Yes. Alongside training, we support resume building, LinkedIn optimization, mock interviews and career guidance to help you move toward placement.' },
  { q: 'Can college students join?', a: 'Absolutely — many of our students join alongside their degree. Flexible timings and both online/offline options make it easy to fit around your academic schedule.' },
  { q: 'What is the duration?', a: 'Programs run from 2 to 8 weeks, or a fully custom duration built around your goals — see the Programs section above for details on each track.' },
];
