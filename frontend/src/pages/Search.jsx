import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Search() {
  const type = "apartment";
  // render apartment model
  useEffect(() => {
    if (type === "apartment") {
      const canvas = document.getElementById("apartmentModel");
      // 先初始化 renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });
      // 然后设置大小
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 更柔和的阴影

      const scene = new THREE.Scene();
      // 设置场景背景颜色为蓝色
      scene.background = new THREE.Color(0x87ceeb); // 例如: 天蓝色
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.z = 0;
      camera.position.y = 3200;
      camera.position.x = 2000;
      camera.rotateY(THREE.MathUtils.degToRad(90));
      camera.rotateX(THREE.MathUtils.degToRad(-20));

      const loader = new GLTFLoader();
      loader.load("/models/apartment_model/scene.gltf", (model) => {
        model.scene.traverse(function (object) {
          if (object.isMesh) object.castShadow = true;
        });
        scene.add(model.scene);
      });

      // 创建地板
      const floorGeometry = new THREE.PlaneGeometry(50000, 50000); // 根据需要调整大小
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080, // 地板颜色，可以根据需要调整
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2; // 将地板旋转至水平位置
      floor.position.y = 0; // 调整地板的高度（Y轴位置）
      scene.add(floor);

      const light = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(light);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 500, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 512;
      directionalLight.shadow.mapSize.height = 512;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 5000;
      scene.add(directionalLight);
      // 定义方向光的轨迹半径
      const radius = 500;
      // 定义轨迹的中心点
      const center = new THREE.Vector3(0, 0, 0);

      const animate = function () {
        requestAnimationFrame(animate);
        // 使用时间作为动画的参数
        const time = Date.now() * 0.0005;
        // 计算方向光新的位置
        directionalLight.position.x = center.x + Math.sin(time) * radius;
        directionalLight.position.y = center.y + Math.cos(time) * radius;
        directionalLight.position.z = center.z + Math.sin(time) * radius;
        // 使方向光始终指向场景的中心点
        directionalLight.lookAt(center);
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        scene.remove(model.scene);
        geometry.dispose();
        material.dispose();
      };
    }
  }, []);
  // render house model
  useEffect(() => {
    if (type === "house") {
      const canvas = document.getElementById("houseModel");
      // 先初始化 renderer
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
      });

      // 然后设置大小
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 更柔和的阴影

      const scene = new THREE.Scene();
      // 设置场景背景颜色为蓝色
      scene.background = new THREE.Color(0x87ceeb); // 例如: 天蓝色
      const camera = new THREE.PerspectiveCamera(
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      camera.position.z = 0;
      camera.position.y = 4;
      camera.position.x = 7;
      camera.rotateY(THREE.MathUtils.degToRad(90));

      const loader = new GLTFLoader();
      loader.load("/models/house_model/scene.gltf", (model) => {
        model.scene.traverse(function (object) {
          if (object.isMesh) object.castShadow = true;
        });
        scene.add(model.scene);
      });

      // 创建地板
      const floorGeometry = new THREE.PlaneGeometry(50000, 50000); // 根据需要调整大小
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080, // 地板颜色，可以根据需要调整
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2; // 将地板旋转至水平位置
      floor.position.y = 0; // 调整地板的高度（Y轴位置）
      scene.add(floor);

      const light = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(light);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 500, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 512;
      directionalLight.shadow.mapSize.height = 512;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 5000;
      scene.add(directionalLight);
      // 定义方向光的轨迹半径
      const radius = 500;
      // 定义轨迹的中心点
      const center = new THREE.Vector3(0, 0, 0);

      const animate = function () {
        requestAnimationFrame(animate);
        // 使用时间作为动画的参数
        const time = Date.now() * 0.0005;
        // 计算方向光新的位置
        directionalLight.position.x = center.x + Math.sin(time) * radius;
        directionalLight.position.y = center.y + Math.cos(time) * radius;
        directionalLight.position.z = center.z + Math.sin(time) * radius;
        // 使方向光始终指向场景的中心点
        directionalLight.lookAt(center);
        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        scene.remove(model.scene);
        geometry.dispose();
        material.dispose();
      };
    }
  }, []);

  return (
    <div className="bg-[#090831] flex max-w-[100vw] min-h-[100vh] text-[#f5f5f5] font-embed">
      <div className="w-[100%]">
        <canvas
          id="apartmentModel"
          className="w-full h-[40vh]"
          hidden={type === "house"}
        />
        <canvas
          id="houseModel"
          className="w-full h-[40vh]"
          hidden={type === "apartment"}
        />
      </div>
    </div>
  );
}
