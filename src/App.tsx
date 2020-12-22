import { useEffect, useRef, useState, useCallback } from 'react';
import './App.scss';
import { Canvas } from './components';
import * as BABYLON from 'babylonjs';

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** 绘制 */
  const createScene = useCallback((engine: BABYLON.Engine) => {
    const canvas = canvasRef.current;

    /** 场景 */
    const scene = new BABYLON.Scene(engine);

    /** 相机👀 */
    var camera = new BABYLON.ArcRotateCamera(
      'Camera',
      Math.PI / 4,
      Math.PI / 4,
      100,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);

    /** 光照 */
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);

    /** 脑壳大小 */
    const HEAD_SIZE = [8, 8, 8];
    /** 身体大小 */
    const BODY_SIZE = [8, 12, 4];
    /** jio 大小 */
    const FOOT_SIZE = [4, 6, 4];

    /** jio Y 位置 */
    const footPositionY = FOOT_SIZE[1] / 2;
    /** 身体 Y 位置 */
    const bodyPositionY = FOOT_SIZE[1] + BODY_SIZE[1] / 2;
    /** 脑壳 Y 位置 */
    const headPositionY = FOOT_SIZE[1] + BODY_SIZE[1] + HEAD_SIZE[1] / 2;

    /** 脑壳 */
    const head = BABYLON.MeshBuilder.CreateBox('head', {
      width: HEAD_SIZE[0],
      height: HEAD_SIZE[1],
      depth: HEAD_SIZE[2],
    });
    head.position.y = headPositionY;

    /** 身体 */
    const body = BABYLON.MeshBuilder.CreateBox('body', {
      width: BODY_SIZE[0],
      height: BODY_SIZE[1],
      depth: BODY_SIZE[2],
    });
    body.position.y = bodyPositionY;

    /** 左前 jio */
    const leftFrontFoot = BABYLON.MeshBuilder.CreateBox('leftFrontFoot', {
      width: FOOT_SIZE[0],
      height: FOOT_SIZE[1],
      depth: FOOT_SIZE[2],
    });
    leftFrontFoot.position.y = footPositionY;
    leftFrontFoot.position.x = BODY_SIZE[0] - FOOT_SIZE[0] - FOOT_SIZE[0] / 2;
    leftFrontFoot.position.z = BODY_SIZE[2] / 2 + FOOT_SIZE[2] / 2;

    /** 右前 jio */
    const rightFrontFoot = leftFrontFoot.createInstance('rightFrontFoot');
    rightFrontFoot.position.x = -leftFrontFoot.position.x;

    /** 左后 jio */
    const leftBackFoot = leftFrontFoot.createInstance('leftBackFoot');
    leftBackFoot.position.z = -leftFrontFoot.position.z;

    /** 右后 jio */
    const rightBackFoot = leftFrontFoot.createInstance('rightBackFoot');
    rightBackFoot.position.x = -leftFrontFoot.position.x;
    rightBackFoot.position.z = -leftFrontFoot.position.z;

    /** 地板 */
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 });

    return scene;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);

    const scene = createScene(engine);

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
      scene.render();
    });
    // Watch for browser/canvas resize events
    window.addEventListener('resize', function () {
      engine.resize();
    });
  }, [createScene]);

  return (
    <div className="App">
      <Canvas ref={canvasRef} />
    </div>
  );
}

export default App;
