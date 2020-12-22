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
      -Math.PI / 4,
      Math.PI / 3,
      100,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );
    camera.attachControl(canvas, true);

    /** 光照 */
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);

    /** 苦力怕材质 */
    const creeperMaterial = new BABYLON.StandardMaterial('creeperMaterial', scene);
    creeperMaterial.diffuseTexture = new BABYLON.Texture(
      'img/creeper.png',
      scene,
      true,
      undefined,
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );
    /** 地面材质 */
    const dirtMaterial = new BABYLON.StandardMaterial('dirtMaterial', scene);
    dirtMaterial.diffuseTexture = new BABYLON.Texture(
      'img/dirt.png',
      scene,
      true,
      undefined,
      BABYLON.Texture.NEAREST_SAMPLINGMODE
    );

    /** 将原始像素位置映射为 UV 比例，从 1 计数 */
    const mapCreeperMaterial = (x1: number, y1: number, x2: number, y2: number) => {
      const WIDTH = 64;
      const HEIGHT = 32;
      return new BABYLON.Vector4((x1 - 1) / WIDTH, (y1 - 1) / HEIGHT, x2 / WIDTH, y2 / HEIGHT);
    };

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
      faceUV: [
        // 背面
        mapCreeperMaterial(25, 17, 32, 24),
        // 正面
        mapCreeperMaterial(9, 17, 16, 24),
        // 左侧
        mapCreeperMaterial(17, 17, 24, 24),
        // 右侧
        mapCreeperMaterial(1, 17, 8, 24),
        // 顶部
        mapCreeperMaterial(9, 25, 16, 32),
        // 底部
        mapCreeperMaterial(17, 25, 24, 32),
      ],
      wrap: true,
    });
    head.position.y = headPositionY;
    head.material = creeperMaterial;

    /** 脑壳动画 */
    const headAnimation = new BABYLON.Animation(
      'headAnimation',
      'rotation.y',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    headAnimation.setKeys([
      { frame: 0, value: 0 },
      { frame: 15, value: 0 },
      { frame: 30, value: Math.PI / 6 },
      { frame: 45, value: Math.PI / 6 },
      { frame: 75, value: -Math.PI / 6 },
      { frame: 90, value: -Math.PI / 6 },
      { frame: 105, value: 0 },
    ]);
    head.animations = [headAnimation];
    scene.beginAnimation(head, 0, 105, true);

    /** 身体 */
    const body = BABYLON.MeshBuilder.CreateBox('body', {
      width: BODY_SIZE[0],
      height: BODY_SIZE[1],
      depth: BODY_SIZE[2],
      faceUV: [
        // 背面
        mapCreeperMaterial(33, 1, 40, 12),
        // 正面
        mapCreeperMaterial(21, 1, 28, 12),
        // 左侧
        mapCreeperMaterial(29, 1, 32, 12),
        // 右侧
        mapCreeperMaterial(17, 1, 20, 12),
        // 顶部
        mapCreeperMaterial(21, 13, 28, 16),
        // 底部
        mapCreeperMaterial(29, 13, 36, 16),
      ],
      wrap: true,
    });
    body.position.y = bodyPositionY;
    body.material = creeperMaterial;

    /** 左前 jio */
    const leftFrontFoot = BABYLON.MeshBuilder.CreateBox('leftFrontFoot', {
      width: FOOT_SIZE[0],
      height: FOOT_SIZE[1],
      depth: FOOT_SIZE[2],
      faceUV: [
        // 背面
        mapCreeperMaterial(13, 7, 16, 12),
        // 正面
        mapCreeperMaterial(5, 7, 8, 12),
        // 左侧
        mapCreeperMaterial(1, 7, 4, 12),
        // 右侧
        mapCreeperMaterial(9, 7, 12, 12),
        // 顶部
        mapCreeperMaterial(5, 13, 8, 16),
        // 底部
        mapCreeperMaterial(9, 13, 12, 16),
      ],
      wrap: true,
    });
    leftFrontFoot.position.y = footPositionY;
    leftFrontFoot.position.x = BODY_SIZE[0] - FOOT_SIZE[0] - FOOT_SIZE[0] / 2;
    leftFrontFoot.position.z = BODY_SIZE[2] / 2 + FOOT_SIZE[2] / 2;
    leftFrontFoot.material = creeperMaterial;

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

    /** jio 动画 */
    const footAnimation = new BABYLON.Animation(
      'headAnimation',
      'rotation.x',
      30,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );
    footAnimation.setKeys([
      { frame: 0, value: 0 },
      { frame: 5, value: Math.PI / 6 },
      { frame: 20, value: -Math.PI / 6 },
      { frame: 25, value: 0 },
      { frame: 30, value: Math.PI / 6 },
      { frame: 45, value: -Math.PI / 6 },
      { frame: 50, value: 0 },
    ]);
    leftFrontFoot.animations = [footAnimation];
    rightFrontFoot.animations = [footAnimation];
    leftBackFoot.animations = [footAnimation];
    rightBackFoot.animations = [footAnimation];
    scene.beginAnimation(leftFrontFoot, 0, 25, true);
    scene.beginAnimation(rightFrontFoot, 10, 35, true);
    scene.beginAnimation(leftBackFoot, 10, 35, true);
    scene.beginAnimation(rightBackFoot, 0, 25, true);

    /** 地板 */
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 });
    ground.material = dirtMaterial;

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
