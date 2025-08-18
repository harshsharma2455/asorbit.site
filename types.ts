
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  detailedDescription: string;
  keyFeatures: string[];
  results: string;
}