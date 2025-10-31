export default interface BadHabit {
  id?: number; // Auto-incremented ID
  name: string;
  datetime: number;
  description?: string;
  location?: string;
  trigger?: string;
  notes?: string;
}
