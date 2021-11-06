import React from 'react';
import { normalizePoints, normalizePointsKeepAspectRatio } from './normalize';

test('Test normalize points', () => {
    const points = [ [0, 0, 0] , [50, 25, 5], [100, 12.5, 2.5]]
    const normalizedPoints = normalizePoints(points)
    expect(normalizedPoints.every(point => point.every(dimension => dimension >=0 && dimension <= 1))).toBeTruthy()
});

test('Test normalize 2 points', () => {
    const points = [ [0, 0] , [50, 25]]
    const normalizedPoints = normalizePoints(points)
    expect(normalizedPoints.every(point => point.every(dimension => dimension >=0 && dimension <= 1))).toBeTruthy()
});

test('Test normalize points, keep aspect ratio', () => {
    const points = [ [0, 0, 0] , [50, 25, 5], [100, 12.5, 2.5]]
    const normalizedPoints = normalizePointsKeepAspectRatio(points)
    expect(normalizedPoints.every(point => point.every(dimension => dimension >=0 && dimension <= 1))).toBeTruthy()
});
