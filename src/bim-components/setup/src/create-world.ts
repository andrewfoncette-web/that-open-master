import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import { viewportGridTemplate } from "../../../ui-templates/grids/viewport";

export const createWorld = (components: OBC.Components) => {
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBC.SimpleRenderer
    >();

    world.scene = new OBC.SimpleScene(components);
    world.scene.setup();
    world.scene.three.background = null;

   const viewport = BUI.Component.create<BUI.Viewport>(() => {

    console.log("State being passed to viewportGridTemplate:", {
        components,
        world,
    });

    const [viewportGrid] = BUI.Component.create(
        viewportGridTemplate,
        { components, world },
    );

    return BUI.html`
        <bim-viewport>
            ${viewportGrid}
        </bim-viewport>
    `;
});

    world.renderer = new OBC.SimpleRenderer(components, viewport);
    world.camera = new OBC.OrthoPerspectiveCamera(components);

    const resizeWorld = () => {
        try {
            world.renderer?.resize();
            world.camera.updateAspect();
        } catch (error) {
            console.warn("Resizing the world was not possible", error);
        }
    };

    viewport.addEventListener("resize", resizeWorld);

    components.get(OBC.Raycasters).get(world);

    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);

    grid.visible = true;
    grid.config.color = new THREE.Color("#D9E2EA");
    grid.config.primarySize = 1;
    grid.config.secondarySize = 10;
    grid.config.distance = 500;

    return { world, viewport };
};
