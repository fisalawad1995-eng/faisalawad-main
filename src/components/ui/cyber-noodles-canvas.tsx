"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sliders,
  Eye,
  Activity,
  Info,
  Utensils,
  Flame,
  Layers,
  Sparkles,
  Camera
} from "lucide-react";

// --- NOODLE RECIPES / STYLES ---
export interface NoodleRecipe {
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  noodleColor: string;
  noodleRoughness: number;
  noodleMetalness: number;
  brothColor: string;
  brothOpacity: number;
  bowlColor: string;
  bowlRimColor: string;
  bgGlow: string;
}

export const NOODLE_RECIPES: Record<string, NoodleRecipe> = {
  tokyoRamen: {
    name: "Tokyo Shoyu Ramen",
    emoji: "🍜",
    subtitle: "Soy & Dashi Broth",
    description: "Classic springy golden wavy egg noodles in a rich amber soy broth with braised chashu and soft egg.",
    noodleColor: "#f6c358",
    noodleRoughness: 0.28,
    noodleMetalness: 0.08,
    brothColor: "#58260d",
    brothOpacity: 0.94,
    bowlColor: "#18181b",
    bowlRimColor: "#ef4444",
    bgGlow: "rgba(245, 158, 11, 0.16)"
  },
  tonkotsuUdon: {
    name: "Creamy Tonkotsu Udon",
    emoji: "🍲",
    subtitle: "Silky Pork Bone Broth",
    description: "Thick, chewy white noodles submerged in a rich milky white pork marrow broth with chashu.",
    noodleColor: "#fef3c7",
    noodleRoughness: 0.22,
    noodleMetalness: 0.04,
    brothColor: "#e8dcce",
    brothOpacity: 0.96,
    bowlColor: "#27272a",
    bowlRimColor: "#06b6d4",
    bgGlow: "rgba(254, 243, 199, 0.16)"
  },
  spicyDanDan: {
    name: "Spicy Chili Dan Dan",
    emoji: "🌶️",
    subtitle: "Fiery Szechuan Chili Oil",
    description: "Springy noodles glistening in a fiery red chili oil broth with toasted sesame and scallions.",
    noodleColor: "#fba338",
    noodleRoughness: 0.18,
    noodleMetalness: 0.12,
    brothColor: "#881337",
    brothOpacity: 0.95,
    bowlColor: "#1c1917",
    bowlRimColor: "#f97316",
    bgGlow: "rgba(225, 29, 72, 0.18)"
  },
  pastaMarinara: {
    name: "Italian Spaghetti",
    emoji: "🍝",
    subtitle: "San Marzano Pomodoro",
    description: "Silky tangled strands of al dente spaghetti coated in a rich, glossy tomato reduction.",
    noodleColor: "#fcd34d",
    noodleRoughness: 0.30,
    noodleMetalness: 0.06,
    brothColor: "#991b1b",
    brothOpacity: 0.92,
    bowlColor: "#f8fafc",
    bowlRimColor: "#16a34a",
    bgGlow: "rgba(220, 38, 38, 0.14)"
  }
};

export interface EdibleNoodlesConfig {
  recipe: string;
  liftAmount: number; // 0.0 (rest on rim) to 1.0 (high lift)
  noodleThickness: number;
  jiggleSpeed: number;
  steamIntensity: number;
  autoRotate: boolean;
  showChopsticks: boolean;
  showEgg: boolean;
  showChashu: boolean;
  showNori: boolean;
  showNaruto: boolean;
  showScallions: boolean;
}

// Deep disposal helper to guarantee 0 memory leaks
function disposeHierarchy(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }
  });
}

export function CyberNoodlesViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"dish" | "toppings" | "physics" | "camera">("dish");
  const [fps, setFps] = useState<number>(60);

  // Configuration
  const [config, setConfig] = useState<EdibleNoodlesConfig>({
    recipe: "tokyoRamen",
    liftAmount: 0.65,
    noodleThickness: 0.052,
    jiggleSpeed: 1.0,
    steamIntensity: 1.0,
    autoRotate: true,
    showChopsticks: true,
    showEgg: true,
    showChashu: true,
    showNori: true,
    showNaruto: true,
    showScallions: true
  });

  // Reference container for Three.js instance & smooth kinetics
  const stateRef = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    dishRoot: THREE.Group | null;
    bowlMesh: THREE.Mesh | null;
    brothMesh: THREE.Mesh | null;
    noodlesMoundGroup: THREE.Group | null;
    liftedNoodlesGroup: THREE.Group | null;
    chopsticksGroup: THREE.Group | null;
    eggGroup: THREE.Group | null;
    chashuMesh: THREE.Mesh | null;
    noriMesh: THREE.Mesh | null;
    narutoGroup: THREE.Group | null;
    scallionsGroup: THREE.Group | null;
    steamParticles: THREE.Points | null;
    steamPositions: Float32Array | null;
    steamVelocities: Float32Array | null;
    steamLife: Float32Array | null;

    // Materials for smooth recipe cross-fading
    noodleMaterial: THREE.MeshStandardMaterial | null;
    brothMaterial: THREE.MeshStandardMaterial | null;
    bowlMaterial: THREE.MeshStandardMaterial | null;
    rimMaterial: THREE.MeshStandardMaterial | null;

    // Smooth Orbit & Kinetic Physics
    targetSpherical: { radius: number; theta: number; phi: number };
    currentSpherical: { radius: number; theta: number; phi: number };
    velocityTheta: number;
    velocityPhi: number;
    isDragging: boolean;
    prevMousePos: { x: number; y: number };

    // Smooth Lift Interpolation (Zero geometry rebuilds on slider drag)
    targetLift: number;
    currentLift: number;

    // Smooth Topping Scale Transitions
    toppingScales: {
      egg: number;
      chashu: number;
      nori: number;
      naruto: number;
      scallions: number;
      chopsticks: number;
    };

    // Timing & animation
    lastFrameTime: number;
    frameCount: number;
    lastFpsTime: number;
    animationFrameId: number | null;
    config: EdibleNoodlesConfig;
    isPlaying: boolean;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    dishRoot: null,
    bowlMesh: null,
    brothMesh: null,
    noodlesMoundGroup: null,
    liftedNoodlesGroup: null,
    chopsticksGroup: null,
    eggGroup: null,
    chashuMesh: null,
    noriMesh: null,
    narutoGroup: null,
    scallionsGroup: null,
    steamParticles: null,
    steamPositions: null,
    steamVelocities: null,
    steamLife: null,
    noodleMaterial: null,
    brothMaterial: null,
    bowlMaterial: null,
    rimMaterial: null,
    targetSpherical: { radius: 6.2, theta: 0.4, phi: 0.52 },
    currentSpherical: { radius: 6.2, theta: 0.4, phi: 0.52 },
    velocityTheta: 0,
    velocityPhi: 0,
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    targetLift: 0.65,
    currentLift: 0.65,
    toppingScales: {
      egg: 1,
      chashu: 1,
      nori: 1,
      naruto: 1,
      scallions: 1,
      chopsticks: 1
    },
    lastFrameTime: performance.now(),
    frameCount: 0,
    lastFpsTime: performance.now(),
    animationFrameId: null,
    config,
    isPlaying: true
  });

  useEffect(() => {
    stateRef.current.config = config;
    stateRef.current.targetLift = config.liftAmount;
  }, [config]);

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  // GET OR INITIALIZE PERSISTENT MATERIALS FOR SILKY RECIPE BLENDING
  const getOrCreateMaterials = useCallback((recipeKey: string) => {
    const s = stateRef.current;
    const r = NOODLE_RECIPES[recipeKey] || NOODLE_RECIPES.tokyoRamen;

    if (!s.noodleMaterial) {
      s.noodleMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r.noodleColor),
        roughness: r.noodleRoughness,
        metalness: r.noodleMetalness,
        bumpScale: 0.05
      });
    }

    if (!s.brothMaterial) {
      s.brothMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r.brothColor),
        roughness: 0.06,
        metalness: 0.18,
        transparent: true,
        opacity: r.brothOpacity
      });
    }

    if (!s.bowlMaterial) {
      s.bowlMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r.bowlColor),
        roughness: 0.20,
        metalness: 0.08,
        side: THREE.DoubleSide
      });
    }

    if (!s.rimMaterial) {
      s.rimMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color(r.bowlRimColor),
        roughness: 0.22,
        metalness: 0.22
      });
    }

    return {
      noodleMat: s.noodleMaterial,
      brothMat: s.brothMaterial,
      bowlMat: s.bowlMaterial,
      rimMat: s.rimMaterial
    };
  }, []);

  // BUILD TANGLED NOODLE MOUND & LIFTED NOODLE BUNDLE (Silky, continuous Catmull-Rom curves)
  const buildNoodles = useCallback((dishRoot: THREE.Group, recipeKey: string, thickness: number) => {
    const s = stateRef.current;
    const { noodleMat } = getOrCreateMaterials(recipeKey);

    // 1. TANGLED NOODLE MOUND IN THE BOWL
    if (s.noodlesMoundGroup) {
      dishRoot.remove(s.noodlesMoundGroup);
      disposeHierarchy(s.noodlesMoundGroup);
    }
    const noodlesMoundGroup = new THREE.Group();

    // 32 naturally tangled strands with 72 segments & 14 radial facets for ultra-smooth cylindrical curves
    const strandCount = 32;
    for (let i = 0; i < strandCount; i++) {
      const points: THREE.Vector3[] = [];
      const baseRadius = 0.35 + (i / strandCount) * 1.5;
      const angleOffset = (i * 1.618033) * Math.PI * 2;
      const numPts = 22; // More control points for natural fluid curve

      for (let j = 0; j < numPts; j++) {
        const u = j / (numPts - 1);
        const theta = angleOffset + u * Math.PI * 3.4;
        const wave = Math.sin(u * 14.0 + i) * 0.12;
        const rad = Math.min(1.9, baseRadius + wave);
        const x = Math.cos(theta) * rad;
        const z = Math.sin(theta) * rad;
        // Smooth organic dome profile centered around (0, 1.45, 0)
        const dome = Math.max(0.0, 1.0 - (rad / 1.95) ** 2) * 0.72;
        const y = 1.38 + dome + Math.cos(u * 12.0 + i * 2.0) * 0.09;
        points.push(new THREE.Vector3(x, y, z));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = "catmullrom";
      curve.tension = 0.5; // Natural silk tension without sharp kinks
      const tubeGeo = new THREE.TubeGeometry(curve, 72, thickness, 14, false);
      const mesh = new THREE.Mesh(tubeGeo, noodleMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      noodlesMoundGroup.add(mesh);
    }
    dishRoot.add(noodlesMoundGroup);
    s.noodlesMoundGroup = noodlesMoundGroup;

    // 2. LIFTED NOODLES STRANDS (Anchored in soup, looping over chopsticks)
    buildLiftedStrands(dishRoot, noodleMat, thickness);
  }, [getOrCreateMaterials]);

  // Helper to generate full-height lifted noodle geometry once (translated & scaled smoothly in render loop)
  const buildLiftedStrands = (dishRoot: THREE.Group, noodleMat: THREE.MeshStandardMaterial, thickness: number) => {
    const s = stateRef.current;
    if (s.liftedNoodlesGroup) {
      dishRoot.remove(s.liftedNoodlesGroup);
      disposeHierarchy(s.liftedNoodlesGroup);
      s.liftedNoodlesGroup = null;
    }

    const liftedGroup = new THREE.Group();
    // Anchor group origin at soup surface (y = 1.48)
    liftedGroup.position.set(0, 1.48, 0);

    // Full lift apex coordinates where chopsticks grip at maximum lift
    const fullApexY = 3.50; // Maximum apex height in world coordinates
    const apexRelY = fullApexY - 1.48; // = 2.02 height above soup surface
    const apexX = 0.25;
    const apexZ = 0.05;

    const liftedStrandCount = 9;
    for (let k = 0; k < liftedStrandCount; k++) {
      const points: THREE.Vector3[] = [];
      const strandAngle = (k / liftedStrandCount) * Math.PI * 2;
      const rootX = Math.cos(strandAngle) * 0.42 + 0.1;
      const rootZ = Math.sin(strandAngle) * 0.42;

      const ptCount = 34;
      for (let j = 0; j < ptCount; j++) {
        const u = j / (ptCount - 1);

        if (u <= 0.65) {
          // Rising up from soup to chopsticks (relative to soup y=0)
          const t = u / 0.65;
          const x = rootX + (apexX - rootX) * t + Math.sin(t * Math.PI) * 0.08 * Math.cos(k);
          const z = rootZ + (apexZ - rootZ) * t + Math.sin(t * Math.PI) * 0.08 * Math.sin(k);
          const y = (apexRelY) * (t ** 1.15);
          const wigX = Math.sin(t * 18.0 + k) * 0.035;
          const wigZ = Math.cos(t * 16.0 + k) * 0.035;
          points.push(new THREE.Vector3(x + wigX, y, z + wigZ));
        } else {
          // Draping down past the chopsticks
          const t = (u - 0.65) / 0.35;
          const drapeLength = (apexRelY) * 0.72;
          const y = apexRelY - t * drapeLength;
          const x = apexX + Math.sin(t * 2.8 + k) * 0.14 + (t * 0.1);
          const z = apexZ + Math.cos(t * 2.5 + k) * 0.14;
          points.push(new THREE.Vector3(x, y, z));
        }
      }

      const curve = new THREE.CatmullRomCurve3(points);
      curve.curveType = "catmullrom";
      curve.tension = 0.5;
      const tubeGeo = new THREE.TubeGeometry(curve, 80, thickness * 0.95, 14, false);
      const mesh = new THREE.Mesh(tubeGeo, noodleMat);
      mesh.castShadow = true;
      liftedGroup.add(mesh);
    }

    dishRoot.add(liftedGroup);
    s.liftedNoodlesGroup = liftedGroup;
  };

  // BUILD COMPLETE DISH (Bowl, Broth, Chopsticks, Serving Tray, Delicious Toppings)
  const buildDishEnvironment = useCallback((dishRoot: THREE.Group, recipeKey: string) => {
    const s = stateRef.current;
    const { brothMat, bowlMat, rimMat } = getOrCreateMaterials(recipeKey);

    // Clean prior environment meshes
    if (s.bowlMesh) {
      dishRoot.remove(s.bowlMesh);
      disposeHierarchy(s.bowlMesh);
      s.bowlMesh = null;
    }
    if (s.chopsticksGroup) {
      dishRoot.remove(s.chopsticksGroup);
      disposeHierarchy(s.chopsticksGroup);
      s.chopsticksGroup = null;
    }

    // 0. WOODEN SERVING TRAY / TABLETOP (High segment count 96 for flawless bevel)
    const trayGeo = new THREE.CylinderGeometry(3.5, 3.7, 0.18, 96);
    const trayMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.6,
      metalness: 0.08
    });
    const trayMesh = new THREE.Mesh(trayGeo, trayMat);
    trayMesh.position.y = -0.09;
    trayMesh.receiveShadow = true;
    dishRoot.add(trayMesh);

    // 1. CERAMIC DONBURI BOWL (Smooth 128 lathe segments for mirror porcelain)
    const bowlPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(1.15, 0.0),   // Foot base
      new THREE.Vector2(1.20, 0.35),  // Foot height
      new THREE.Vector2(1.85, 0.95),  // Body flare
      new THREE.Vector2(2.45, 1.75),
      new THREE.Vector2(2.72, 2.38),  // Lip curve start
      new THREE.Vector2(2.75, 2.44),  // Outer rim peak
      new THREE.Vector2(2.68, 2.45),  // Rim top
      new THREE.Vector2(2.62, 2.40),  // Inner rim descent
      new THREE.Vector2(2.32, 1.75),  // Inner wall
      new THREE.Vector2(1.72, 1.05),
      new THREE.Vector2(1.05, 0.50),
      new THREE.Vector2(0.0, 0.50)    // Center bottom
    ];
    const bowlGeo = new THREE.LatheGeometry(bowlPoints, 128);
    const bowlMesh = new THREE.Mesh(bowlGeo, bowlMat);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    dishRoot.add(bowlMesh);
    s.bowlMesh = bowlMesh;

    // Glazed decorative rim ring (20 radial, 128 tubular segments)
    const rimGeo = new THREE.TorusGeometry(2.7, 0.038, 20, 128);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 2.44;
    bowlMesh.add(rimMesh);

    // 2. SAVORY BROTH (96 segments for perfectly circular liquid surface)
    const brothGeo = new THREE.CylinderGeometry(2.32, 2.05, 0.08, 96);
    const brothMesh = new THREE.Mesh(brothGeo, brothMat);
    brothMesh.position.y = 1.62;
    dishRoot.add(brothMesh);
    s.brothMesh = brothMesh;

    // 3. WOODEN CHOPSTICKS (HASHI) WITH POLISHED GOLD ACCENT BANDS
    const chopsticksGroup = new THREE.Group();
    const stickGeo = new THREE.CylinderGeometry(0.038, 0.075, 3.8, 24);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.35,
      metalness: 0.04
    });

    const stick1 = new THREE.Mesh(stickGeo, woodMat);
    stick1.rotation.z = Math.PI / 3.3;
    stick1.rotation.y = 0.12;
    stick1.position.set(0.32, 0.0, -0.06);
    stick1.castShadow = true;

    const stick2 = new THREE.Mesh(stickGeo, woodMat);
    stick2.rotation.z = Math.PI / 3.5;
    stick2.rotation.y = -0.12;
    stick2.position.set(0.32, 0.1, 0.08);
    stick2.castShadow = true;

    // Gold decorative bands
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.15 });
    const tipRingGeo = new THREE.CylinderGeometry(0.077, 0.077, 0.18, 24);
    const tip1 = new THREE.Mesh(tipRingGeo, goldMat);
    tip1.position.y = 1.7;
    stick1.add(tip1);
    const tip2 = new THREE.Mesh(tipRingGeo, goldMat);
    tip2.position.y = 1.7;
    stick2.add(tip2);

    chopsticksGroup.add(stick1);
    chopsticksGroup.add(stick2);
    dishRoot.add(chopsticksGroup);
    s.chopsticksGroup = chopsticksGroup;

    // 4. SOFT-BOILED RAMEN EGG (AJITSUKE TAMAGO) (High-poly 48x32 smooth sphere)
    const eggGroup = new THREE.Group();
    const eggWhiteGeo = new THREE.SphereGeometry(0.52, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const eggWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfef9c3,
      roughness: 0.22,
      metalness: 0.04
    });
    const eggWhite = new THREE.Mesh(eggWhiteGeo, eggWhiteMat);
    eggWhite.scale.set(1.0, 0.52, 1.25);
    eggWhite.rotation.x = Math.PI;

    const capGeo = new THREE.CircleGeometry(0.52, 48);
    const cap = new THREE.Mesh(capGeo, eggWhiteMat);
    cap.rotation.x = -Math.PI / 2;
    cap.scale.set(1.0, 1.25, 1.0);
    eggGroup.add(cap);

    // Runny jammy golden yolk
    const yolkGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.05, 48);
    const yolkMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.10,
      metalness: 0.08
    });
    const yolk = new THREE.Mesh(yolkGeo, yolkMat);
    yolk.position.y = 0.03;
    eggGroup.add(yolk);

    eggGroup.add(eggWhite);
    eggGroup.position.set(-1.05, 1.68, 0.55);
    eggGroup.rotation.z = 0.18;
    eggGroup.rotation.x = 0.12;
    eggGroup.castShadow = true;
    dishRoot.add(eggGroup);
    s.eggGroup = eggGroup;

    // 5. TENDER BRAISED CHASHU PORK BELLY SLICE (64 segments)
    const chashuGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.08, 64);
    const chashuMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.35,
      metalness: 0.08
    });
    const chashuMesh = new THREE.Mesh(chashuGeo, chashuMat);
    chashuMesh.position.set(-0.85, 1.65, -0.65);
    chashuMesh.rotation.x = 0.22;
    chashuMesh.rotation.z = -0.15;
    chashuMesh.scale.set(1.1, 1.0, 0.95);
    chashuMesh.castShadow = true;
    dishRoot.add(chashuMesh);
    s.chashuMesh = chashuMesh;

    // 6. CRISPY NORI SEAWEED SHEET
    const noriGeo = new THREE.BoxGeometry(0.04, 1.7, 1.25);
    const noriMat = new THREE.MeshStandardMaterial({
      color: 0x142018,
      roughness: 0.72,
      metalness: 0.02
    });
    const noriMesh = new THREE.Mesh(noriGeo, noriMat);
    noriMesh.position.set(1.85, 2.28, -0.6);
    noriMesh.rotation.z = -0.44;
    noriMesh.rotation.y = 0.35;
    noriMesh.castShadow = true;
    dishRoot.add(noriMesh);
    s.noriMesh = noriMesh;

    // 7. NARUTOMAKI (FISH CAKE SLICE WITH PINK SPIRAL) (64 segments)
    const narutoGroup = new THREE.Group();
    const cakeGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.09, 64);
    const cakeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 });
    const cakeMesh = new THREE.Mesh(cakeGeo, cakeMat);

    const spiralGeo = new THREE.TorusGeometry(0.2, 0.042, 12, 48, Math.PI * 1.6);
    const pinkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.3 });
    const spiral = new THREE.Mesh(spiralGeo, pinkMat);
    spiral.rotation.x = Math.PI / 2;
    spiral.position.y = 0.052;

    narutoGroup.add(cakeMesh);
    narutoGroup.add(spiral);
    narutoGroup.position.set(-0.25, 1.82, 1.15);
    narutoGroup.rotation.x = 0.25;
    narutoGroup.rotation.y = 0.3;
    narutoGroup.castShadow = true;
    dishRoot.add(narutoGroup);
    s.narutoGroup = narutoGroup;

    // 8. CHOPPED GREEN SCALLIONS (NEGI)
    const scallionsGroup = new THREE.Group();
    const scallionGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.038, 16);
    const scallionMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.35
    });

    for (let sIdx = 0; sIdx < 28; sIdx++) {
      const ring = new THREE.Mesh(scallionGeo, scallionMat);
      const sAngle = (sIdx * 2.39996) % (Math.PI * 2);
      const sRad = 0.18 + ((sIdx * 17) % 100 / 100) * 0.95;
      ring.position.set(
        Math.cos(sAngle) * sRad + 0.05,
        1.76 + ((sIdx * 31) % 100 / 100) * 0.12,
        Math.sin(sAngle) * sRad + 0.15
      );
      ring.rotation.set((sIdx % 4) * 0.1, (sIdx * 0.7) % Math.PI, (sIdx % 3) * 0.1);
      scallionsGroup.add(ring);
    }
    dishRoot.add(scallionsGroup);
    s.scallionsGroup = scallionsGroup;
  }, [getOrCreateMaterials]);

  // INITIALIZE THREE.JS ENGINE WITH SMOOTH HIGH-PERFORMANCE RENDERER
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // SCENE & UNIFIED DISH ROOT
    const scene = new THREE.Scene();
    const dishRoot = new THREE.Group();
    scene.add(dishRoot);
    stateRef.current.scene = scene;
    stateRef.current.dishRoot = dishRoot;

    // CAMERA (Smooth 38° FOV culinary perspective)
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    stateRef.current.camera = camera;

    // RENDERER WITH ANTIALIASING & HIGH-PERFORMANCE PROFILES
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    stateRef.current.renderer = renderer;

    // WARM STUDIO FOOD PHOTOGRAPHY LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(4.5, 7.5, 5.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 2.5; // Soft natural shadow edges
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.4);
    rimLight.position.set(-5.0, 5.5, -4.0);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.1, 12);
    fillLight.position.set(0, 4.5, 3.5);
    scene.add(fillLight);

    // SMOOTH RISING STEAM PARTICLES (75 particles with smooth lifetime fade)
    const steamCount = 75;
    const steamGeo = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    const steamVels = new Float32Array(steamCount * 3);
    const steamLife = new Float32Array(steamCount);

    for (let i = 0; i < steamCount; i++) {
      steamPos[i * 3] = (Math.random() - 0.5) * 1.7;
      steamPos[i * 3 + 1] = 1.7 + Math.random() * 2.8;
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 1.7;

      steamVels[i * 3] = (Math.random() - 0.5) * 0.08;
      steamVels[i * 3 + 1] = 0.45 + Math.random() * 0.55;
      steamVels[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      steamLife[i] = Math.random();
    }
    steamGeo.setAttribute("position", new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.18,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const steamParticles = new THREE.Points(steamGeo, steamMat);
    scene.add(steamParticles);
    stateRef.current.steamParticles = steamParticles;
    stateRef.current.steamPositions = steamPos;
    stateRef.current.steamVelocities = steamVels;
    stateRef.current.steamLife = steamLife;

    // BUILD INITIAL DISH AND NOODLES
    buildDishEnvironment(dishRoot, stateRef.current.config.recipe);
    buildNoodles(
      dishRoot,
      stateRef.current.config.recipe,
      stateRef.current.config.noodleThickness
    );

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // SMOOTH ORBIT CONTROLS WITH KINETIC MOMENTUM & DAMPING
    const onMouseDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.velocityTheta = 0;
      stateRef.current.velocityPhi = 0;
      stateRef.current.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (s.isDragging) {
        const deltaX = e.clientX - s.prevMousePos.x;
        const deltaY = e.clientY - s.prevMousePos.y;

        const moveSpeed = 0.0055;
        const dTheta = -deltaX * moveSpeed;
        const dPhi = deltaY * moveSpeed;

        s.targetSpherical.theta += dTheta;
        s.targetSpherical.phi += dPhi;
        s.targetSpherical.phi = Math.max(0.12, Math.min(1.42, s.targetSpherical.phi));

        // Track drag velocity for physical inertia coasting
        s.velocityTheta = dTheta * 0.7;
        s.velocityPhi = dPhi * 0.7;

        s.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Smooth zoom damping
      stateRef.current.targetSpherical.radius += e.deltaY * 0.0035;
      stateRef.current.targetSpherical.radius = Math.max(3.8, Math.min(9.5, stateRef.current.targetSpherical.radius));
    };

    // Mobile & Tablet Touch Support with Momentum
    let lastTouchDistance = 0;
    const onTouchStart = (e: TouchEvent) => {
      const s = stateRef.current;
      if (e.touches.length === 1) {
        s.isDragging = true;
        s.velocityTheta = 0;
        s.velocityPhi = 0;
        s.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        lastTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = stateRef.current;
      if (e.touches.length === 1 && s.isDragging) {
        const deltaX = e.touches[0].clientX - s.prevMousePos.x;
        const deltaY = e.touches[0].clientY - s.prevMousePos.y;

        const moveSpeed = 0.0065;
        const dTheta = -deltaX * moveSpeed;
        const dPhi = deltaY * moveSpeed;

        s.targetSpherical.theta += dTheta;
        s.targetSpherical.phi += dPhi;
        s.targetSpherical.phi = Math.max(0.12, Math.min(1.42, s.targetSpherical.phi));

        s.velocityTheta = dTheta * 0.65;
        s.velocityPhi = dPhi * 0.65;

        s.prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const delta = (lastTouchDistance - dist) * 0.015;
        s.targetSpherical.radius = Math.max(3.8, Math.min(9.5, s.targetSpherical.radius + delta));
        lastTouchDistance = dist;
      }
    };

    const onTouchEnd = () => {
      stateRef.current.isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    // ANIMATION RENDER LOOP (Delta-time independent 60-144 FPS smooth kinetics)
    let simTime = 0;

    const animate = () => {
      const s = stateRef.current;
      const now = performance.now();
      const delta = Math.min((now - s.lastFrameTime) / 1000, 0.05); // Cap delta to avoid frame spikes
      s.lastFrameTime = now;

      // FPS tracking
      s.frameCount++;
      if (now - s.lastFpsTime >= 1000) {
        setFps(Math.round((s.frameCount * 1000) / (now - s.lastFpsTime)));
        s.frameCount = 0;
        s.lastFpsTime = now;
      }

      if (s.isPlaying) {
        simTime += delta;
      }

      // 1. KINETIC INERTIA & TABLE SPIN ROTATION
      if (!s.isDragging) {
        // Coasting with smooth exponential friction damping
        s.targetSpherical.theta += s.velocityTheta;
        s.targetSpherical.phi += s.velocityPhi;
        s.targetSpherical.phi = Math.max(0.12, Math.min(1.42, s.targetSpherical.phi));

        const friction = Math.exp(-6.5 * delta);
        s.velocityTheta *= friction;
        s.velocityPhi *= friction;

        // Smooth continuous showcase table spin when idle
        if (s.config.autoRotate && Math.abs(s.velocityTheta) < 0.002) {
          s.targetSpherical.theta += delta * 0.22;
        }
      }

      // Delta-time independent exponential smoothing for camera orbit
      const orbitDamp = 1.0 - Math.exp(-12.0 * delta);
      s.currentSpherical.theta += (s.targetSpherical.theta - s.currentSpherical.theta) * orbitDamp;
      s.currentSpherical.phi += (s.targetSpherical.phi - s.currentSpherical.phi) * orbitDamp;
      s.currentSpherical.radius += (s.targetSpherical.radius - s.currentSpherical.radius) * orbitDamp;

      // Update camera position in spherical space
      if (s.camera) {
        const rad = s.currentSpherical.radius;
        const phi = s.currentSpherical.phi;
        const theta = s.currentSpherical.theta;

        s.camera.position.x = rad * Math.cos(phi) * Math.sin(theta);
        s.camera.position.y = 1.3 + rad * Math.sin(phi);
        s.camera.position.z = rad * Math.cos(phi) * Math.cos(theta);
        s.camera.lookAt(0, 1.3, 0);
      }

      // 2. SMOOTH LIFT INTERPOLATION & ORGANIC CHOPSTICKS POISE
      const liftDamp = 1.0 - Math.exp(-9.5 * delta);
      s.currentLift += (s.targetLift - s.currentLift) * liftDamp;
      const curLift = Math.max(0.0, Math.min(1.0, s.currentLift));

      // Multi-frequency organic breathing wave
      const jiggleSpeed = s.config.jiggleSpeed;
      const wave1 = Math.sin(simTime * 2.4 * jiggleSpeed);
      const wave2 = Math.sin(simTime * 4.2 * jiggleSpeed + 0.8);
      const wave3 = Math.cos(simTime * 1.6 * jiggleSpeed);
      const noodleJiggle = (wave1 * 0.012 + wave2 * 0.005 + wave3 * 0.004);

      // Subtle organic sway of lifted noodle bundle in the air
      const swayX = Math.sin(simTime * 1.8) * 0.015 * curLift;
      const swayZ = Math.cos(simTime * 1.5) * 0.015 * curLift;

      // CHOPSTICKS & LIFTED NOODLES DYNAMICS
      if (s.chopsticksGroup) {
        // Smooth scale transition for chopsticks visibility
        const chopTargetScale = s.config.showChopsticks ? 1.0 : 0.0;
        s.toppingScales.chopsticks += (chopTargetScale - s.toppingScales.chopsticks) * (1.0 - Math.exp(-12.0 * delta));
        s.chopsticksGroup.scale.setScalar(s.toppingScales.chopsticks);
        s.chopsticksGroup.visible = s.toppingScales.chopsticks > 0.01;

        // Smooth transition between resting on rim and lifting into the air
        const restY = 2.48;
        const fullApexY = 3.50;
        const liftedApexY = 1.48 + curLift * (fullApexY - 1.48);

        // Blend smoothly between rest pose and lift pose
        const liftTransition = Math.min(1.0, curLift * 4.0); // 0 at rest, 1 when actively lifted

        const chopY = (1.0 - liftTransition) * restY + liftTransition * liftedApexY + noodleJiggle;
        const chopRotX = (1.0 - liftTransition) * 0.05;
        const chopRotY = (1.0 - liftTransition) * 0.2;
        const chopRotZ = Math.sin(simTime * 1.5) * 0.008 * curLift; // Gentle hand tremor holding noodles

        s.chopsticksGroup.position.set(swayX * 0.3, chopY, swayZ * 0.3);
        s.chopsticksGroup.rotation.set(chopRotX, chopRotY, chopRotZ);
      }

      // Smooth lifted noodle loop scaling & position
      if (s.liftedNoodlesGroup) {
        const isVisible = s.config.showChopsticks && curLift > 0.01;
        s.liftedNoodlesGroup.visible = isVisible;
        if (isVisible) {
          s.liftedNoodlesGroup.position.set(swayX, 1.48 + noodleJiggle, swayZ);
          // Scale smoothly in Y from soup surface without rebuilding geometry
          s.liftedNoodlesGroup.scale.set(1.0, curLift, 1.0);
        }
      }

      // Noodle mound gentle simmer
      if (s.noodlesMoundGroup) {
        s.noodlesMoundGroup.position.y = Math.sin(simTime * 2.2 * jiggleSpeed) * 0.008;
      }

      // Savory broth gentle fluid simmer
      if (s.brothMesh) {
        s.brothMesh.position.y = 1.62 + Math.sin(simTime * 1.8) * 0.004 + Math.cos(simTime * 2.8) * 0.002;
      }

      // 3. SMOOTH TOPPINGS POP IN / OUT SPRINGS
      const toppingDamp = 1.0 - Math.exp(-12.0 * delta);
      const updateTopping = (group: THREE.Object3D | null, isShown: boolean, key: keyof typeof s.toppingScales) => {
        if (!group) return;
        const target = isShown ? 1.0 : 0.0;
        s.toppingScales[key] += (target - s.toppingScales[key]) * toppingDamp;
        group.scale.setScalar(s.toppingScales[key]);
        group.visible = s.toppingScales[key] > 0.01;
      };

      updateTopping(s.eggGroup, s.config.showEgg, "egg");
      updateTopping(s.chashuMesh, s.config.showChashu, "chashu");
      updateTopping(s.noriMesh, s.config.showNori, "nori");
      updateTopping(s.narutoGroup, s.config.showNaruto, "naruto");
      updateTopping(s.scallionsGroup, s.config.showScallions, "scallions");

      // 4. SMOOTH RECIPE COLOR CROSS-FADING
      const activeRecipe = NOODLE_RECIPES[s.config.recipe] || NOODLE_RECIPES.tokyoRamen;
      const colorLerp = 1.0 - Math.exp(-6.0 * delta);

      if (s.noodleMaterial) {
        s.noodleMaterial.color.lerp(new THREE.Color(activeRecipe.noodleColor), colorLerp);
        s.noodleMaterial.roughness += (activeRecipe.noodleRoughness - s.noodleMaterial.roughness) * colorLerp;
        s.noodleMaterial.metalness += (activeRecipe.noodleMetalness - s.noodleMaterial.metalness) * colorLerp;
      }
      if (s.brothMaterial) {
        s.brothMaterial.color.lerp(new THREE.Color(activeRecipe.brothColor), colorLerp);
        s.brothMaterial.opacity += (activeRecipe.brothOpacity - s.brothMaterial.opacity) * colorLerp;
      }
      if (s.bowlMaterial) {
        s.bowlMaterial.color.lerp(new THREE.Color(activeRecipe.bowlColor), colorLerp);
      }
      if (s.rimMaterial) {
        s.rimMaterial.color.lerp(new THREE.Color(activeRecipe.bowlRimColor), colorLerp);
      }

      // 5. SMOOTH RISING STEAM PARTICLES WITH NATURAL DRIFT
      if (s.steamParticles && s.steamPositions && s.steamVelocities && s.steamLife) {
        const intensity = s.config.steamIntensity;
        (s.steamParticles.material as THREE.PointsMaterial).opacity = 0.28 * intensity;

        if (intensity > 0.01) {
          for (let i = 0; i < steamCount; i++) {
            s.steamPositions[i * 3 + 1] += s.steamVelocities[i * 3 + 1] * delta * intensity;
            s.steamPositions[i * 3] += Math.sin(simTime * 2.0 + i) * 0.005;
            s.steamPositions[i * 3 + 2] += Math.cos(simTime * 1.8 + i) * 0.005;

            // Smooth particle recycling with staggered respawn
            if (s.steamPositions[i * 3 + 1] > 4.8) {
              s.steamPositions[i * 3 + 1] = 1.7 + Math.random() * 0.2;
              s.steamPositions[i * 3] = (Math.random() - 0.5) * 1.6;
              s.steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
            }
          }
          s.steamParticles.geometry.attributes.position.needsUpdate = true;
        }
      }

      if (s.renderer && s.scene && s.camera) {
        s.renderer.render(s.scene, s.camera);
      }

      s.animationFrameId = requestAnimationFrame(animate);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(animate);

    // CLEANUP
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);

      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      if (stateRef.current.dishRoot) {
        disposeHierarchy(stateRef.current.dishRoot);
      }
      renderer.dispose();
    };
  }, [buildDishEnvironment, buildNoodles]);

  // Re-build noodle geometry ONLY when noodle gauge (thickness) changes
  useEffect(() => {
    if (stateRef.current.dishRoot) {
      buildNoodles(
        stateRef.current.dishRoot,
        config.recipe,
        config.noodleThickness
      );
    }
  }, [config.noodleThickness, buildNoodles, config.recipe]);

  // Smooth Camera Presets Helper
  const setCameraView = (type: "top" | "hero" | "lift" | "side") => {
    switch (type) {
      case "top":
        stateRef.current.targetSpherical = { radius: 5.5, theta: 0.0, phi: 1.35 };
        break;
      case "hero":
        stateRef.current.targetSpherical = { radius: 6.2, theta: 0.4, phi: 0.52 };
        break;
      case "lift":
        stateRef.current.targetSpherical = { radius: 4.8, theta: 0.15, phi: 0.65 };
        break;
      case "side":
        stateRef.current.targetSpherical = { radius: 6.0, theta: 0.6, phi: 0.18 };
        break;
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    stateRef.current.targetSpherical = { radius: 6.2, theta: 0.4, phi: 0.52 };
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const activeRecipe = NOODLE_RECIPES[config.recipe] || NOODLE_RECIPES.tokyoRamen;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 border border-white/10 select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none bg-stone-950/98 backdrop-blur-2xl h-screen"
          : "h-[540px] md:h-[650px] bg-gradient-to-b from-stone-950/95 via-stone-900/90 to-stone-950/95 shadow-2xl shadow-amber-950/40"
      }`}
      style={{
        boxShadow: `0 0 90px -20px ${activeRecipe.bgGlow}`
      }}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing focus:outline-none"
      />

      {/* Warm Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(12,10,9,0.85)_100%)]" />

      {/* Top Header Badge & Live Telemetry */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-500/20 text-xs font-medium text-stone-200 shadow-xl">
          <span className="text-base">{activeRecipe.emoji}</span>
          <span className="font-semibold tracking-wide uppercase text-[11px] text-amber-300">
            {activeRecipe.name}
          </span>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <span className="text-[10px] text-stone-400 font-mono hidden sm:inline">
            {activeRecipe.subtitle}
          </span>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <span className="text-[10px] text-emerald-400 font-mono items-center gap-1 hidden sm:flex">
            <Activity size={10} />
            {fps} FPS
          </span>
        </div>

        {/* Top Right Quick Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-stone-900/85 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full transition-all ${
              isPlaying
                ? "text-amber-400 hover:bg-amber-500/20"
                : "text-stone-400 bg-stone-800 hover:bg-stone-700"
            }`}
            title={isPlaying ? "Pause Simulation" : "Resume Simulation"}
            aria-label="Play/Pause"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={handleResetCamera}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-all"
            title="Reset Camera View"
            aria-label="Reset Camera"
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-2 rounded-full transition-all ${
              showControls
                ? "bg-amber-500 text-stone-950 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                : "text-stone-300 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle Noodle Controls"
            aria-label="Toggle Controls"
          >
            <Sliders size={14} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Floating Instructions Helper */}
      <div className="absolute bottom-4 left-4 pointer-events-none z-10 hidden sm:flex items-center gap-2 text-[11px] text-stone-300 bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-500/20 shadow-lg">
        <Info size={12} className="text-amber-400" />
        <span>Drag to orbit with smooth momentum • Scroll to zoom • Use Chopsticks slider to lift!</span>
      </div>

      {/* FLOATING GLASS NOODLE CONTROL DOCK */}
      {showControls && (
        <div className="absolute right-4 bottom-4 w-76 sm:w-84 p-4 rounded-2xl bg-stone-900/95 backdrop-blur-2xl border border-amber-500/20 shadow-2xl shadow-black/90 z-20 text-stone-200 text-xs transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-1 bg-stone-800/80 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("dish")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  activeTab === "dish"
                    ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Utensils size={11} /> Recipe
              </button>
              <button
                onClick={() => setActiveTab("toppings")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  activeTab === "toppings"
                    ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Layers size={11} /> Toppings
              </button>
              <button
                onClick={() => setActiveTab("physics")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  activeTab === "physics"
                    ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Flame size={11} /> Steam
              </button>
              <button
                onClick={() => setActiveTab("camera")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all text-[11px] ${
                  activeTab === "camera"
                    ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                <Eye size={11} /> View
              </button>
            </div>

            <button
              onClick={() => setShowControls(false)}
              className="text-[10px] text-stone-400 hover:text-stone-200 uppercase tracking-wider font-semibold ml-1 cursor-pointer"
            >
              Hide
            </button>
          </div>

          {/* TAB 1: DISH & RECIPES */}
          {activeTab === "dish" && (
            <div className="space-y-3">
              {/* Recipe Selector with Smooth Color Cross-Fading */}
              <div>
                <label className="block text-stone-300 font-medium mb-1.5 text-[11px]">Choose Noodle Dish</label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {Object.entries(NOODLE_RECIPES).map(([key, r]) => (
                    <button
                      key={key}
                      onClick={() => setConfig({ ...config, recipe: key })}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                        config.recipe === key
                          ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-sm"
                          : "bg-stone-800/60 border-white/5 text-stone-400 hover:text-stone-200 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.emoji}</span>
                        <div>
                          <div className="text-[11px] font-semibold text-stone-100">{r.name}</div>
                          <div className="text-[9px] text-stone-400 leading-tight line-clamp-1">{r.description}</div>
                        </div>
                      </div>
                      <span
                        className="w-3 h-3 rounded-full border border-black/40 shrink-0 ml-1.5 transition-colors duration-500"
                        style={{ backgroundColor: r.noodleColor }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Lift Noodles with Chopsticks Slider (Zero-Lag Smooth Spring Interpolation) */}
              <div className="p-2.5 rounded-xl bg-stone-800/60 border border-amber-500/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-amber-300 text-[11px] flex items-center gap-1.5">
                    <Utensils size={12} /> Chopsticks Lift
                  </span>
                  <span className="text-amber-400 font-mono text-[11px]">
                    {Math.round(config.liftAmount * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.01"
                  value={config.liftAmount}
                  onChange={(e) => setConfig({ ...config, liftAmount: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-stone-400 mt-1.5">
                  <button
                    onClick={() => setConfig({ ...config, liftAmount: 0.0 })}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Rest on Rim
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, liftAmount: 0.65 })}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Slurp Bite
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, liftAmount: 1.0 })}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    High Lift
                  </button>
                </div>
              </div>

              {/* Noodle Thickness / Gauge */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-stone-300 font-medium">Noodle Gauge (Thickness)</span>
                  <span className="text-amber-400 font-mono text-[10px]">
                    {config.noodleThickness < 0.05 ? "Thin Ramen" : config.noodleThickness > 0.065 ? "Thick Udon" : "Standard"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.038"
                  max="0.078"
                  step="0.004"
                  value={config.noodleThickness}
                  onChange={(e) => setConfig({ ...config, noodleThickness: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: TOPPINGS & ACCENTS */}
          {activeTab === "toppings" && (
            <div className="space-y-2">
              <div className="text-[10px] text-stone-400 mb-1">Smoothly toggle ingredients in your bowl:</div>

              {/* Chopsticks */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🥢 Wooden Chopsticks</span>
                <button
                  onClick={() => setConfig({ ...config, showChopsticks: !config.showChopsticks })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showChopsticks ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Chopsticks"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showChopsticks ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Soft Boiled Egg */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🥚 Ajitsuke Soft Egg</span>
                <button
                  onClick={() => setConfig({ ...config, showEgg: !config.showEgg })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showEgg ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Egg"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showEgg ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Braised Chashu Pork */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🥩 Braised Chashu Pork</span>
                <button
                  onClick={() => setConfig({ ...config, showChashu: !config.showChashu })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showChashu ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Chashu"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showChashu ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Nori Sheet */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🍙 Crispy Nori Sheet</span>
                <button
                  onClick={() => setConfig({ ...config, showNori: !config.showNori })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showNori ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Nori"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showNori ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Narutomaki */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🍥 Narutomaki Swirl</span>
                <button
                  onClick={() => setConfig({ ...config, showNaruto: !config.showNaruto })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showNaruto ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Naruto"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showNaruto ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Scallions */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-stone-800/60 border border-white/5">
                <span className="text-[11px] font-medium text-stone-200">🌿 Chopped Negi (Scallions)</span>
                <button
                  onClick={() => setConfig({ ...config, showScallions: !config.showScallions })}
                  className={`w-9 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                    config.showScallions ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Scallions"
                >
                  <span
                    className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      config.showScallions ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STEAM & KINETICS */}
          {activeTab === "physics" && (
            <div className="space-y-3.5">
              {/* Hot Rising Steam Intensity */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-stone-300 font-medium">Hot Broth Steam</span>
                  <span className="text-amber-400 font-mono text-[10px]">
                    {config.steamIntensity === 0 ? "Off" : config.steamIntensity < 0.6 ? "Gentle" : "Hot & Steamy"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.1"
                  value={config.steamIntensity}
                  onChange={(e) => setConfig({ ...config, steamIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Noodle Jiggle & Wobble */}
              <div>
                <div className="flex justify-between items-center mb-1 text-[11px]">
                  <span className="text-stone-300 font-medium">Noodle Springiness / Jiggle</span>
                  <span className="text-amber-400 font-mono text-[10px]">{config.jiggleSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={config.jiggleSpeed}
                  onChange={(e) => setConfig({ ...config, jiggleSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CAMERA & VIEW */}
          {activeTab === "camera" && (
            <div className="space-y-3">
              {/* Camera Angle Presets with Smooth Gliding Orbit */}
              <div>
                <label className="block text-stone-300 font-medium mb-1.5 text-[11px] flex items-center gap-1.5">
                  <Camera size={12} className="text-amber-400" />
                  <span>Cinematic Camera Views</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setCameraView("top")}
                    className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium border border-white/5 text-center transition-all cursor-pointer"
                  >
                    🍜 Top-Down Bowl
                  </button>
                  <button
                    onClick={() => setCameraView("hero")}
                    className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium border border-white/5 text-center transition-all cursor-pointer"
                  >
                    ⭐ Hero Angle 45°
                  </button>
                  <button
                    onClick={() => setCameraView("lift")}
                    className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium border border-white/5 text-center transition-all cursor-pointer"
                  >
                    🥢 Chopstick Zoom
                  </button>
                  <button
                    onClick={() => setCameraView("side")}
                    className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-medium border border-white/5 text-center transition-all cursor-pointer"
                  >
                    🔍 Ceramic Profile
                  </button>
                </div>
              </div>

              {/* Auto Spin Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/60 border border-white/5">
                <div>
                  <div className="font-medium text-stone-200">Table Spin Rotation</div>
                  <div className="text-[10px] text-stone-400">Smooth 360° showcase orbit</div>
                </div>
                <button
                  onClick={() => setConfig({ ...config, autoRotate: !config.autoRotate })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    config.autoRotate ? "bg-amber-500" : "bg-stone-700"
                  }`}
                  aria-label="Toggle Auto-Rotate"
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      config.autoRotate ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Camera Reset */}
              <button
                onClick={handleResetCamera}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-medium flex items-center justify-center gap-2 transition-all border border-white/5 text-[11px] cursor-pointer"
              >
                <RotateCcw size={12} className="text-amber-400" />
                <span>Reset Camera View</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
