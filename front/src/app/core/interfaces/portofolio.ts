export interface Portofolio {
  id: number;
  title: string;
  description: string;
  image_url: string;
  link_url?: string;
  technologies?: string[];
  year?: number;
}
