import { useRef, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Colours ─────────────────────────────────────────────────────────────── */
const GOLD     = new THREE.Color("#C9A844");
const GOLD_EMI = new THREE.Color("#8B6914");
const TEAL     = new THREE.Color("#0D9488");
const TEAL_EMI = new THREE.Color("#0D9488");

/* ─── Animation constants ─────────────────────────────────────────────────── */
const LOOP       = 9;
const T_APPROACH = 0.32;
const T_DOCKED   = 0.60;
const T_RELEASE  = 0.80;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01    = (t: number) => Math.max(0, Math.min(1, t));
const invlerp    = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));

/* ─── Peptide geometry ────────────────────────────────────────────────────── */
const AMINO: [number,number,number][] = [
  [ 0.00, -1.50,  0.15], [ 0.28, -0.90, -0.10], [-0.22, -0.32,  0.22],
  [ 0.18,  0.28, -0.22], [-0.26,  0.88,  0.16], [ 0.22,  1.42, -0.10],
  [-0.10,  1.90,  0.12],
];
const AMINO_R = [0.22, 0.17, 0.20, 0.22, 0.18, 0.21, 0.17];

const SIDE: { base: number; offset: [number,number,number]; r: number }[] = [
  { base: 1, offset: [ 0.38, 0.00, -0.32], r: 0.10 },
  { base: 2, offset: [-0.38, 0.05,  0.32], r: 0.12 },
  { base: 4, offset: [-0.38, 0.10,  0.28], r: 0.10 },
  { base: 5, offset: [ 0.36,-0.10, -0.28], r: 0.11 },
];

/* ─── Receptor geometry ───────────────────────────────────────────────────── */
const REC_LEFT:   [number,number,number][] = [
  [-0.90,-1.20,-0.10],[-1.20,-0.40, 0.15],[-1.20, 0.40,-0.10],[-0.90, 1.20, 0.10],[-0.50, 1.75, 0.00],
];
const REC_RIGHT:  [number,number,number][] = [
  [ 0.90,-1.20, 0.10],[ 1.20,-0.40,-0.15],[ 1.20, 0.40, 0.10],[ 0.90, 1.20,-0.10],[ 0.50, 1.75, 0.00],
];
const REC_BOTTOM: [number,number,number][] = [
  [-0.40,-1.65, 0.10],[0.00,-1.80,-0.05],[0.40,-1.65,-0.10],
];
const ALL_REC = [...REC_LEFT, ...REC_RIGHT, ...REC_BOTTOM];

const FLOAT_POS = new THREE.Vector3(-3.0, 0.4, 0.0);
const DOCK_POS  = new THREE.Vector3( 1.5, 0.05, 0.0);
const REC_POS   = new THREE.Vector3( 1.5, 0.0, 0.0);

/* ─── Bond helper ─────────────────────────────────────────────────────────── */
function Bond({ a, b, emi }: { a: THREE.Vector3; b: THREE.Vector3; emi: number }) {
  const dir = b.clone().sub(a);
  const len = dir.length();
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const q   = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize());
  const euler = new THREE.Euler().setFromQuaternion(q);
  return (
    <mesh position={mid.toArray() as [number,number,number]} rotation={[euler.x, euler.y, euler.z]}>
      <cylinderGeometry args={[0.035, 0.035, len, 6, 1]} />
      <meshStandardMaterial color={GOLD} emissive={GOLD_EMI} emissiveIntensity={emi * 0.6}
        metalness={0.8} roughness={0.2} transparent opacity={0.90} />
    </mesh>
  );
}

/* ─── Peptide chain ───────────────────────────────────────────────────────── */
function PeptideChain({ glowRef }: { glowRef: React.RefObject<number> }) {
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(() => {
    const g = glowRef.current ?? 0;
    mats.current.forEach(m => { if (m) m.emissiveIntensity = 0.3 + g * 1.2; });
  });
  const vecs = AMINO.map(p => new THREE.Vector3(...p));
  return (
    <group>
      {vecs.map((pos, i) => (
        <mesh key={i} position={pos.toArray() as [number,number,number]}>
          <sphereGeometry args={[AMINO_R[i], 16, 12]} />
          <meshStandardMaterial ref={el => { mats.current[i] = el; }}
            color={GOLD} emissive={GOLD_EMI} emissiveIntensity={0.3} metalness={0.7} roughness={0.25} />
        </mesh>
      ))}
      {SIDE.map((s, i) => {
        const base = vecs[s.base];
        const pos: [number,number,number] = [base.x+s.offset[0], base.y+s.offset[1], base.z+s.offset[2]];
        return (
          <group key={`s${i}`}>
            <mesh position={pos}>
              <sphereGeometry args={[s.r, 10, 8]} />
              <meshStandardMaterial color={GOLD} emissive={GOLD_EMI} emissiveIntensity={0.2} metalness={0.6} roughness={0.3} />
            </mesh>
            <Bond a={base} b={new THREE.Vector3(...pos)} emi={0.2} />
          </group>
        );
      })}
      {vecs.slice(0,-1).map((pos, i) => (
        <Bond key={`b${i}`} a={pos} b={vecs[i+1]} emi={0.4} />
      ))}
    </group>
  );
}

/* ─── Receptor protein ────────────────────────────────────────────────────── */
function ReceptorProtein({ glowRef }: { glowRef: React.RefObject<number> }) {
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  useFrame(() => {
    const g = glowRef.current ?? 0;
    mats.current.forEach(m => { if (m) m.emissiveIntensity = 0.08 + g * 0.55; });
  });
  return (
    <group position={REC_POS.toArray() as [number,number,number]}>
      {ALL_REC.map((pos, i) => {
        const isInner = i >= REC_LEFT.length + REC_RIGHT.length;
        return (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[isInner ? 0.22 : 0.36, 14, 10]} />
            <meshStandardMaterial ref={el => { mats.current[i] = el; }}
              color={TEAL} emissive={TEAL_EMI} emissiveIntensity={0.08}
              metalness={0.4} roughness={0.55} transparent opacity={isInner ? 0.75 : 0.90} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ─── Main animation scene ────────────────────────────────────────────────── */
function DockerScene() {
  const peptideRef = useRef<THREE.Group>(null!);
  const clock      = useRef(0);
  const glowRef    = useRef(0);
  const seed       = useRef(Math.random() * 100);

  useFrame((_, delta) => {
    clock.current = (clock.current + delta) % LOOP;
    const t = clock.current / LOOP;
    const g = peptideRef.current;
    if (!g) return;

    let glow = 0;
    if (t < T_APPROACH) {
      const ft = clock.current + seed.current;
      g.position.copy(FLOAT_POS).add(new THREE.Vector3(
        Math.sin(ft * 0.4) * 0.12, Math.sin(ft * 0.55 + 1.2) * 0.14, Math.sin(ft * 0.3) * 0.08
      ));
      g.rotation.y += delta * 0.38;
      g.rotation.x += delta * 0.12;
    } else if (t < T_DOCKED) {
      const p = smoothstep(invlerp(T_APPROACH, T_DOCKED, t));
      g.position.lerpVectors(FLOAT_POS, DOCK_POS, p);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, delta * 3.5);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, delta * 3.5);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, delta * 3.5);
      glow = p;
    } else if (t < T_RELEASE) {
      g.position.copy(DOCK_POS);
      g.rotation.set(0, 0, 0);
      glow = 0.75 + ((Math.sin(clock.current * 4) + 1) * 0.5) * 0.25;
    } else {
      const p = smoothstep(invlerp(T_RELEASE, 1.0, t));
      g.position.lerpVectors(DOCK_POS, FLOAT_POS, p);
      g.rotation.y += delta * 0.55 * p;
      glow = 1 - p;
    }
    glowRef.current = glow;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[-5,3,3]}  intensity={18} color="#C9A844" distance={12} decay={2} />
      <pointLight position={[ 4,0,3]}  intensity={22} color="#0D9488" distance={14} decay={2} />
      <pointLight position={[ 0,4,5]}  intensity={8}  color="#ffffff"  distance={15} decay={2} />
      <ReceptorProtein glowRef={glowRef} />
      <group ref={peptideRef} position={FLOAT_POS.toArray() as [number,number,number]}>
        <PeptideChain glowRef={glowRef} />
      </group>
    </>
  );
}

/* ─── SVG/CSS fallback (no WebGL) ─────────────────────────────────────────── */
function SvgFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes peptide-float {
          0%,100%{transform:translate(0px,0px) rotate(8deg)}
          25%{transform:translate(2px,-12px) rotate(6deg)}
          50%{transform:translate(-2px,-8px) rotate(10deg)}
          75%{transform:translate(2px,-14px) rotate(7deg)}
        }
        @keyframes peptide-approach {
          0%,30%{transform:translate(0px,0px) rotate(8deg);opacity:1}
          55%,70%{transform:translate(540px,-10px) rotate(0deg);opacity:1}
          85%,100%{transform:translate(0px,0px) rotate(8deg);opacity:1}
        }
        @keyframes receptor-pulse {
          0%,100%{opacity:0.55;filter:brightness(1)}
          50%{opacity:0.75;filter:brightness(1.3)}
        }
        @keyframes receptor-glow {
          0%,30%{filter:brightness(1)}
          55%,70%{filter:brightness(1.6) drop-shadow(0 0 12px #0D9488)}
          85%,100%{filter:brightness(1)}
        }
        @keyframes node-bob {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-4px)}
        }
        .peptide-group { animation: peptide-approach 9s ease-in-out infinite; transform-origin: center; }
        .receptor-group { animation: receptor-glow 9s ease-in-out infinite; }
        .receptor-body { animation: receptor-pulse 2.8s ease-in-out infinite; }
      `}</style>
      <svg
        viewBox="0 0 1200 680"
        className="w-full h-full"
        style={{ opacity: 0.5 }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8C96A" />
            <stop offset="100%" stopColor="#9A7020" />
          </radialGradient>
          <radialGradient id="tealGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0D7A72" />
          </radialGradient>
          <filter id="goldGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="tealGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Receptor (stays fixed, right side) */}
        <g className="receptor-group" transform="translate(840,310)">
          <g className="receptor-body" filter="url(#tealGlow)">
            {/* Left lobe */}
            {[[-78,-108],[-100,-30],[-98,48],[-72,118],[-40,162]].map(([x,y],i)=>(
              <circle key={`rl${i}`} cx={x} cy={y} r="30" fill="url(#tealGrad)" opacity="0.85"/>
            ))}
            {/* Right lobe */}
            {[[78,-108],[100,-30],[98,48],[72,118],[40,162]].map(([x,y],i)=>(
              <circle key={`rr${i}`} cx={x} cy={y} r="30" fill="url(#tealGrad)" opacity="0.85"/>
            ))}
            {/* Bottom of pocket */}
            {[[-36,178],[0,192],[36,178]].map(([x,y],i)=>(
              <circle key={`rb${i}`} cx={x} cy={y} r="19" fill="url(#tealGrad)" opacity="0.70"/>
            ))}
          </g>
        </g>

        {/* Peptide molecule (animated) */}
        <g className="peptide-group" style={{transformOrigin: '195px 300px'}}>
          {/* Bond lines first (behind spheres) */}
          {(()=>{
            const atoms:[[number,number]][] = [[[195,170]],[[225,215]],[[178,258]],[[212,302]],[[178,348]],[[215,395]],[[188,440]]];
            const flat = atoms.map(a=>a[0]);
            return flat.slice(0,-1).map(([x1,y1],i)=>{
              const [x2,y2]=flat[i+1];
              return <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A844" strokeWidth="5" strokeOpacity="0.7"/>;
            });
          })()}
          {/* Side chain bonds */}
          <line x1={225} y1={215} x2={265} y2={205} stroke="#C9A844" strokeWidth="3" strokeOpacity="0.5"/>
          <line x1={178} y1={258} x2={138} y2={248} stroke="#C9A844" strokeWidth="3" strokeOpacity="0.5"/>
          <line x1={178} y1={348} x2={138} y2={338} stroke="#C9A844" strokeWidth="3" strokeOpacity="0.5"/>
          <line x1={215} y1={395} x2={255} y2={382} stroke="#C9A844" strokeWidth="3" strokeOpacity="0.5"/>
          {/* Amino acid spheres */}
          {[[195,170,18],[225,215,14],[178,258,16],[212,302,18],[178,348,15],[215,395,17],[188,440,14]].map(([x,y,r],i)=>(
            <circle key={`a${i}`} cx={x} cy={y} r={r} fill="url(#goldGrad)" filter="url(#goldGlow)" opacity="0.95"/>
          ))}
          {/* Side chain atoms */}
          <circle cx={265} cy={205} r={9}  fill="url(#goldGrad)" opacity="0.80"/>
          <circle cx={138} cy={248} r={10} fill="url(#goldGrad)" opacity="0.80"/>
          <circle cx={138} cy={338} r={9}  fill="url(#goldGrad)" opacity="0.80"/>
          <circle cx={255} cy={382} r={10} fill="url(#goldGrad)" opacity="0.80"/>
        </g>

        {/* Subtle background grid dots */}
        {Array.from({length: 12}, (_,row) =>
          Array.from({length: 20}, (_,col) => (
            <circle key={`g${row}-${col}`}
              cx={col * 65 + 30} cy={row * 65 + 20} r="1.5"
              fill="#C9A844" opacity="0.12"
            />
          ))
        )}
      </svg>
    </div>
  );
}

/* ─── Error boundary ──────────────────────────────────────────────────────── */
class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

/* ─── WebGL capability detection ──────────────────────────────────────────── */
function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ─── Public export ───────────────────────────────────────────────────────── */
export default function MoleculeDockScene() {
  if (!supportsWebGL()) return <SvgFallback />;
  return (
    <WebGLBoundary fallback={<SvgFallback />}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
      >
        <DockerScene />
      </Canvas>
    </WebGLBoundary>
  );
}
