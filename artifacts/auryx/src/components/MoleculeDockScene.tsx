import { useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─── Palette ──────────────────────────────────────────────────────────────── */
const C_GOLD      = new THREE.Color("#D4A843");
const C_GOLD_EMI  = new THREE.Color("#9A6F10");
const C_GOLD_PALE = new THREE.Color("#F0D080");
const C_TEAL      = new THREE.Color("#0ABFB0");
const C_TEAL_EMI  = new THREE.Color("#087A72");

/* ─── Animation timing (9-second loop) ────────────────────────────────────── */
const LOOP       = 9;
const T_APPROACH = 0.33;
const T_DOCKED   = 0.62;
const T_RELEASE  = 0.82;

const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01    = (t: number) => Math.max(0, Math.min(1, t));
const inv        = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));

/* ─── Alpha-helix backbone positions (12 residues) ─────────────────────────── */
function buildHelix(n = 12) {
  const helixR = 0.52;      // coil radius
  const rise   = 0.29;      // rise per residue
  const turn   = (100 * Math.PI) / 180; // ~100° per residue
  const yStart = -((n - 1) * rise) / 2;
  const atoms: THREE.Vector3[] = [];
  const sides: { pos: THREE.Vector3; r: number }[] = [];

  for (let i = 0; i < n; i++) {
    const a = i * turn;
    const x = helixR * Math.cos(a);
    const z = helixR * Math.sin(a);
    const y = yStart + i * rise;
    atoms.push(new THREE.Vector3(x, y, z));

    // Side chain: point radially outward
    const sr = helixR + 0.38;
    sides.push({
      pos: new THREE.Vector3(sr * Math.cos(a), y + 0.04, sr * Math.sin(a)),
      r: 0.09 + Math.random() * 0.06,
    });
  }
  return { atoms, sides };
}

const HELIX = buildHelix(12);
const FLOAT_POS = new THREE.Vector3(-2.8,  0.3, 0);
const DOCK_POS  = new THREE.Vector3( 1.6,  0.0, 0);
const REC_POS   = new THREE.Vector3( 1.6,  0.0, 0);

/* ─── Receptor geometry (deep binding groove) ──────────────────────────────── */
const REC_RESIDUES: { p: [number,number,number]; r: number }[] = [
  // left lobe
  { p:[-1.05,-1.30,-0.12], r:0.40 }, { p:[-1.25,-0.48, 0.18], r:0.38 },
  { p:[-1.20, 0.38,-0.14], r:0.40 }, { p:[-1.00, 1.20, 0.12], r:0.36 },
  { p:[-0.55, 1.80, 0.00], r:0.34 },
  // right lobe
  { p:[ 1.05,-1.30, 0.12], r:0.40 }, { p:[ 1.25,-0.48,-0.18], r:0.38 },
  { p:[ 1.20, 0.38, 0.14], r:0.40 }, { p:[ 1.00, 1.20,-0.12], r:0.36 },
  { p:[ 0.55, 1.80, 0.00], r:0.34 },
  // bottom of groove
  { p:[-0.38,-1.70, 0.10], r:0.24 }, { p:[ 0.00,-1.88,-0.06], r:0.24 },
  { p:[ 0.38,-1.70,-0.10], r:0.24 },
  // inner pocket detail
  { p:[-0.62,-0.60,-0.30], r:0.18 }, { p:[ 0.62,-0.60, 0.30], r:0.18 },
  { p:[-0.42, 0.60, 0.32], r:0.18 }, { p:[ 0.42, 0.60,-0.32], r:0.18 },
];

/* ─── Bond helper ──────────────────────────────────────────────────────────── */
function Bond({ a, b, emi, opacity = 0.88 }: {
  a: THREE.Vector3; b: THREE.Vector3; emi: number; opacity?: number;
}) {
  const dir  = b.clone().sub(a);
  const len  = dir.length();
  const mid  = a.clone().add(b).multiplyScalar(0.5);
  const q    = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir.normalize());
  const euler = new THREE.Euler().setFromQuaternion(q);
  return (
    <mesh position={mid.toArray() as [number,number,number]} rotation={[euler.x, euler.y, euler.z]}>
      <cylinderGeometry args={[0.028, 0.028, len, 7, 1]} />
      <meshPhysicalMaterial color={C_GOLD} emissive={C_GOLD_EMI} emissiveIntensity={emi}
        metalness={0.92} roughness={0.12} clearcoat={0.8} transparent opacity={opacity} />
    </mesh>
  );
}

/* ─── Helix ribbon (tube connecting backbone) ──────────────────────────────── */
function HelixRibbon({ glowRef }: { glowRef: React.RefObject<number> }) {
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!);
  const tubeMesh = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(HELIX.atoms, false, "catmullrom", 0.5);
    const geo = new THREE.TubeGeometry(curve, 80, 0.055, 8, false);
    return geo;
  }, []);

  useFrame(() => {
    if (mat.current) mat.current.emissiveIntensity = 0.25 + (glowRef.current ?? 0) * 0.9;
  });

  return (
    <mesh geometry={tubeMesh}>
      <meshPhysicalMaterial ref={mat} color={C_GOLD} emissive={C_GOLD_EMI}
        emissiveIntensity={0.25} metalness={0.95} roughness={0.08}
        clearcoat={1.0} clearcoatRoughness={0.06} transparent opacity={0.92} />
    </mesh>
  );
}

/* ─── Helix atoms + side chains ────────────────────────────────────────────── */
function HelixAtoms({ glowRef }: { glowRef: React.RefObject<number> }) {
  const atomMats  = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const sideMats  = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  useFrame(() => {
    const g = glowRef.current ?? 0;
    const emi = 0.30 + g * 1.1;
    atomMats.current.forEach(m => { if (m) m.emissiveIntensity = emi; });
    sideMats.current.forEach(m => { if (m) m.emissiveIntensity = emi * 0.55; });
  });

  return (
    <group>
      {HELIX.atoms.map((pos, i) => (
        <mesh key={`a${i}`} position={pos.toArray() as [number,number,number]}>
          <sphereGeometry args={[0.155, 20, 14]} />
          <meshPhysicalMaterial ref={el => { atomMats.current[i] = el; }}
            color={C_GOLD_PALE} emissive={C_GOLD_EMI} emissiveIntensity={0.3}
            metalness={0.92} roughness={0.10} clearcoat={1.0} clearcoatRoughness={0.05}
            iridescence={0.4} iridescenceIOR={1.9} />
        </mesh>
      ))}
      {HELIX.sides.map((s, i) => (
        <group key={`s${i}`}>
          <mesh position={s.pos.toArray() as [number,number,number]}>
            <sphereGeometry args={[s.r, 12, 8]} />
            <meshPhysicalMaterial ref={el => { sideMats.current[i] = el; }}
              color={C_GOLD} emissive={C_GOLD_EMI} emissiveIntensity={0.2}
              metalness={0.88} roughness={0.15} clearcoat={0.7} />
          </mesh>
          <Bond a={HELIX.atoms[i]} b={s.pos} emi={0.15} opacity={0.70} />
        </group>
      ))}
    </group>
  );
}

/* ─── Receptor protein ─────────────────────────────────────────────────────── */
function ReceptorProtein({ glowRef }: { glowRef: React.RefObject<number> }) {
  const mats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);

  useFrame(() => {
    const g = glowRef.current ?? 0;
    mats.current.forEach((m, i) => {
      if (!m) return;
      const isInner = i >= 10;
      m.emissiveIntensity = isInner ? 0.10 + g * 0.70 : 0.06 + g * 0.45;
    });
  });

  return (
    <group position={REC_POS.toArray() as [number,number,number]}>
      {REC_RESIDUES.map((res, i) => (
        <mesh key={i} position={res.p}>
          <sphereGeometry args={[res.r, 16, 11]} />
          <meshPhysicalMaterial ref={el => { mats.current[i] = el; }}
            color={C_TEAL} emissive={C_TEAL_EMI} emissiveIntensity={0.06}
            metalness={0.35} roughness={0.50}
            clearcoat={0.6} clearcoatRoughness={0.25}
            transparent opacity={i >= 10 ? 0.72 : 0.88} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Floating gold particle field ─────────────────────────────────────────── */
function ParticleField() {
  const ref   = useRef<THREE.Points>(null!);
  const COUNT = 120;

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const ph  = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 16;
      pos[i*3+1] = (Math.random() - 0.5) * 9;
      pos[i*3+2] = (Math.random() - 0.5) * 5 - 1.5;
      ph[i]      = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  const basePos = useMemo(() => positions.slice(), [positions]);

  useFrame(({ clock }) => {
    const t  = clock.getElapsedTime();
    const p  = ref.current?.geometry.attributes.position;
    if (!p) return;
    for (let i = 0; i < COUNT; i++) {
      const ph = phases[i];
      (p.array as Float32Array)[i*3]   = basePos[i*3]   + Math.sin(t * 0.22 + ph) * 0.18;
      (p.array as Float32Array)[i*3+1] = basePos[i*3+1] + Math.sin(t * 0.17 + ph + 1) * 0.22;
      (p.array as Float32Array)[i*3+2] = basePos[i*3+2] + Math.sin(t * 0.14 + ph + 2) * 0.12;
    }
    p.needsUpdate = true;
    ref.current.rotation.y = t * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D4A843" size={0.038} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ─── Camera drift ─────────────────────────────────────────────────────────── */
function CameraDrift() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.11) * 0.55;
    camera.position.y = Math.sin(t * 0.07 + 0.5) * 0.28 + 0.15;
    camera.lookAt(0.5, 0, 0);
  });
  return null;
}

/* ─── Main orchestrator ────────────────────────────────────────────────────── */
function DockerScene() {
  const groupRef  = useRef<THREE.Group>(null!);
  const clock     = useRef(0);
  const glowRef   = useRef(0);

  useFrame((_, delta) => {
    clock.current = (clock.current + delta) % LOOP;
    const t = clock.current / LOOP;
    const g = groupRef.current;
    if (!g) return;

    let glow = 0;

    if (t < T_APPROACH) {
      const ft = clock.current;
      g.position.copy(FLOAT_POS).add(new THREE.Vector3(
        Math.sin(ft * 0.38) * 0.14,
        Math.sin(ft * 0.50 + 1.1) * 0.16,
        Math.sin(ft * 0.28) * 0.08,
      ));
      g.rotation.y += delta * 0.32;
      g.rotation.x += delta * 0.10;

    } else if (t < T_DOCKED) {
      const p = smoothstep(inv(T_APPROACH, T_DOCKED, t));
      g.position.lerpVectors(FLOAT_POS, DOCK_POS, p);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, delta * 4);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, delta * 4);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, delta * 4);
      glow = p;

    } else if (t < T_RELEASE) {
      g.position.copy(DOCK_POS);
      g.rotation.set(0, 0, 0);
      const pulse = (Math.sin(clock.current * 3.8) + 1) * 0.5;
      glow = 0.72 + pulse * 0.28;

    } else {
      const p = smoothstep(inv(T_RELEASE, 1.0, t));
      g.position.lerpVectors(DOCK_POS, FLOAT_POS, p);
      g.rotation.y += delta * 0.50 * p;
      glow = 1 - p;
    }

    glowRef.current = glow;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.18} />
      <pointLight position={[-6, 4, 4]}  intensity={25} color="#D4A843" distance={14} decay={2} />
      <pointLight position={[ 5, 0, 4]}  intensity={28} color="#0ABFB0" distance={15} decay={2} />
      <pointLight position={[ 0, 5, 5]}  intensity={10} color="#F8E8C0" distance={18} decay={2} />
      <pointLight position={[-2,-4, 2]}  intensity={8}  color="#C07820" distance={10} decay={2} />

      <CameraDrift />
      <ParticleField />
      <ReceptorProtein glowRef={glowRef} />

      <group ref={groupRef} position={FLOAT_POS.toArray() as [number,number,number]}>
        <HelixRibbon glowRef={glowRef} />
        <HelixAtoms  glowRef={glowRef} />
      </group>
    </>
  );
}

/* ─── SVG / CSS fallback (no WebGL) ───────────────────────────────────────── */
function SvgFallback() {
  // Pre-compute helix positions for SVG
  const helixNodes = Array.from({ length: 12 }, (_, i) => {
    const angle   = (i * 100 * Math.PI) / 180;
    const cx      = 820;
    const cyStart = 145;
    const rx      = 58;
    const ry      = 14; // perspective foreshortening
    const riseY   = 33;
    const x       = cx + rx * Math.cos(angle);
    const y       = cyStart + i * riseY;
    const depth   = Math.sin(angle); // -1 back, +1 front
    const opacity = 0.40 + depth * 0.55;
    const r       = 11 + depth * 5.5;
    return { x, y, r, opacity, depth, angle };
  });

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes helix-drift {
          0%,100%{transform:translate(0px,0px)}
          30%{transform:translate(3px,-14px)}
          60%{transform:translate(-3px,-9px)}
        }
        @keyframes helix-approach {
          0%,30%{transform:translateX(0px) rotate(4deg);opacity:1}
          52%,68%{transform:translateX(520px) rotate(0deg);opacity:1}
          85%,100%{transform:translateX(0px) rotate(4deg);opacity:1}
        }
        @keyframes receptor-breathe {
          0%,100%{filter:brightness(1) drop-shadow(0 0 4px rgba(10,191,176,0.3))}
          50%{filter:brightness(1.25) drop-shadow(0 0 16px rgba(10,191,176,0.6))}
        }
        @keyframes receptor-glow-on {
          0%,30%{filter:brightness(1) drop-shadow(0 0 4px rgba(10,191,176,0.3))}
          55%,70%{filter:brightness(1.7) drop-shadow(0 0 22px rgba(10,191,176,0.8))}
          85%,100%{filter:brightness(1) drop-shadow(0 0 4px rgba(10,191,176,0.3))}
        }
        @keyframes particle-float {
          0%,100%{transform:translate(0,0);opacity:var(--op)}
          33%{transform:translate(var(--dx),var(--dy));opacity:calc(var(--op)*1.4)}
          66%{transform:translate(calc(var(--dx)*-0.5),calc(var(--dy)*1.3));opacity:calc(var(--op)*0.7)}
        }
        @keyframes ribbon-pulse {
          0%,100%{opacity:0.75;filter:brightness(1)}
          50%{opacity:0.92;filter:brightness(1.35) drop-shadow(0 0 5px rgba(212,168,67,0.5))}
        }
        .helix-group{animation:helix-approach 9s ease-in-out infinite;transform-origin:820px 345px;}
        .receptor-group{animation:receptor-glow-on 9s ease-in-out infinite;}
        .receptor-breathe{animation:receptor-breathe 3.2s ease-in-out infinite;}
        .ribbon{animation:ribbon-pulse 2.4s ease-in-out infinite;}
      `}</style>
      <svg viewBox="0 0 1200 680" className="w-full h-full" style={{opacity:0.52}} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="gGold" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#F0D888"/>
            <stop offset="60%" stopColor="#C9A030"/>
            <stop offset="100%" stopColor="#7A5010"/>
          </radialGradient>
          <radialGradient id="gGoldPale" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FAECC0"/>
            <stop offset="100%" stopColor="#B08820"/>
          </radialGradient>
          <radialGradient id="gTeal" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#40E0D0"/>
            <stop offset="60%" stopColor="#0ABFB0"/>
            <stop offset="100%" stopColor="#065F58"/>
          </radialGradient>
          <filter id="fGold" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fTeal" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="fSoft">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Particle field */}
        {[
          [120,90,18,0.14,"8px","-6px"],[280,200,22,0.10,"-10px","8px"],[60,330,15,0.16,"6px","-10px"],
          [400,80,12,0.12,"9px","5px"],[500,400,20,0.09,"-7px","9px"],[180,500,16,0.13,"10px","-7px"],
          [650,150,14,0.11,"-8px","6px"],[700,470,18,0.10,"7px","-9px"],[350,560,12,0.14,"-6px","8px"],
          [1050,120,16,0.12,"8px","-6px"],[1100,350,14,0.10,"-9px","7px"],[980,500,20,0.09,"6px","10px"],
          [1150,580,13,0.13,"-7px","-8px"],[850,580,17,0.11,"9px","5px"],[90,600,15,0.12,"-5px","9px"],
          [450,300,11,0.15,"7px","-7px"],[560,230,13,0.11,"-8px","6px"],[750,320,16,0.10,"6px","8px"],
        ].map(([x,y,r,op,dx,dy],i) => (
          <circle key={`p${i}`} cx={x as number} cy={y as number} r={r as number}
            fill="url(#gGold)" filter="url(#fSoft)"
            style={{
              animation:`particle-float ${3.5+i*0.4}s ease-in-out infinite`,
              animationDelay:`${i*0.31}s`,
              ['--op' as string]: op,
              ['--dx' as string]: dx,
              ['--dy' as string]: dy,
              opacity: op as number,
            } as React.CSSProperties}
          />
        ))}

        {/* Receptor */}
        <g className="receptor-group" transform="translate(920,310)">
          <g className="receptor-breathe" filter="url(#fTeal)">
            {[
              [-98,-126,37],[-118,-44,35],[-115,40,37],[-94,122,33],[-52,172,31],
              [ 98,-126,37],[ 118,-44,35],[ 115,40,37],[ 94,122,33],[ 52,172,31],
              [-34,-160,22],[0,-178,22],[34,-160,22],
              [-58,-55,17],[58,-55,17],[-40,58,17],[40,58,17],
            ].map(([x,y,r],i)=>(
              <circle key={i} cx={x} cy={y} r={r}
                fill="url(#gTeal)" opacity={i>=10?0.68:0.88}/>
            ))}
          </g>
        </g>

        {/* Helix group (animated) */}
        <g className="helix-group">
          {/* Backbone tube as bezier ribbon */}
          <path
            className="ribbon"
            d={`M ${helixNodes[0].x} ${helixNodes[0].y} ` +
               helixNodes.slice(1).map((n,i) => {
                 const prev = helixNodes[i];
                 const mx   = (prev.x + n.x) / 2;
                 return `Q ${mx} ${(prev.y+n.y)/2} ${n.x} ${n.y}`;
               }).join(" ")}
            stroke="url(#gGold)" strokeWidth="8" fill="none"
            strokeOpacity="0.75" filter="url(#fGold)"
          />

          {/* Side chain bonds (back pass) */}
          {helixNodes.filter(n=>n.depth<0).map((n,i)=>{
            const sideX = n.x + Math.cos(n.angle)*36;
            const sideY = n.y + 4;
            return <line key={`sb${i}`} x1={n.x} y1={n.y} x2={sideX} y2={sideY}
              stroke="#C9A030" strokeWidth="3" strokeOpacity="0.40"/>;
          })}
          {/* Atoms (back pass — behind ribbon) */}
          {helixNodes.filter(n=>n.depth<0).sort((a,b)=>a.depth-b.depth).map((n,i)=>(
            <circle key={`ab${i}`} cx={n.x} cy={n.y} r={n.r}
              fill="url(#gGold)" opacity={n.opacity} filter="url(#fGold)"/>
          ))}
          {/* Side chain bonds (front pass) */}
          {helixNodes.filter(n=>n.depth>=0).map((n,i)=>{
            const sideX = n.x + Math.cos(n.angle)*38;
            const sideY = n.y + 4;
            return (
              <g key={`sf${i}`}>
                <line x1={n.x} y1={n.y} x2={sideX} y2={sideY}
                  stroke="#D4A843" strokeWidth="3.5" strokeOpacity="0.55"/>
                <circle cx={sideX} cy={sideY} r={8} fill="url(#gGoldPale)" opacity={0.70} filter="url(#fSoft)"/>
              </g>
            );
          })}
          {/* Atoms (front pass — over ribbon) */}
          {helixNodes.filter(n=>n.depth>=0).sort((a,b)=>a.depth-b.depth).map((n,i)=>(
            <circle key={`af${i}`} cx={n.x} cy={n.y} r={n.r}
              fill="url(#gGoldPale)" opacity={n.opacity} filter="url(#fGold)"/>
          ))}
        </g>

        {/* Subtle background grid */}
        {Array.from({length:9},(_,row)=>Array.from({length:18},(_,col)=>(
          <circle key={`g${row}-${col}`}
            cx={col*70+35} cy={row*78+22} r={1.4}
            fill="#C9A843" opacity={0.08}/>
        )))}
      </svg>
    </div>
  );
}

/* ─── Error boundary ───────────────────────────────────────────────────────── */
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
      <Canvas camera={{ position: [0, 0.15, 7.2], fov: 48 }}
        gl={{ alpha: true, antialias: true, failIfMajorPerformanceCaveat: false }}
        style={{ background: "transparent" }} dpr={[1, 1.8]}>
        <DockerScene />
      </Canvas>
    </WebGLBoundary>
  );
}
