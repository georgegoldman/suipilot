"use client";

import { useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { HelpCircle } from "lucide-react";
import { CardWrapper } from "./card-wrapper";
import { motion } from "framer-motion";
import * as THREE from "three";

const ORDERBOOK_DATA = [
  { name: "1", value: 38 },
  { name: "2", value: 32 },
  { name: "3", value: 56 },
  { name: "4", value: 34 },
  { name: "5", value: 44 },
  { name: "6", value: 36 },
  { name: "7", value: 48 },
  { name: "8", value: 30 },
];

function ThreeGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const geometry = new THREE.IcosahedronGeometry(1.0, 2);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x2a8dff,
      transparent: true,
      opacity: 0.6,
    });
    const sphereLines = new THREE.LineSegments(wireframe, lineMaterial);
    globeGroup.add(sphereLines);

    const innerGeo = new THREE.IcosahedronGeometry(0.98, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x2a8dff,
      transparent: true,
      opacity: 0.15,
    });

    const ringGeo1 = new THREE.TorusGeometry(1.3, 0.005, 16, 100);
    const ring1 = new THREE.Line(new THREE.WireframeGeometry(ringGeo1), ringMaterial);
    ring1.rotation.x = 1.7;
    ring1.rotation.y = 0.5;
    globeGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.3, 0.005, 16, 100);
    const ring2 = new THREE.Line(new THREE.WireframeGeometry(ringGeo2), ringMaterial);
    ring2.rotation.x = 1.7;
    ring2.rotation.y = -0.5;
    globeGroup.add(ring2);

    globeGroup.rotation.z = 0.2;
    globeGroup.rotation.x = 0.3;

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      sphereLines.rotation.y += 0.0015;
      innerMesh.rotation.y += 0.0015;
      ring1.rotation.z -= 0.001;
      ring2.rotation.z += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    const container = mountRef.current;
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      innerGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      lineMaterial.dispose();
      innerMat.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="size-full" />;
}

function GlassTorus() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 6.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(0.7, 0.25, 64, 128);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 1.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      attenuationColor: new THREE.Color(0xffffff),
      attenuationDistance: 0.5,
    });

    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);
    torus.rotation.x = 1.8;
    torus.rotation.y = 0.4;
    torus.position.y = 0.1;

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(3, 5, 8);
    scene.add(dirLight);

    const orangeLight = new THREE.PointLight(0x2a8dff, 3, 10);
    orangeLight.position.set(-3, -2, 4);
    scene.add(orangeLight);

    const blueLight = new THREE.PointLight(0x4444ff, 0.8, 10);
    blueLight.position.set(3, 3, -5);
    scene.add(blueLight);

    const updateScale = () => {
      if (window.innerWidth < 768) {
        torus.scale.set(0.65, 0.65, 0.65);
      } else {
        torus.scale.set(1, 1, 1);
      }
    };
    updateScale();

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      torus.rotation.z += 0.002;
      torus.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const container = mountRef.current;
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateScale();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="size-full" />;
}

export function Features() {
  return (
    <section id="features" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-[3.5rem] font-medium text-white tracking-tight leading-[1.1]">
            Powerful Features for Smarter
            <br />
            Trading on Sui
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1200px] mx-auto">
          {/* Card 1: DeepBook Market Data */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-7 h-[480px]"
          >
            <CardWrapper glowPosition="top-right">
              <div className="p-10 flex flex-col h-full relative">
                <div className="flex justify-between items-start mb-6 z-10">
                  <div>
                    <div className="text-sm text-gray-500 mb-1 font-medium">
                      DeepBook Volume
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-white tracking-tight">
                        59.8K
                      </span>
                      <span className="text-[#4ADE80] text-sm font-medium">
                        +10.7%
                      </span>
                    </div>
                  </div>
                  <HelpCircle
                    size={20}
                    className="text-gray-600 cursor-pointer hover:text-white transition-colors"
                  />
                </div>

                <div className="flex-1 w-full min-h-[180px] relative z-10 -ml-5 -mr-5">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ORDERBOOK_DATA}>
                      <defs>
                        <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fff" stopOpacity={0.08} />
                          <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        horizontal={true}
                        stroke="rgba(255,255,255,0.08)"
                        strokeDasharray="0"
                      />
                      <XAxis dataKey="name" hide />
                      <YAxis hide domain={[20, 65]} tickCount={5} />
                      <text x="20" y="70" fill="#666" fontSize="10">60K</text>
                      <text x="20" y="140" fill="#666" fontSize="10">40K</text>
                      <text x="20" y="210" fill="#666" fontSize="10">20K</text>
                      <Area
                        type="linear"
                        dataKey="value"
                        stroke="#888"
                        strokeWidth={1.5}
                        strokeOpacity={0.8}
                        fillOpacity={1}
                        fill="url(#trafficGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-auto pt-4 z-10">
                  <h3 className="text-xl font-normal text-white mb-3">
                    Real-Time Orderbook Analysis
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md font-light">
                    Live DeepBook orderbook reads for price discovery. Simulated
                    fills before execution with transparent pricing and slippage
                    estimates.
                  </p>
                </div>
              </div>
            </CardWrapper>
          </motion.div>

          {/* Card 2: Intent Parsing Globe */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-5 h-[480px]"
          >
            <CardWrapper glowPosition="bottom-left">
              <div className="p-10 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center -top-40">
                  <ThreeGlobe />
                </div>
                <div className="mt-auto relative z-10">
                  <h3 className="text-xl font-normal text-white mb-3">
                    AI Intent Parsing
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    Express goals in plain English. Our AI parses your intent
                    into a strict, deterministic trade specification.
                  </p>
                </div>
              </div>
            </CardWrapper>
          </motion.div>

          {/* Card 3: Privacy Torus */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-5 h-[480px]"
          >
            <CardWrapper glowPosition="top-right">
              <div className="p-10 flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center -mt-40">
                  <div className="size-full">
                    <GlassTorus />
                  </div>
                </div>
                <div className="mt-auto relative z-10">
                  <h3 className="text-xl font-normal text-white mb-3">
                    Privacy-First Design
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    Preferences encrypted with Seal. Intent history stored on
                    Walrus. Your trading strategy stays private by default.
                  </p>
                </div>
              </div>
            </CardWrapper>
          </motion.div>

          {/* Card 4: Verifiable Execution Chat */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-7 h-[480px]"
          >
            <CardWrapper glowPosition="bottom-left">
              <div className="p-10 flex flex-col h-full relative">
                <div className="flex-1 relative w-full max-w-lg mx-auto mt-12">
                  <div className="absolute top-0 left-0 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="bg-[#181818] border border-white/5 text-gray-400 text-xs py-3 px-5 rounded-2xl rounded-tl-sm shadow-xl max-w-[280px]">
                      <p className="leading-relaxed">
                        Swap 100 USDC for SUI with max 0.3% slippage
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-12 left-12 z-20 animate-in fade-in zoom-in duration-700 delay-500">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#2A8DFF"
                      className="transform -rotate-12 drop-shadow-md"
                    >
                      <path
                        d="M3 3L10 21L12 13L21 11L3 3Z"
                        stroke="#2A8DFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute left-4 top-4 bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                      Trader
                    </div>
                  </div>

                  <div className="absolute top-32 right-0 flex flex-col items-end animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="bg-[#181818] border border-white/5 text-gray-400 text-xs py-3 px-5 rounded-2xl rounded-tr-sm shadow-xl mb-2">
                      <p>
                        Constraints passed. Executing on DeepBook &mdash; receipt
                        stored on Walrus.
                      </p>
                    </div>
                    <div className="text-[10px] text-gray-600 font-medium pr-1">
                      Verified
                    </div>
                  </div>

                  <div className="absolute top-[170px] right-24 z-20 animate-in fade-in zoom-in duration-700 delay-700">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#1F1F1F"
                      className="transform -rotate-12 drop-shadow-md"
                    >
                      <path
                        d="M3 3L10 21L12 13L21 11L3 3Z"
                        stroke="#444"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="absolute left-4 top-4 bg-[#1F1F1F] border border-white/10 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg">
                      SuiCopilot
                    </div>
                  </div>
                </div>

                <div className="mt-auto relative z-10 pt-6">
                  <h3 className="text-xl font-normal text-white mb-3">
                    Verifiable Execution Receipts
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-md font-light">
                    Every trade produces a best-execution receipt with expected
                    vs actual price, slippage, and transaction digest. Not
                    &ldquo;trust us&rdquo; &mdash; verify it.
                  </p>
                </div>
              </div>
            </CardWrapper>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
