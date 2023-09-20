export interface IAddGameInput {
  game: {
    title: string;
    platform: string[];
  };
}

export interface IEditGameInput {
  id: string;
  edits: {
    title: string;
    platform: string[];
  };
}
