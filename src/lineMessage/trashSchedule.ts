import fs from 'fs';

//
export const getTrashSchedule = (): Record<string, number[]> => {
  const rawData = fs.readFileSync('src/json/trashCollectionSchedule.json', 'utf8');
  return JSON.parse(rawData);
};