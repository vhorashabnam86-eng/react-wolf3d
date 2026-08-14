import React, { useEffect, useRef, useState } from 'react'
import * as THREE from "three"
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, useAnimations, Environment, ContactShadows } from '@react-three/drei'
import gsap from "gsap"
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Deer = ({ activeTheme = 'dark' }) => {
    gsap.registerPlugin(useGSAP())
    gsap.registerPlugin(ScrollTrigger)

    // Load environment GLTF (branches/leaves) & Deer GLTF
    const envModel = useGLTF("/models/deer.drc.glb")
    const deerModel = useGLTF("/models/deer/scene.gltf")

    // Load Deer Texture
    const [deerTexture] = useTexture(["/models/deer/textures/tripo_mat_80c3696a-0675-4b3d-a613-611a818f2007_baseColor.jpeg"])
    deerTexture.flipY = false
    deerTexture.colorSpace = THREE.SRGBColorSpace

    useThree(({ camera, gl }) => {
        camera.position.z = 0.55
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })

    // Play branch/leaf ambient animation
    const { actions } = useAnimations(envModel.animations, envModel.scene)

    useEffect(() => {
        if (actions["Take 001"]) {
            actions["Take 001"].play()
        }
    }, [actions])

    const [branchMap, branchNormalMap] = (useTexture(["/models/branches_diffuse.jpg", "/models/branches_normals.jpg"]))
        .map(texture => {
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })

    const [
        ,
        mat2,
        ,
        ,
        ,
        ,
        ,
        mat8,
        mat9,
        mat10,
        ,
        mat12,
        mat13,
        ,
        ,
        ,
        ,
        ,
        mat19
    ] = (useTexture([
        "/matcap/mat-1.png",
        "/matcap/mat-2.png",
        "/matcap/mat-3.png",
        "/matcap/mat-4.png",
        "/matcap/mat-5.png",
        "/matcap/mat-6.png",
        "/matcap/mat-7.png",
        "/matcap/mat-8.png",
        "/matcap/mat-9.png",
        "/matcap/mat-10.png",
        "/matcap/mat-11.png",
        "/matcap/mat-12.png",
        "/matcap/mat-13.png",
        "/matcap/mat-14.png",
        "/matcap/mat-15.png",
        "/matcap/mat-16.png",
        "/matcap/mat-17.png",
        "/matcap/mat-18.png",
        "/matcap/mat-19.png",
        "/matcap/mat-20.png",
    ])).map(texture => {
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    })

    // Choose material & lighting based on active theme
    const isLightMode = activeTheme === 'light'
    const isDarkMode = activeTheme === 'dark'
    const isGoldMode = activeTheme === 'gold'
    const defaultMatcap = isGoldMode ? mat8 : mat2

    const material = useRef({
        uMatcap1: { value: mat19 },
        uMatcap2: { value: defaultMatcap },
        uProgress: { value: 1.0 }
    })

    useEffect(() => {
        material.current.uMatcap2.value = isGoldMode ? mat8 : mat2
    }, [isGoldMode, mat8, mat2])

    function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    // Deer Material: MeshStandardMaterial in Light mode for rich light response, MeshMatcapMaterial in Dark/Gold modes
    const deerMaterial = React.useMemo(() => {
        if (isLightMode) {
            return new THREE.MeshStandardMaterial({
                map: deerTexture,
                roughness: 0.45,
                metalness: 0.05,
                envMapIntensity: 1.6,
            })
        }
        const mat = new THREE.MeshMatcapMaterial({
            map: deerTexture,
            matcap: defaultMatcap
        })
        mat.onBeforeCompile = onBeforeCompile
        return mat
    }, [deerTexture, defaultMatcap, isLightMode])

    const branchMaterial = React.useMemo(() => {
        return new THREE.MeshMatcapMaterial({
            normalMap: branchNormalMap,
            map: branchMap
        })
    }, [branchNormalMap, branchMap])

    // Hide wolf meshes in envModel so only floating branches and leaves remain
    envModel.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.visible = false
        } else {
            child.material = branchMaterial
            child.frustumCulled = true
        }
    })

    // Apply deerMaterial to deer model
    deerModel.scene.traverse((child) => {
        if (child.isMesh) {
            child.material = deerMaterial
            child.castShadow = true
            child.receiveShadow = true
            child.frustumCulled = true
        }
    })

    const deerGroupRef = useRef()
    const innerDeerRef = useRef()

    // Responsive position and scale state (showing full deer body, hooves, and antlers)
    const [responsiveLayout, setResponsiveLayout] = useState({
        scale: 0.48,
        position: [0.14, -0.40, 0.05],
        rotation: [0, Math.PI / 4.2, 0]
    })

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth
            if (w < 600) {
                setResponsiveLayout({
                    scale: 0.32,
                    position: [0.01, -0.35, -0.15],
                    rotation: [0, Math.PI / 4.5, 0]
                })
            } else if (w < 1024) {
                setResponsiveLayout({
                    scale: 0.40,
                    position: [0.09, -0.38, -0.05],
                    rotation: [0, Math.PI / 4.3, 0]
                })
            } else {
                setResponsiveLayout({
                    scale: 0.48,
                    position: [0.14, -0.40, 0.05],
                    rotation: [0, Math.PI / 4.2, 0]
                })
            }
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Scroll animation for deer and environment
    useGSAP(() => {
        if (!deerGroupRef.current) return
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section-1",
                endTrigger: "#section-3",
                start: "top top",
                end: "bottom bottom",
                markers: false,
                scrub: true
            }
        })

        tl
            .to(deerGroupRef.current.position, {
                z: "-=0.75",
                y: "+=0.1"
            })
            .to(deerGroupRef.current.rotation, {
                x: `+=${Math.PI / 15}`
            })
            .to(deerGroupRef.current.rotation, {
                y: `-=${Math.PI}`,
            }, "third")
            .to(deerGroupRef.current.position, {
                x: "-=0.5",
                z: "+=0.6",
                y: "-=0.05"
            }, "third")

    }, [])

    // Subtle natural deer idle animation (breathing & gentle body/head sway)
    useFrame((state) => {
        if (!innerDeerRef.current) return
        const t = state.clock.getElapsedTime()
        innerDeerRef.current.position.y = Math.sin(t * 1.5) * 0.008
        innerDeerRef.current.rotation.y = Math.sin(t * 0.7) * 0.015
        innerDeerRef.current.rotation.z = Math.cos(t * 1.1) * 0.006
    })

    // Interactive title matcap transitions
    useEffect(() => {
        const tomorrowland = document.querySelector(`.title[img-title="tomorrowland"]`)
        const navyPier = document.querySelector(`.title[img-title="navy-pier"]`)
        const msiChicago = document.querySelector(`.title[img-title="msi-chicago"]`)
        const phone = document.querySelector(`.title[img-title="phone"]`)
        const kikk = document.querySelector(`.title[img-title="kikk"]`)
        const kennedy = document.querySelector(`.title[img-title="kennedy"]`)
        const opera = document.querySelector(`.title[img-title="opera"]`)
        const titles = document.querySelector(`.titles`)

        const triggerMatcapChange = (newMat) => {
            material.current.uMatcap1.value = newMat
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        }

        const handleTomorrowland = () => triggerMatcapChange(mat19)
        const handleNavyPier = () => triggerMatcapChange(mat8)
        const handleMsiChicago = () => triggerMatcapChange(mat9)
        const handlePhone = () => triggerMatcapChange(mat12)
        const handleKikk = () => triggerMatcapChange(mat10)
        const handleKennedy = () => triggerMatcapChange(mat8)
        const handleOpera = () => triggerMatcapChange(mat13)
        const handleTitlesLeave = () => triggerMatcapChange(defaultMatcap)

        tomorrowland?.addEventListener("mouseenter", handleTomorrowland)
        navyPier?.addEventListener("mouseenter", handleNavyPier)
        msiChicago?.addEventListener("mouseenter", handleMsiChicago)
        phone?.addEventListener("mouseenter", handlePhone)
        kikk?.addEventListener("mouseenter", handleKikk)
        kennedy?.addEventListener("mouseenter", handleKennedy)
        opera?.addEventListener("mouseenter", handleOpera)
        titles?.addEventListener("mouseleave", handleTitlesLeave)

        return () => {
            tomorrowland?.removeEventListener("mouseenter", handleTomorrowland)
            navyPier?.removeEventListener("mouseenter", handleNavyPier)
            msiChicago?.removeEventListener("mouseenter", handleMsiChicago)
            phone?.removeEventListener("mouseenter", handlePhone)
            kikk?.removeEventListener("mouseenter", handleKikk)
            kennedy?.removeEventListener("mouseenter", handleKennedy)
            opera?.removeEventListener("mouseenter", handleOpera)
            titles?.removeEventListener("mouseleave", handleTitlesLeave)
        }
    }, [mat8, mat9, mat10, mat12, mat13, mat19, defaultMatcap])

    return (
        <>
            {/* Main Deer & Environment Group */}
            <group ref={deerGroupRef}>
                {/* Floating branches and environmental particles from original scene */}
                <primitive object={envModel.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI / 3.9, 0]} />

                {/* 3D Deer Model with subtle breathing motion */}
                <group
                    position={responsiveLayout.position}
                    rotation={responsiveLayout.rotation}
                    scale={responsiveLayout.scale}
                >
                    <primitive ref={innerDeerRef} object={deerModel.scene} />
                </group>
            </group>

            {/* Studio Lighting Rig */}
            {isLightMode ? (
                <>
                    {/* Light Mode Specific Studio Lighting with Strong Front Key & Soft Fill */}
                    <ambientLight intensity={2.2} />
                    <hemisphereLight args={['#ffffff', '#55504a', 2.8]} />
                    
                    {/* Strong, soft front-facing key light aimed at deer face & chest */}
                    <directionalLight position={[0.2, 1.2, 4]} intensity={5.5} color="#fff8f0" castShadow />
                    
                    {/* Ambient fill lights from sides */}
                    <directionalLight position={[4, 5, 4]} intensity={3.0} color="#ffffff" />
                    <directionalLight position={[-4, 3, 3]} intensity={2.5} color="#ffe8d6" />
                    <pointLight position={[-3, 2, -2]} intensity={4.0} color="#f5e6cf" />
                    <pointLight position={[3, -1, -1]} intensity={3.0} color="#ffccaa" />

                    <Environment preset="studio" environmentIntensity={1.8} />
                    <ContactShadows
                        position={[0.25, -0.56, 0]}
                        opacity={0.45}
                        scale={6}
                        blur={2.5}
                        far={4}
                        color="#000000"
                    />
                </>
            ) : isDarkMode ? (
                <>
                    {/* Dark Mode Specific Enhanced Atmospheric Studio Lighting */}
                    <ambientLight intensity={2.2} />
                    <directionalLight position={[5, 8, 5]} intensity={3.5} color="#ffffff" castShadow />
                    
                    {/* Soft front key/fill light aiming at deer face, neck, and chest */}
                    <directionalLight position={[0.2, 1.0, 4]} intensity={2.5} color="#e6eeff" />
                    <spotLight position={[0, 10, 2]} angle={0.5} penumbra={1} intensity={4.5} color="#ffffff" />
                    <pointLight position={[-4, 3, -3]} intensity={6.0} color="#80bfff" />
                    <pointLight position={[4, -2, -2]} intensity={3.2} color="#ffaa77" />

                    <Environment preset="studio" environmentIntensity={1.2} />
                    <ContactShadows
                        position={[0.25, -0.56, 0]}
                        opacity={0.70}
                        scale={6}
                        blur={2.5}
                        far={4}
                        color="#000000"
                    />
                </>
            ) : (
                <>
                    {/* Gold Mode Original Studio Lighting Rig */}
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[5, 8, 5]} intensity={3.0} color="#ffffff" castShadow />
                    <spotLight position={[0, 10, 2]} angle={0.5} penumbra={1} intensity={4.0} color="#ffffff" />
                    <pointLight position={[-4, 3, -3]} intensity={5.0} color="#80bfff" />
                    <pointLight position={[4, -2, -2]} intensity={2.5} color="#ffaa77" />

                    <Environment preset="studio" environmentIntensity={0.8} />
                    <ContactShadows
                        position={[0.25, -0.56, 0]}
                        opacity={0.75}
                        scale={6}
                        blur={2.5}
                        far={4}
                        color="#000000"
                    />
                </>
            )}
        </>
    )
}

// Preload 3D Models for faster initial rendering
useGLTF.preload("/models/deer/scene.gltf")
useGLTF.preload("/models/deer.drc.glb")

export default Deer