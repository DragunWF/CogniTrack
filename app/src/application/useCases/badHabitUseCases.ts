import BadHabit from "../../domain/entities/badHabit";
import BadHabitRepository from "../../infrastructure/database/badHabitRepository";

export class CreateBadHabitUseCase {
  async execute(badHabitData: BadHabit): Promise<number> {
    const badHabitRepository = new BadHabitRepository();
    const newBadHabitId = await badHabitRepository.create(badHabitData);
    return newBadHabitId;
  }
}

export class UpdateBadHabitUseCase {
  async execute(badHabitData: BadHabit): Promise<boolean> {
    const badHabitRepository = new BadHabitRepository();
    const success = await badHabitRepository.update(badHabitData);
    return success;
  }
}

export class DeleteBadHabitUseCase {
  async execute(badHabitId: number): Promise<void> {
    const badHabitRepository = new BadHabitRepository();
    await badHabitRepository.delete(badHabitId);
  }
}

export class GetAllBadHabitsUseCase {
  async execute(): Promise<BadHabit[]> {
    const badHabitRepository = new BadHabitRepository();
    const badHabits = await badHabitRepository.getAll();
    return badHabits;
  }
}

export class GetAllTodayBadHabitsUseCase {
  async execute(): Promise<BadHabit[]> {
    const badHabitRepository = new BadHabitRepository();
    const badHabitsToday = await badHabitRepository.getAllToday();
    return badHabitsToday;
  }
}

export class GetBadHabitByIdUseCase {
  async execute(badHabitId: number): Promise<BadHabit | null> {
    const badHabitRepository = new BadHabitRepository();
    const badHabit = await badHabitRepository.getById(badHabitId);
    return badHabit;
  }
}

export class ValidatorBadHabitUseCase {
  async executeIsUnique(name: string): Promise<boolean> {
    // DEPRECATED: Uniqueness should not be a constraint for bad habits
    const badHabitRepository = new BadHabitRepository();
    const isUnique = await badHabitRepository.isNameUnique(name);
    return isUnique;
  }
}
