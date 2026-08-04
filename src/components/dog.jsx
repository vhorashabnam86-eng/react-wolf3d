import React, { useEffect, useRef } from 'react'
import * as THREE from "three"
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, useAnimations, Environment, ContactShadows } from '@react-three/drei'
import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


const Dog = () => {


    gsap.registerPlugin(useGSAP())
    gsap.registerPlugin(ScrollTrigger)


    const model = useGLTF("/models/dog.drc.glb")

    useThree(({ camera, scene, gl }) => {
        camera.position.z = 0.55
        gl.toneMapping = THREE.ReinhardToneMapping
        gl.outputColorSpace = THREE.SRGBColorSpace
    })

    const { actions } = useAnimations(model.animations, model.scene)

    useEffect(() => {
        actions["Take 001"].play()
    }, [actions])



    const [normalMap] = (useTexture(["/models/dog_normals.jpg",]))
        .map(texture => {
            texture.flipY = false
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })

    const [branchMap, branchNormalMap] = (useTexture(["/models/branches_diffuse.jpg", "/models/branches_normals.jpg"]))
        .map(texture => {
            texture.colorSpace = THREE.SRGBColorSpace
            return texture
        })

    const [
        mat1,
        mat2,
        mat3,
        mat4,
        mat5,
        mat6,
        mat7,
        mat8,
        mat9,
        mat10,
        mat11,
        mat12,
        mat13,
        mat14,
        mat15,
        mat16,
        mat17,
        mat18,
        mat19,
        mat20
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

    const material = useRef({
        uMatcap1: { value: mat19 },
        uMatcap2: { value: mat2 },
        uProgress: { value: 1.0 }
    })

    const dogMaterial = new THREE.MeshMatcapMaterial({
        normalMap: normalMap,
        matcap: mat2
    })

    const branchMaterial = new THREE.MeshMatcapMaterial({
        normalMap: branchNormalMap,
        map: branchMap
    })

    function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatcap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatcap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

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

    dogMaterial.onBeforeCompile = onBeforeCompile

    model.scene.traverse((child) => {
        if (child.name.includes("DOG")) {
            child.material = dogMaterial
        } else {
            child.material = branchMaterial
        }
    })

    const dogModel = useRef(model)


    useGSAP(() => {

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
            .to(dogModel.current.scene.position, {
                z: "-=0.75",
                y: "+=0.1"
            })
            .to(dogModel.current.scene.rotation, {
                x: `+=${Math.PI / 15}`
            })
            .to(dogModel.current.scene.rotation, {
                y: `-=${Math.PI}`,

            }, "third")
            .to(dogModel.current.scene.position, {
                x: "-=0.5",
                z: "+=0.6",
                y: "-=0.05"
            }, "third")

    }, [])

    useEffect(() => {

        const tomorrowland = document.querySelector(`.title[img-title="tomorrowland"]`)
        const navyPier = document.querySelector(`.title[img-title="navy-pier"]`)
        const msiChicago = document.querySelector(`.title[img-title="msi-chicago"]`)
        const phone = document.querySelector(`.title[img-title="phone"]`)
        const kikk = document.querySelector(`.title[img-title="kikk"]`)
        const kennedy = document.querySelector(`.title[img-title="kennedy"]`)
        const opera = document.querySelector(`.title[img-title="opera"]`)
        const titles = document.querySelector(`.titles`)

        tomorrowland?.addEventListener("mouseenter", () => {
            material.current.uMatcap1.value = mat19
            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        navyPier?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        msiChicago?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat9

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        phone?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat12

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        kikk?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat10

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        kennedy?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat8

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        opera?.addEventListener("mouseenter", () => {

            material.current.uMatcap1.value = mat13

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })
        titles?.addEventListener("mouseleave", () => {

            material.current.uMatcap1.value = mat2

            gsap.to(material.current.uProgress, {
                value: 0.0,
                duration: 0.3,
                onComplete: () => {
                    material.current.uMatcap2.value = material.current.uMatcap1.value
                    material.current.uProgress.value = 1.0
                }
            })
        })

    }, [])


    return (
        <>
            <primitive object={model.scene} position={[0.25, -0.55, 0]} rotation={[0, Math.PI / 3.9, 0]} />
            
            {/* Lacoste Studio 3-Point & Volumetric Lighting Rig */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 8, 5]} intensity={3.0} color="#ffffff" castShadow />
            <spotLight position={[0, 10, 2]} angle={0.5} penumbra={1} intensity={4.0} color="#ffffff" />
            <pointLight position={[-4, 3, -3]} intensity={5.0} color="#80bfff" /> {/* Cool Rim / Backlight */}
            <pointLight position={[4, -2, -2]} intensity={2.5} color="#ffaa77" /> {/* Warm Accent Fill */}

            {/* Studio Environment & Realistic Ground Shadow */}
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
    )
}

export default Dog