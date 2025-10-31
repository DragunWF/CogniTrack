import BadHabit from "../../domain/entities/badHabit";

export default interface IBadHabitRepository {
  create(badHabit: BadHabit): Promise<number>;
  update(badHabit: BadHabit): Promise<boolean>;
  delete(id: number): Promise<void>;
  getAll(): Promise<BadHabit[]>;
  getById(id: number): Promise<BadHabit | null>;
}
