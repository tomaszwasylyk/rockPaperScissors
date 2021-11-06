import React, { useState, useContext, useRef } from 'react';
import { Canvas, ReactThreeFiber } from 'react-three-fiber'
import * as THREE from 'three'
import { OrbitControls, Line } from '@react-three/drei'
import { AppContext } from '../AppContext'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';


function Box({ position, active, toogleActive }: { position: [number, number, number] | THREE.Vector3, active: boolean, toogleActive: () => void }) {
  const meshElement = useRef<ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>>(null)
  const [hovered, setHover] = useState(false)

  return (
    <mesh
      position={position}
      ref={meshElement}
      scale={active ? [1.2, 1.2, 1.2] : [1, 1, 1]}
      onClick={() => toogleActive()}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry args={[7, 7, 7]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : active ? 'red': 'orange'} />
    </mesh>
  )
}

export default function Preview3D({points, width, height}: {points?: Array<[number, number, number]>, width?: number, height?: number }) {

  const appContext = useContext(AppContext);
  const [activePoints, setActive] = useState([] as Array<number>)

  const toggleActiveBox = (index: number) => {
    return () => {
      if (activePoints.includes(index)) {
        setActive(activePoints.filter(x=> x !== index))
      } else {
        setActive([index, ...activePoints])
      }
    }
  }

  const pointVectors = points?.map(point => new THREE.Vector3().fromArray(point).multiply(new THREE.Vector3(1, -1, -1)))
  const boxes = pointVectors?.map((point, index) => <Box toogleActive={toggleActiveBox(index)} active={activePoints.includes(index)} key={index} position={point} />)
  const trackedPoints = points?.filter((_, index) => activePoints.includes(index))

  return (
    <div style={{display: 'inline-block'}}>
      <Canvas style={{ width: width || appContext.state.preview.width, height: height || appContext.state.preview.height }}
        camera={{ position: [100, 0, 700], far: 2000 }}  onCreated={({ camera }) => camera.lookAt(0, 0, 0)}>
        <ambientLight />
        <OrbitControls />
        <pointLight position={[500, 500, 500]} />
        {
          boxes
        }
        {pointVectors && <>
          <Line points={pointVectors.slice(1, 5).map(point => point.toArray() as [number, number, number])} color="red" />
          <Line points={pointVectors.slice(5, 9).map(point => point.toArray() as [number, number, number])} color="red" />
          <Line points={pointVectors.slice(9, 13).map(point => point.toArray() as [number, number, number])} color="red" />
          <Line points={pointVectors.slice(13, 17).map(point => point.toArray() as [number, number, number])} color="red" />
          <Line points={pointVectors.slice(17, 21).map(point => point.toArray() as [number, number, number])} color="red" />
          <Line points={[pointVectors[17], pointVectors[13], pointVectors[9], pointVectors[5], pointVectors[1], pointVectors[0], pointVectors[17]].map(point => point.toArray() as [number, number, number])} color="red" />
        </>}
      </Canvas>
      <Typography style={{ textAlign: 'center' }}>Click on point to show it's location</Typography>
      {
        trackedPoints && trackedPoints.length > 0 &&
        <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">x</TableCell>
                    <TableCell align="center">Y</TableCell>
                    <TableCell align="center">Z</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trackedPoints.map((point, index) => (
                    <TableRow key={index}>
                      <TableCell align="right">{point[0]}</TableCell>
                      <TableCell align="right">{point[1]}</TableCell>
                      <TableCell align="right">{point[2]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
      }
    </div>
  );
}