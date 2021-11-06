import { Gesture } from './../GestureContext';
import { IAppContextState } from '../AppContext';
import { IPoseContextState } from '../PalmContext';
import { getHandPalmLineX, getHandPalmLineY } from './handInfo';
import { normalizePointsKeepAspectRatio } from './normalize';

export function createPoseUrl(landmarks: Gesture, dimensions: [number, number], lineWidth: number = 10) {
    const canvas = document.createElement('canvas');
    const width = canvas.width = dimensions[0];
    const height = canvas.height = dimensions[1];
    const ctx = canvas.getContext("2d");
    if(ctx){
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.lineWidth = lineWidth;
        const normalizedPoints = normalizePointsKeepAspectRatio(landmarks) as [number, number, number][];
        const scaledPoints = normalizedPoints.map(point => [point[0] * width, point[1] * height, point[2]] as [number, number, number])
        drawSkeleton(ctx, scaledPoints);
        ctx.restore();
    }
    return canvas.toDataURL();
}

export function drawPoseOnCanvas(
    canvasElement: HTMLCanvasElement, boundingBox: {
      topLeft: Array<number>,
      bottomRight: Array<number>
    } | undefined,
    landmarks: Gesture | undefined,
    previewState: IAppContextState["preview"],
    video: HTMLVideoElement | undefined)
  {
    const ctx = canvasElement.getContext('2d');
    
    const videoWidth = previewState.width;
    const videoHeight = previewState.height;
    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;
  
    if (ctx) {
      ctx.clearRect(0, 0, videoWidth, videoHeight);
  
      if (previewState.showInput && video) {
        ctx.save();
        ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
        ctx.restore();
      }
  
      
      if (previewState.showSkeleton && landmarks) {
        ctx.save();
        drawSkeleton(ctx, landmarks);
        ctx.restore();
      }
    
      if (previewState.showKeypoints && landmarks) {
        ctx.save();
        drawKeypoints(ctx, landmarks);
        ctx.restore();
      }
  
      if (previewState.showBoundingBox && boundingBox) {
        ctx.save()
        drawBoundingBox(ctx, boundingBox)
        ctx.restore();
      }
    }
  }
  
  export function drawSkeleton(ctx: CanvasRenderingContext2D, landmarks: Array<[number, number, number]>,){
    drawFinger(ctx, landmarks.slice(1, 5)); // thumb
    drawFinger(ctx, landmarks.slice(5, 9)); // index finger
    drawFinger(ctx, landmarks.slice(9, 13)); // middle finger
    drawFinger(ctx, landmarks.slice(13, 17)); // ring finger
    drawFinger(ctx, landmarks.slice(17, 21)); // pinky
    drawPalm(ctx, landmarks);
    
    const [_1, a, b] = getHandPalmLineY(landmarks)
  
    ctx.fillStyle = "green";

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    const [_2, c, d] = getHandPalmLineX(landmarks)

    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.stroke();
  }


  export function drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();
  }
  
  export function drawBoundingBox(ctx: CanvasRenderingContext2D, boundingBox: IPoseContextState['boundingBox'], scale = 1) {
    const [x1, y1] = boundingBox.topLeft
    const [x2, y2] = boundingBox.bottomRight
    ctx.fillStyle = "red";
  
    ctx.beginPath();
    ctx.moveTo(x1 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y1 * scale);
    ctx.lineTo(x2 * scale, y2 * scale);
    ctx.lineTo(x1 * scale, y2 * scale);
    ctx.lineTo(x1 * scale, y1 * scale);
    ctx.stroke();
  }
  
  export function drawPalm(ctx: CanvasRenderingContext2D, landmarks: number[][], scale = 1) {
    const [x1, y1] = landmarks[17];
    ctx.beginPath();
    ctx.moveTo(x1 * scale, y1 * scale);
    const [x2, y2] = landmarks[13];
    ctx.lineTo(x2 * scale, y2 * scale);
    const [x3, y3] = landmarks[9];
    ctx.lineTo(x3 * scale, y3 * scale);
    const [x4, y4] = landmarks[5];
    ctx.lineTo(x4 * scale, y4 * scale);
    const [x5, y5] = landmarks[1];
    ctx.lineTo(x5 * scale, y5 * scale);
    const [x6, y6] = landmarks[0];
    ctx.lineTo(x6 * scale, y6 * scale);
    
    ctx.lineTo(x1 * scale, y1 * scale)
    ctx.stroke();
  }
  
  export function drawKeypoints(ctx: CanvasRenderingContext2D, keypoints: Array<Array<number>>, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
      const [x, y] = keypoints[i];
      drawPoint(ctx, x * scale, y * scale, 2);
    }
  }
  
  export function drawFinger(ctx: CanvasRenderingContext2D, keypoints: Array<Array<number>>, scale = 1) {
    const [x, y] = keypoints[0];
    ctx.beginPath();
    ctx.moveTo(x * scale, y * scale);
    for (let i = 1; i < keypoints.length; i++) {
      const [x, y] = keypoints[i];
      ctx.lineTo(x * scale, y * scale);
    }
    ctx.stroke();
  }