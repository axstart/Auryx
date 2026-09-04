import { useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Palette ──────────────────────────────────────────────────────────────── */
const C_GOLD_BRIGHT = new THREE.Color("#F0C84A");
const C_GOLD        = new THREE.Color("#C9A030");
const C_GOLD_DIM    = new THREE.Color("#7A5A10");
const C_TEAL        = new THREE.Color("#0ABFB0");

/* ─── Node count & geometry constants ─────────────────────────────────────── */
const NODE_COUNT      = 58;
const CLOUD_RADIUS    = 3.6;
const CONNECT_DIST    = 1.85;   // max distance to draw a connection
const MAX_LINES       = 400;    // pre-allocated connection buffer
const PULSE_INTERVAL  = 2.2;    // seconds between activation pulses

/* ─── Seeded random helpers ────────────────────────────────────────────────── */
function randInSphere(r: number): THREE.Vector3 {
  const u = Math.random(), v = Math.random(), w = Math.random();
  const phi   = Math.acos(2 * u - 1);
  const theta = 2 * Math.PI * v;
  const rad   = r * Math.cbrt(w);
  return new THREE.Vector3(
    rad * Math.sin(phi) * Math.cos(theta),
    rad * Math.sin(phi) * Math.sin(theta),
    rad * Math.cos(phi),
  );
}

/* ─── Node data (fixed at mount) ──────────────────────────────────────────── */
function makeNodes(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const pos  = randInSphere(CLOUD_RADIUS).add(new THREE.Vector3(1.4, 0, 0));
    const vel  = new THREE.Vector3(
      (Math.random() - 0.5) * 0.012,
      (Math.random() - 0.5) * 0.010,
      (Math.random() - 0.5) * 0.008,
    );
    const size   = 0.055 + Math.random() * 0.12;   // small=background, large=foreground
    const phase  = Math.random() * Math.PI * 2;
    const isTeal = i < 6;                           // 6 teal accent nodes
    return { pos, vel, size, phase, isTeal };
  });
}

/* ─── Dynamic connection lines ─────────────────────────────────────────────── */
function ConnectionWeb({ nodeRefs }: { nodeRefs: React.RefObject<THREE.Vector3[]> }) {
  const geoRef  = useRef<THREE.BufferGeometry>(null!);
  const matRef  = useRef<THREE.LineBasicMaterial>(null!);
  const pulseRef = useRef(0);

  const posArr = useMemo(() => new Float32Array(MAX_LINES * 2 * 3), []);

  useFrame(({ clock }) => {
    const nodes = nodeRefs.current;
    if (!nodes || !geoRef.current) return;

    const t   = clock.getElapsedTime();
    const pulse = (Math.sin(t * 0.7) + 1) * 0.5;  // 0→1 breathing cycle
    pulseRef.current = pulse;

    // Build active connections
    let idx = 0;
    for (let i = 0; i < nodes.length && idx < MAX_LINES - 1; i++) {
      for (let j = i + 1; j < nodes.length && idx < MAX_LINES - 1; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        if (d < CONNECT_DIST) {
          posArr[idx * 6 + 0] = nodes[i].x; posArr[idx * 6 + 1] = nodes[i].y; posArr[idx * 6 + 2] = nodes[i].z;
          posArr[idx * 6 + 3] = nodes[j].x; posArr[idx * 6 + 4] = nodes[j].y; posArr[idx * 6 + 5] = nodes[j].z;
          idx++;
        }
      }
    }
    // Zero out remaining slots (degenerate = invisible)
    posArr.fill(0, idx * 6);

    const attr = geoRef.current.attributes.position as THREE.BufferAttribute;
    (attr.array as Float32Array).set(posArr);
    attr.needsUpdate = true;
    geoRef.current.setDrawRange(0, idx * 2);

    if (matRef.current) {
      matRef.current.opacity = 0.18 + pulse * 0.28;
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    return g;
  }, [posArr]);

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial ref={matRef} color={C_GOLD} transparent opacity={0.22} depthWrite={false} />
    </lineSegments>
  );
}

/* ─── Individual node spheres ──────────────────────────────────────────────── */
function NodeCloud({ nodeRefs }: { nodeRefs: React.RefObject<THREE.Vector3[]> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodes    = useRef(makeNodes(NODE_COUNT));
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }, delta) => {
    const t  = clock.getElapsedTime();
    const ns = nodes.current;

    for (let i = 0; i < ns.length; i++) {
      const n   = ns[i];
      // Drift
      n.pos.addScaledVector(n.vel, 1);
      // Soft boundary — pull back toward cloud center
      const fromCenter = n.pos.clone().sub(new THREE.Vector3(1.4, 0, 0));
      if (fromCenter.length() > CLOUD_RADIUS * 1.15) {
        n.vel.addScaledVector(fromCenter.normalize(), -0.0008);
      }
      // Update mesh position
      const mesh = meshRefs.current[i];
      if (mesh) {
        mesh.position.copy(n.pos);
        const emi = 0.35 + Math.sin(t * 0.9 + n.phase) * 0.25;
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = emi;
      }
      // Sync into shared ref for ConnectionWeb
      if (nodeRefs.current) nodeRefs.current[i] = n.pos;
    }

    // Gentle overall rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.12;
    }
  });

  const ns = nodes.current;
  return (
    <group ref={groupRef}>
      {ns.map((n, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el; }} position={n.pos.toArray() as [number,number,number]}>
          <sphereGeometry args={[n.size, n.size > 0.13 ? 18 : 10, n.size > 0.13 ? 14 : 8]} />
          <meshPhysicalMaterial
            color={n.isTeal ? C_TEAL : C_GOLD}
            emissive={n.isTeal ? C_TEAL : (n.size > 0.12 ? C_GOLD_BRIGHT : C_GOLD_DIM)}
            emissiveIntensity={0.35}
            metalness={0.85} roughness={0.12}
            clearcoat={0.9} clearcoatRoughness={0.08}
            iridescence={n.size > 0.12 ? 0.5 : 0.1}
            iridescenceIOR={1.8}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Pulsing activation rings (heartbeat) ────────────────────────────────── */
function PulseRings() {
  const ringsRef = useRef<{ mesh: THREE.Mesh | null; t: number; delay: number }[]>([
    { mesh: null, t: 0, delay: 0 },
    { mesh: null, t: 0, delay: PULSE_INTERVAL * 0.5 },
    { mesh: null, t: 0, delay: PULSE_INTERVAL },
  ]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ringsRef.current.forEach(ring => {
      if (!ring.mesh) return;
      const phase = ((t + ring.delay) % (PULSE_INTERVAL * 1.5)) / (PULSE_INTERVAL * 1.5);
      const scale = 0.3 + phase * 4.5;
      const alpha = (1 - phase) * 0.35;
      ring.mesh.scale.setScalar(scale);
      (ring.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, alpha);
    });
  });

  return (
    <group position={[1.4, 0, 0]}>
      {ringsRef.current.map((ring, i) => (
        <mesh key={i} ref={el => { ring.mesh = el; }}>
          <torusGeometry args={[1, 0.012, 8, 60]} />
          <meshBasicMaterial color={C_GOLD} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Background particle dust ─────────────────────────────────────────────── */
function StarDust() {
  const ref    = useRef<THREE.Points>(null!);
  const COUNT  = 180;

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const ph  = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.3) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      ph[i]          = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  const base = useMemo(() => positions.slice(), [positions]);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const pa = ref.current?.geometry.attributes.position;
    if (!pa) return;
    const arr = pa.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const ph = phases[i];
      arr[i * 3]     = base[i * 3]     + Math.sin(t * 0.18 + ph) * 0.20;
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.14 + ph + 1) * 0.24;
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * 0.11 + ph + 2) * 0.14;
    }
    pa.needsUpdate = true;
    ref.current.rotation.y = t * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4A843" size={0.028} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ─── Camera gentle drift ──────────────────────────────────────────────────── */
function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.09) * 0.65;
    camera.position.y = Math.sin(t * 0.06 + 0.8) * 0.32 + 0.15;
    camera.lookAt(1.2, 0, 0);
  });
  return null;
}

/* ─── Main scene ───────────────────────────────────────────────────────────── */
function ConstellationScene() {
  const nodePositions = useRef<THREE.Vector3[]>(
    Array.from({ length: NODE_COUNT }, () => new THREE.Vector3())
  );

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[-4, 5, 5]}  intensity={22} color="#D4A843" distance={16} decay={2} />
      <pointLight position={[ 6, -2, 4]} intensity={18} color="#0ABFB0" distance={14} decay={2} />
      <pointLight position={[ 0, -5, 3]} intensity={10} color="#C07820" distance={12} decay={2} />
      <CameraDrift />
      <StarDust />
      <PulseRings />
      <NodeCloud nodeRefs={nodePositions} />
      <ConnectionWeb nodeRefs={nodePositions} />
    </>
  );
}

/* ─── SVG / CSS fallback ───────────────────────────────────────────────────── */
const SVG_NODES: { x: number; y: number; r: number; teal?: boolean }[] = [
  {x:720,y:180,r:14},{x:840,y:140,r:10},{x:950,y:200,r:16},{x:1060,y:155,r:9},
  {x:1120,y:250,r:13},{x:1080,y:360,r:11},{x:980,y:420,r:15},{x:860,y:390,r:9},
  {x:760,y:310,r:12},{x:660,y:250,r:8},{x:810,y:260,r:7},{x:920,y:300,r:10},
  {x:1000,y:280,r:8},{x:1150,y:340,r:12},{x:1050,y:460,r:9},{x:900,y:510,r:11},
  {x:750,y:470,r:8},{x:640,y:370,r:10},{x:690,y:160,r:7},{x:1100,y:140,r:8},
  {x:830,y:490,r:7},{x:1000,y:180,r:9,teal:true},{x:760,y:380,r:8,teal:true},
  {x:1080,y:300,r:7,teal:true},{x:940,y:460,r:9,teal:true},{x:660,y:300,r:6},
  {x:1160,y:420,r:10},{x:870,y:220,r:8},{x:970,y:350,r:6},{x:1030,y:390,r:8},
];

function getConnections() {
  const THRESH = 195;
  const conns: { x1:number;y1:number;x2:number;y2:number;i:number;j:number }[] = [];
  for (let i = 0; i < SVG_NODES.length; i++) {
    for (let j = i + 1; j < SVG_NODES.length; j++) {
      const a = SVG_NODES[i], b = SVG_NODES[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < THRESH) conns.push({ x1:a.x, y1:a.y, x2:b.x, y2:b.y, i, j });
    }
  }
  return conns;
}

const CONNECTIONS = getConnections();

function SvgFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes node-pulse {
          0%,100%{transform:scale(1);opacity:var(--base-op)}
          50%{transform:scale(1.18);opacity:1}
        }
        @keyframes line-pulse {
          0%,100%{stroke-opacity:0.12}
          50%{stroke-opacity:0.45}
        }
        @keyframes line-travel {
          0%{stroke-dashoffset:var(--len);stroke-opacity:0}
          15%{stroke-opacity:0.6}
          85%{stroke-opacity:0.6}
          100%{stroke-dashoffset:0;stroke-opacity:0}
        }
        @keyframes ring-expand {
          0%{r:20;opacity:0.5;stroke-width:2}
          100%{r:200;opacity:0;stroke-width:0.5}
        }
        @keyframes drift {
          0%,100%{transform:translate(0px,0px)}
          25%{transform:translate(var(--dx),var(--dy))}
          75%{transform:translate(calc(var(--dx)*-0.6),calc(var(--dy)*0.4))}
        }
        @keyframes stardust {
          0%,100%{opacity:0.08}50%{opacity:0.22}
        }
        .constellation-wrap{animation:drift 12s ease-in-out infinite;--dx:4px;--dy:-6px;}
      `}</style>
      <svg viewBox="0 0 1280 720" className="w-full h-full" style={{opacity:0.55}} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ng" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F8E090"/>
            <stop offset="55%" stopColor="#C9A030"/>
            <stop offset="100%" stopColor="#6A4808"/>
          </radialGradient>
          <radialGradient id="tg" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#50F0E0"/>
            <stop offset="60%" stopColor="#0ABFB0"/>
            <stop offset="100%" stopColor="#055050"/>
          </radialGradient>
          <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softglow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Star dust */}
        {Array.from({length:70},(_,i)=>{
          const x=Math.sin(i*137.5)*640+640, y=Math.cos(i*137.5)*360+360;
          return <circle key={i} cx={x} cy={y} r={1.2} fill="#D4A843"
            style={{animation:`stardust ${2.5+i*0.18}s ease-in-out infinite`,animationDelay:`${i*0.11}s`,opacity:0.12}}/>;
        })}

        <g className="constellation-wrap">
          {/* Connection lines — base */}
          {CONNECTIONS.map((c,i)=>{
            const len=Math.hypot(c.x2-c.x1,c.y2-c.y1);
            return <line key={`lb${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#C9A030" strokeWidth="1"
              style={{animation:`line-pulse ${3+i*0.07}s ease-in-out infinite`,animationDelay:`${(i*0.23)%3}s`,strokeOpacity:0.18}}/>;
          })}

          {/* Travelling pulses on select connections */}
          {CONNECTIONS.filter((_,i)=>i%3===0).map((c,i)=>{
            const len=Math.hypot(c.x2-c.x1,c.y2-c.y1);
            return <line key={`lp${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
              stroke="#F0C84A" strokeWidth="2" fill="none" filter="url(#softglow)"
              strokeDasharray={len} strokeDashoffset={len}
              style={{
                ['--len' as string]: len,
                animation:`line-travel ${2.8+i*0.35}s linear infinite`,
                animationDelay:`${i*0.45}s`,
              } as React.CSSProperties}/>;
          })}

          {/* Nodes */}
          {SVG_NODES.map((n,i)=>(
            <circle key={i} cx={n.x} cy={n.y} r={n.r}
              fill={n.teal?"url(#tg)":"url(#ng)"}
              filter="url(#glow)"
              style={{
                animation:`node-pulse ${2.2+i*0.19}s ease-in-out infinite`,
                animationDelay:`${i*0.13}s`,
                transformOrigin:`${n.x}px ${n.y}px`,
                ['--base-op' as string]: n.r>11?'0.92':'0.72',
                opacity: n.r>11?0.92:0.72,
              } as React.CSSProperties}/>
          ))}

          {/* Expanding pulse rings from large nodes */}
          {SVG_NODES.filter(n=>n.r>12).map((n,i)=>(
            <circle key={`ring${i}`} cx={n.x} cy={n.y} r={20}
              fill="none" stroke={n.teal?"#0ABFB0":"#C9A030"} strokeWidth="1.5"
              style={{
                animation:`ring-expand ${3.2+i*0.8}s ease-out infinite`,
                animationDelay:`${i*1.1}s`,
                opacity:0.5,
              }}/>
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ─── Error boundary & WebGL detect ────────────────────────────────────────── */
class WebGLBoundary extends Component<{children:ReactNode;fallback:ReactNode},{err:boolean}> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch { return false; }
}

/* ─── Export ───────────────────────────────────────────────────────────────── */
export default function MoleculeDockScene() {
  if (!supportsWebGL()) return <SvgFallback />;
  return (
    <WebGLBoundary fallback={<SvgFallback />}>
      <Canvas camera={{ position: [0, 0.15, 7.8], fov: 50 }}
        gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        style={{ background: "transparent" }} dpr={[1, 1.8]}>
        <ConstellationScene />
      </Canvas>
    </WebGLBoundary>
  );
}
