
import * as React from "react";
import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export function ThreeViewer() {

    let scene: THREE.Scene | null
    let mesh: THREE.Object3D | null;
    let renderer: THREE.WebGLRenderer | null;
    let cameraControls: OrbitControls | null;
    let camera: THREE.PerspectiveCamera | null;
    let axes: THREE.AxesHelper | null;
    let grid: THREE.GridHelper | null;
    let directionalLight: THREE.DirectionalLight | null;
    let ambientLight: THREE.AmbientLight | null;
    let mtlLoader: MTLLoader | null;
    let objLoader: OBJLoader | null;

    const setViewer = () => {

          const viewerContainer = viewerRef.current;

        if (!viewerContainer) return;

        // ThreeJS scene
        scene = new THREE.Scene();

        // Renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);

        viewerContainer.appendChild(renderer.domElement);

        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            1,
            0.1,
            1000
        );

        camera.position.z = 5;

        // Resize viewer
function resizeViewer() {

    const containerDimensions = viewerContainer.getBoundingClientRect();

    if (containerDimensions.width === 0 || containerDimensions.height === 0) {
        return;
    }

    renderer.setSize(
        containerDimensions.width,
        containerDimensions.height
    );

    camera.aspect =
        containerDimensions.width / containerDimensions.height;

    camera.updateProjectionMatrix();
}

// Observe changes to the viewer container
const resizeObserver = new ResizeObserver(resizeViewer);

resizeObserver.observe(viewerContainer);

resizeViewer();
/*
        // Cube
        const boxGeometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080
        });

        const cube = new THREE.Mesh(boxGeometry, material); 

        scene.add(cube);
 */       

        // Lighting
        directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);

        ambientLight = new THREE.AmbientLight();
        ambientLight.intensity = 0.4;

        scene.add(directionalLight, ambientLight);

        // Controls
        cameraControls = new OrbitControls(
            camera,
            renderer.domElement
        );

        // Axes and grid
        axes = new THREE.AxesHelper();
        grid = new THREE.GridHelper();

        grid.material.transparent = true;
        grid.material.opacity = 0.7;

        scene.add(axes, grid);

 /*       
        // GUI
        const gui = new GUI();

        const cubeControls = gui.addFolder("Cube");

        cubeControls.add(cube.position, "x", -10, 10, 1);
        cubeControls.add(cube.position, "y", -10, 10, 1);
        cubeControls.add(cube.position, "z", -10, 10, 1);
        cubeControls.add(cube, "visible");
        cubeControls.addColor(material, "color");
*/

        // Load 3D model
        objLoader = new OBJLoader();
        mtlLoader = new MTLLoader();

        mtlLoader.load(
            "../assets/Gear/Gear1.mtl",
            (materials) => {

                materials.preload();
                objLoader.setMaterials(materials);

                objLoader.load(
                    "../assets/Gear/Gear1.obj",
                    (object) => {
                        scene.add(object);
                        mesh = object;
                    }
                );
            }
        );

        
        // Render loop
        let animationId: number;

        function renderScene() {

            animationId = requestAnimationFrame(renderScene);

            cameraControls.update();

            renderer.render(scene, camera);
        }

        renderScene();

      

    }

    const viewerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {

    setViewer();
    
    return () => {
        mesh.removeFromParent();
        mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
        mesh = null;
    };


    }, []);

    return (
        <div className="right-column">

            <div className="dashboard-card">

                <div style={{
                    width: "100%",
                    height: "100%",
                    minHeight: 0,
                    padding: 0,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <div
                        id="viewer-container"
                        ref={viewerRef}
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: 0,
                            flex: 1
                        }}
                    />

                </div>

            </div>

        </div>
    );
}
