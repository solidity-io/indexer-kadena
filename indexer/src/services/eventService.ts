import { Transaction, BulkCreateOptions } from "sequelize";
import Event, { EventAttributes } from "../models/event";

export class EventService {
  /**
   * Saves or updates a event in the database.
   * If the event already exists (based on primary key or unique constraints), it updates the existing event.
   * Otherwise, it creates a new event entry.
   *
   * @param eventData The event data to save or update.
   * @returns A Promise containing the event data as saved in the database
   * and a boolean indicating whether a new event was created (true) or an existing event was updated (false).
   */
  async save(eventData: EventAttributes): Promise<[EventAttributes, boolean]> {
    try {
      const parsedData = {
        ...eventData,
      };

      const [event, created] = await Event.upsert(parsedData);
      return [event.toJSON(), created as boolean];
    } catch (error) {
      console.error("Error saving event to database:", error);
      throw error;
    }
  }

  /**
   * Saves an array of events to the database.
   * This method inserts new events and does not update existing ones.
   * To update existing events, you would need to implement additional logic.
   *
   * @param eventsData Array of event data to be saved.
   * @param options Optional bulk create options.
   * @returns A Promise that resolves when the operation is complete.
   */
  async saveMany(
    eventsData: EventAttributes[],
    options?: Transaction
  ): Promise<void> {
    try {
      await Event.bulkCreate(eventsData, {
        transaction: options,
      });
    } catch (error) {
      console.error("Error saving events to database:", error);
      throw error;
    }
  }
}

export const eventService = new EventService();
