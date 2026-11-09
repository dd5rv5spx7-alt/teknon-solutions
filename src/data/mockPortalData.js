/**
 * Mock Portal Data for ATS Group of Companies / Teknon Solutions
 * Provides rich, realistic data for Student & Admin Dashboards.
 */

export const MOCK_STUDENT_PROFILE = {
  id: 'usr-student-001',
  full_name: 'Sai Kiran Reddy',
  email: 'saikiran.reddy@example.com',
  phone: '+91 98480 12345',
  college: 'JNTUK College of Engineering',
  year: 'Final Year',
  role: 'student',
  status: 'active',
  student_id: 'TS-2026-STU-042',
  track: 'Full Stack Web Development',
  batch_name: 'Batch 2026-A (Morning)',
  created_at: '2026-01-15T09:00:00Z',
};

export const MOCK_STUDENT_COURSES = [
  {
    id: 'crs-fullstack',
    title: 'Full Stack Web Development with React & Node',
    slug: 'full-stack-web-development',
    category: 'Web Development',
    instructor: 'William Carie Amudala',
    progress: 78,
    total_lessons: 32,
    completed_lessons: 25,
    last_accessed_lesson: 'Building RESTful APIs with Express & JWT',
    cover_gradient: 'from-blue-600 to-indigo-900',
    batch: 'Batch 2026-A',
  },
  {
    id: 'crs-python',
    title: 'Python for Data Automation & AI Pipelines',
    slug: 'python-development',
    category: 'Programming',
    instructor: 'Senior Faculty Team',
    progress: 100,
    total_lessons: 20,
    completed_lessons: 20,
    last_accessed_lesson: 'Course Completed',
    cover_gradient: 'from-emerald-600 to-teal-900',
    batch: 'Batch 2025-Winter',
  },
];

export const MOCK_ATTENDANCE = [
  { id: 'att-1', date: '2026-03-08', session_topic: 'React 19 Hooks & Server Components', status: 'present', faculty: 'William Carie' },
  { id: 'att-2', date: '2026-03-06', session_topic: 'PostgreSQL Relational Schema Design', status: 'present', faculty: 'Lead Engineer' },
  { id: 'att-3', date: '2026-03-04', session_topic: 'JWT Authentication & Security Best Practices', status: 'present', faculty: 'William Carie' },
  { id: 'att-4', date: '2026-03-01', session_topic: 'Docker Containers & DevOps Basics', status: 'present', faculty: 'Cloud Mentor' },
  { id: 'att-5', date: '2026-02-27', session_topic: 'REST API Performance & Caching', status: 'present', faculty: 'William Carie' },
  { id: 'att-6', date: '2026-02-25', session_topic: 'State Management with Zustand & Redux', status: 'excused', faculty: 'Lead Engineer' },
  { id: 'att-7', date: '2026-02-22', session_topic: 'Git Flow & CI/CD Pipeline Automation', status: 'present', faculty: 'DevOps Lead' },
  { id: 'att-8', date: '2026-02-20', session_topic: 'Frontend UI/UX Systems with Tailwind CSS', status: 'present', faculty: 'UI Designer' },
];

export const MOCK_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'E-Commerce Cart State & Checkout Integration',
    course_title: 'Full Stack Web Development',
    due_date: '2026-03-15',
    status: 'pending',
    max_score: 100,
    score: null,
    submission_url: '',
    feedback: '',
  },
  {
    id: 'asg-2',
    title: 'Secure Authentication Microservice with JWT',
    course_title: 'Full Stack Web Development',
    due_date: '2026-03-02',
    status: 'reviewed',
    max_score: 100,
    score: 95,
    submission_url: 'https://github.com/saikiran/auth-service',
    feedback: 'Excellent separation of concerns and password hashing using bcrypt. Great job on input sanitization!',
  },
  {
    id: 'asg-3',
    title: 'Automated Web Scraper & Data Pipeline',
    course_title: 'Python for Data Automation',
    due_date: '2026-02-14',
    status: 'reviewed',
    max_score: 100,
    score: 98,
    submission_url: 'https://github.com/saikiran/python-pipeline',
    feedback: 'Clean code structure, robust exception handling, and well-documented README.',
  },
];

export const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    cert_number: 'TS-2026-483920',
    title: 'Certificate of Internship Completion',
    program_name: 'Python for Data Automation & AI Pipelines',
    student_name: 'Sai Kiran Reddy',
    issued_at: '2026-02-16',
    issuer: 'William Carie Amudala',
    issuer_title: 'CEO & Founder, ATS Group of Companies',
    verification_url: 'https://www.ateknonsolutions.com/verify-certificate?id=TS-2026-483920',
    grade: 'Grade A+ (Distinction)',
  },
];

export const MOCK_PAYMENTS = [
  {
    id: 'inv-101',
    invoice_number: 'ATS-INV-2026-0142',
    description: 'Full Stack Web Development — 8-Week Professional Internship',
    amount: 6999,
    gst_amount: 1067,
    status: 'paid',
    date: '2026-01-15',
    payment_method: 'UPI / Razorpay',
  },
  {
    id: 'inv-102',
    invoice_number: 'ATS-INV-2025-0891',
    description: 'Python Data Automation — 4-Week Starter Batch',
    amount: 3999,
    gst_amount: 610,
    status: 'paid',
    date: '2025-11-20',
    payment_method: 'Net Banking / Razorpay',
  },
];

export const MOCK_ADMIN_PROFILE = {
  id: 'usr-admin-mukesh',
  full_name: 'Mukesh',
  email: 'mukesh@ateknonsolutions.com',
  role: 'admin',
  status: 'active',
  title: 'Super Admin & Lead Executive',
  department: 'Executive Leadership',
};

export const MOCK_ADMIN_STATS = {
  totalEnquiries: 148,
  todayEnquiries: 6,
  activeStudents: 84,
  activeBatches: 6,
  revenueThisMonth: '₹2,48,500',
  conversionRate: '34.2%',
};

export const MOCK_ENQUIRIES = [
  {
    id: 'enq-1',
    name: 'Ananya Sharma',
    email: 'ananya.s@gmail.com',
    phone: '+91 99887 76655',
    college: 'Aditya Engineering College',
    year: '3rd Year',
    program: 'Eight Weeks (Full Stack Web Development)',
    lead_type: 'student',
    status: 'new',
    message: 'Interested in joining the upcoming offline batch in Rajahmundry. Would like to know batch timings.',
    source_page: '/',
    created_at: '2026-03-09T08:30:00Z',
  },
  {
    id: 'enq-2',
    name: 'Kalyan Chakravarthy',
    email: 'kalyan@apexretail.in',
    phone: '+91 98765 43210',
    company: 'Apex Retail Solutions',
    service_interested: 'Web Development & Google 3-Pack SEO',
    lead_type: 'business',
    status: 'new',
    message: 'We need an e-commerce website with local Google Maps visibility for our store in Rajahmundry.',
    source_page: '/digital-marketing',
    created_at: '2026-03-09T07:15:00Z',
  },
  {
    id: 'enq-3',
    name: 'Ravi Teja Varma',
    email: 'raviteja.v@outlook.com',
    phone: '+91 94401 23456',
    college: 'SRKR Engineering College, Bhimavaram',
    year: 'Final Year',
    program: 'Four Weeks (Foundation Track)',
    lead_type: 'student',
    status: 'replied',
    message: 'Can I attend the Python internship classes online with weekend doubts sessions?',
    source_page: '/#programs',
    created_at: '2026-03-08T14:20:00Z',
  },
  {
    id: 'enq-4',
    name: 'Priyanka Devi',
    email: 'priyanka@deltalabs.io',
    phone: '+91 91234 56789',
    company: 'Delta Health Systems',
    service_interested: 'Cybersecurity Audit & Penetration Testing',
    lead_type: 'business',
    status: 'enrolled',
    message: 'Looking for a comprehensive web application vulnerability assessment before our Q2 launch.',
    source_page: '/it-solutions',
    created_at: '2026-03-07T11:45:00Z',
  },
  {
    id: 'enq-5',
    name: 'Manish Kumar',
    email: 'manish.k99@gmail.com',
    phone: '+91 88990 11223',
    college: 'GIET University, Rajahmundry',
    year: 'Graduate',
    program: 'Eight Weeks (Full Stack Web Development)',
    lead_type: 'student',
    status: 'enrolled',
    message: 'Graduated in 2025. Want intensive live project training and placement mock interviews.',
    source_page: '/',
    created_at: '2026-03-06T16:10:00Z',
  },
];
