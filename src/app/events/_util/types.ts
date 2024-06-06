import { Friend } from "~/app/friends/_util/types";

export type Event = {
  date: Date;
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    participants: {
      id: string;
      friend?: Friend | null;
    }[];
}