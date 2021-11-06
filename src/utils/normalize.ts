type MinMaxValue = {
    min: number;
    max: number;
}

export function normalizePoints(gesture_points: Array<Array<number>>) {
    if (gesture_points.length < 2) {
        return gesture_points
    }

    const dimensionSize = gesture_points[0].length

    const minMaxValue = getMinMaxValues(gesture_points, dimensionSize);
    const diffrences = getDimensionsMaxDiffrences(minMaxValue);

    const result = []
    for (let pointIndex = 0; pointIndex < gesture_points.length; pointIndex++) {
        const scaled_point = []
        for (let dimensionIndex = 0; dimensionIndex < dimensionSize; dimensionIndex++) {
            let scaled_value = (gesture_points[pointIndex][dimensionIndex] - minMaxValue[dimensionIndex].min) / diffrences[dimensionIndex]
            scaled_point.push(scaled_value)
        }
        result.push(scaled_point)
    }

    return result
}

function getDimensionsMaxDiffrences(minMaxValues: Array<MinMaxValue>){
    let diffrences = []
    for (let dimensionIndex = 0; dimensionIndex < minMaxValues.length; dimensionIndex++) {
        diffrences.push(minMaxValues[dimensionIndex].max - minMaxValues[dimensionIndex].min)
    }
    return diffrences;
}

export function normalizePointsKeepAspectRatio(gesture_points: Array<Array<number>>){
    if (gesture_points.length < 2) {
        return gesture_points
    }
    const dimensionSize = gesture_points[0].length
    const minMaxValue = getMinMaxValues(gesture_points, dimensionSize);
    const diffrences = getDimensionsMaxDiffrences(minMaxValue);
    const maxDiffrence = Math.max(...diffrences);


    const result = []
    for (let pointIndex = 0; pointIndex < gesture_points.length; pointIndex++) {
        const scaled_point = []
        for (let dimensionIndex = 0; dimensionIndex < dimensionSize; dimensionIndex++) {
            let scaled_value = (gesture_points[pointIndex][dimensionIndex] - minMaxValue[dimensionIndex].min) / maxDiffrence
            scaled_point.push(scaled_value)
        }
        result.push(scaled_point)
    }

    return result
}


function getMinMaxValues(array: Array<Array<number>>, dimensionSize: number){    
    let minMaxValues = []
    for (let dimensionIndex = 0; dimensionIndex < dimensionSize; dimensionIndex++) {
        minMaxValues.push({min: array[0][dimensionIndex], max: array[0][dimensionIndex]})
    }

    for (let pointIndex = 1; pointIndex < array.length; pointIndex++) {
        for (let dimensionIndex = 0; dimensionIndex < dimensionSize; dimensionIndex++) {
            const minValue = Math.min(array[pointIndex][dimensionIndex], minMaxValues[dimensionIndex].min)
            const maxValue = Math.max(array[pointIndex][dimensionIndex], minMaxValues[dimensionIndex].max)
            minMaxValues[dimensionIndex] = {min: minValue, max: maxValue}
        }
    }
    return minMaxValues
}

