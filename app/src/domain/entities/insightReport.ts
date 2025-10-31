export default interface InsightReport {
  id: number; // Auto-incremented ID
  title: string;
  content: string;
  createdAt: Date;
  notes?: string;
}
