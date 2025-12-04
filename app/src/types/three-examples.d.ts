declare module "three/examples/jsm/loaders/GLTFLoader" {
  import * as THREE from "three";

  export class GLTF {
    scene: THREE.Object3D;
    scenes: THREE.Object3D[];
    cameras: THREE.Camera[];
    animations: THREE.AnimationClip[];
  }

  export class GLTFLoader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }
}

declare module "three/examples/jsm/controls/OrbitControls" {
  import * as THREE from "three";

  export class OrbitControls extends THREE.EventDispatcher {
    constructor(camera: THREE.Camera, domElement?: HTMLElement);
    object: THREE.Camera;
    domElement: HTMLElement | undefined;
    enabled: boolean;
    target: THREE.Vector3;
    enableDamping: boolean;
    dampingFactor: number;
    screenSpacePanning: boolean;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    keys: { LEFT: string; UP: string; RIGHT: string; BOTTOM: string };
    mouseButtons: { LEFT: number; MIDDLE: number; RIGHT: number };
    touches: { ONE: THREE.TOUCH; TWO: THREE.TOUCH };
    update(): void;
    dispose(): void;
    reset(): void;
  }
}
