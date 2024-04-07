import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import React Router
import { useNavigate } from "react-router-dom";

// import React icon
import { MdOutlineLocationCity } from "react-icons/md";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBath } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { IoMdPricetags } from "react-icons/io";
import { BsFillCarFrontFill } from "react-icons/bs";
import { MdOutlineLiving } from "react-icons/md";

// import React Redux
import { useSelector } from "react-redux";

export default function Search() {
  const { bedroom, bathroom, parking, furnished, type } = useSelector(
    (state) => state.searchTerm
  );
  const navigate = useNavigate();
  const [listings, setListings] = useState();

  // render models
  useEffect(() => {
    if (type === "apartment") {
      const canvas = document.getElementById("model");
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
        // scene.remove(model.scene);
        // geometry.dispose();
        // material.dispose();
      };
    } else if (type === "house") {
      const canvas = document.getElementById("model");
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
        // scene.remove(model.scene);
        // geometry.dispose();
        // material.dispose();
      };
    }
  }, [type]);
  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/listing/search-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bedroom,
          bathroom,
          parking,
          furnished,
          type,
        }),
      });
      const data = await res.json();
      setListings(data);
    };
    fetchListings();
  }, []);

  const setPriceForm = (u_price) => {
    let output = [];
    let count = 0;
    for (let i = u_price.length - 1; i >= 0; i--) {
      if (count % 3 === 0) {
        output.unshift("," + String(u_price.slice(-3)));
        u_price = u_price.slice(0, i - 2);
      }
      count += 1;
    }
    output[0] = output[0].slice(1);
    return output.join("");
  };

  return (
    <div className="bg-[#090831] flex flex-col max-w-[100vw] min-h-[100vh] text-[#f5f5f5] font-embed">
      <div className="w-[100%]">
        <canvas id="model" className="w-full h-[50vh]" />
      </div>
      {/* search results */}
      <div className="grid grid-cols-4 max-w-[95%] mx-auto gap-4 pt-[50px]">
        {listings &&
          listings.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/listing/${item._id}`)}
              className="hover:-translate-y-3 duration-100 flex flex-col min-h-[400px] border-2 border-[#333333] rounded-lg bg-[#e5f0f5] text-[#333333] overflow-hidden font-embed"
            >
              {/* cover image */}
              <img src={item.imageUrls[0]} alt="" className="w-full h-[65%]" />
              {/* listing card */}
              <div className="flex flex-1 flex-col justify-center items-center">
                <h1 className="text-center">{item.title}</h1>
                {/* listing card > info */}
                <div className="w-full flex gap-2">
                  {/* listing card > prices */}
                  {item.offer === true ? (
                    // if offer
                    <div className="text-[15px] w-[35%] flex flex-col justify-center items-center">
                      <div className="flex flex-col justify-center items-center">
                        <h1>sell</h1>
                        <h1 className="flex items-center">
                          <FaDollarSign />
                          {setPriceForm(item.price)}
                          {item.purpose === "rent" ? (
                            <span className="text-[10px] font-bold ml-[3px]">
                              per month
                            </span>
                          ) : (
                            ""
                          )}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <h1>sell</h1>
                        <h1 className="flex items-center">
                          <FaDollarSign />
                          {setPriceForm(item.price)}
                          {item.purpose === "rent" ? (
                            <span className="text-[10px] font-bold ml-[3px]">
                              per month
                            </span>
                          ) : (
                            ""
                          )}
                        </h1>
                      </div>
                    </div>
                  ) : (
                    // if no offer
                    <div className="text-[19px] w-[35%] flex flex-col justify-center items-center">
                      <h1>sell</h1>
                      <h1 className="flex items-center">
                        <FaDollarSign />
                        {setPriceForm(item.price)}
                        {item.purpose === "rent" ? (
                          <span className="text-[10px] font-bold ml-[3px]">
                            per month
                          </span>
                        ) : (
                          ""
                        )}
                      </h1>
                    </div>
                  )}
                  {/* listing card > tags */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <MdOutlineBedroomParent />
                      {item.bedroom}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <FaBath />
                      {item.bathroom}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <BsFillCarFrontFill />
                      {item.parking}
                    </div>
                    <div className="flex justify-between items-center text-[25px] px-2">
                      <MdOutlineLiving />
                      {item.furnished ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
