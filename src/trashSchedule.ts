import fs from 'fs';

export const getTrashSchedule = (): Record<string, number[]> => {
  const rawData = fs.readFileSync('json/trashSchedule.json', 'utf8');
  return JSON.parse(rawData);
};