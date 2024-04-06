import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Stats from "three/examples/jsm/libs/stats.module";

export default class SceneInit {
  constructor(canvasId) {
    // 场景、相机、渲染器等基本三维场景元素

    this.scene = undefined;

    this.camera = undefined;

    this.renderer = undefined;

    // 视角参数、画布ID

    this.fov = 45;

    this.nearPlane = 1;

    this.farPlane = 1000;

    this.canvasId = canvasId;

    // 时钟、性能监视器、控制器

    this.clock = undefined;

    this.stats = undefined;

    this.controls = undefined;

    // 环境光、方向光

    this.ambientLight = undefined;

    this.directionalLight = undefined;

    // 获取 canvas 的父容器以设置尺寸
    const container = document.getElementById(canvasId).parentElement;

    // 设置相机的宽高比为容器的宽高比
    // this.camera.aspect = container.clientWidth / container.clientHeight;
    // console.log("🚀 ~ SceneInit ~ constructor ~ aspect:", aspect);
    // this.camera.updateProjectionMatrix();

    // 设置渲染器的尺寸与容器一致
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  initialize() {
    // 初始化场景

    this.scene = new THREE.Scene();

    // 初始化相机，设置相机位置

    this.camera = new THREE.PerspectiveCamera(
      this.fov,

      container.clientWidth / container.clientHeight,

      1,

      1000
    );

    this.camera.position.z = 48;

    // 创建画布

    const canvas = document.getElementById(this.canvasId);

    this.renderer = new THREE.WebGLRenderer({
      canvas,

      antialias: true,
    });

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    document.body.appendChild(this.renderer.domElement);

    // 创建时钟、控制器、性能监视器

    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.stats = Stats();

    document.body.appendChild(this.stats.dom);

    // 添加环境光到场景

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    this.ambientLight.castShadow = true;

    this.scene.add(this.ambientLight);

    // 添加方向光到场景

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    this.directionalLight.position.set(0, 32, 64);

    this.scene.add(this.directionalLight);

    // 监听窗口大小变化以调整渲染效果

    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  // 动画函数：循环渲染场景、更新性能监视器和控制器

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.render();

    this.stats.update();

    this.controls.update();
  }

  render() {
    // 渲染场景和相机

    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    // 获取 canvas 的父容器以更新尺寸
    const container = this.renderer.domElement.parentElement;
    console.log("🚀 ~ SceneInit ~ onWindowResize ~ container:", container);

    // 更新相机的宽高比为容器的宽高比
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();

    // 更新渲染器的尺寸为容器的尺寸
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}
