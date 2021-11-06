// @ts-ignore
import KNN from 'ml-knn'
import { GestureInfo } from '../GestureContext';
import { normalizePoints } from '../utils/normalize';

export default class GestureClassifier {

  knn: any;

  constructor(gestures_dataset: { [key: string]: GestureInfo }) {
    const X = [];
    const y = [];
    
    for (const label in gestures_dataset) {
      const examples_for_label = gestures_dataset[label].gestures
      for (const gesture_points of examples_for_label) {
        const scaled_points = normalizePoints(gesture_points)
        const gesture_dimensions = ([] as number[]).concat(...scaled_points);
        X.push(gesture_dimensions)
        y.push(label)
      }
    }
    this.knn = new KNN(X, y, {k:3});
  }

  predict(gesture_points: Array<[number, number, number]>) {
    const scaled_points = normalizePoints(gesture_points)
    const gesture_dimensions = ([] as number[]).concat(...scaled_points);
    return this.knn.predict(gesture_dimensions)
  }

}

