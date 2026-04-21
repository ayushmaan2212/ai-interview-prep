// Temporary test data for resume, self description, and job description

const testData = {
  resume: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    summary: "Full-stack developer with 5 years of experience in web development",
    experience: [
      {
        company: "Tech Solutions Inc",
        position: "Senior Developer",
        duration: "2021 - Present",
        description: "Led development of microservices architecture, managed team of 5 developers, implemented CI/CD pipelines"
      },
      {
        company: "Digital Innovations Ltd",
        position: "Mid-level Developer",
        duration: "2019 - 2021",
        description: "Developed RESTful APIs using Node.js, built responsive UI with React, optimized database queries"
      },
      {
        company: "StartUp Hub",
        position: "Junior Developer",
        duration: "2018 - 2019",
        description: "Contributed to frontend development, participated in code reviews, learned agile methodologies"
      }
    ],
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Python",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Git",
      "REST APIs"
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        university: "State University",
        year: "2018"
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Cloud Associate Cloud Engineer"
    ]
  },

  selfDescription: `I am a passionate full-stack developer with a strong foundation in modern web technologies. 
  Over the past 5 years, I have successfully delivered scalable applications and led cross-functional teams. 
  I excel at problem-solving, have excellent communication skills, and am committed to continuous learning. 
  My expertise spans from frontend frameworks like React to backend technologies like Node.js and Python. 
  I have a proven track record of improving system performance by 40% through optimization and implementation 
  of best practices. I am looking for opportunities to work on challenging projects that impact millions of users.`,

  jobDescription: {
    title: "Senior Full-Stack Developer",
    company: "Tech Innovators Corp",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000 - $160,000",
    experience: "5+ years",
    description: `We are looking for an experienced Senior Full-Stack Developer to join our growing team. 
    You will be responsible for designing and implementing scalable web applications, mentoring junior developers, 
    and collaborating with product managers to define technical requirements.`,
    responsibilities: [
      "Design and implement scalable microservices using Node.js and Python",
      "Develop responsive user interfaces with React and modern CSS frameworks",
      "Manage databases including MongoDB, PostgreSQL, and Redis",
      "Implement CI/CD pipelines and containerization with Docker and Kubernetes",
      "Mentor junior developers and conduct code reviews",
      "Collaborate with product and design teams to translate requirements into technical solutions",
      "Optimize application performance and ensure high availability"
    ],
    requirements: [
      "5+ years of professional web development experience",
      "Strong proficiency in JavaScript/TypeScript",
      "Experience with React or similar frontend frameworks",
      "Experience with Node.js or similar backend frameworks",
      "Understanding of relational and NoSQL databases",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Strong problem-solving and communication skills",
      "Familiarity with Agile methodologies"
    ],
    niceToHave: [
      "Experience with machine learning or AI integration",
      "Kubernetes or Docker expertise",
      "Experience with GraphQL",
      "Open source contributions"
    ]
  }
};

module.exports = testData;
