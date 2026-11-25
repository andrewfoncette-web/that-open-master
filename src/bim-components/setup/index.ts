import * as OBC from "@thatopen/components";
import { createWorld } from "./src/create-world";
import { setupFragmentsManager } from "./src/fragments-manager";
import { setupIfcLoader } from "./src/ifc-loader";
import { setupHighlighter } from "./src/highlighter";
import { setupItemsFinder } from "./src/items-finder";
import { setupDataEnhancer } from "./src/data-enhancer";
import * as BUI from "@thatopen/ui"


export const setupComponents = async () => {
    const components = new OBC.Components();
    const { world, viewport } = createWorld(components)

    await setupIfcLoader(components);

    console.log("World returned from createWorld:", world);
    console.log("Camera assigned to world:", world?.camera);

    setupFragmentsManager(components, world)
    setupHighlighter(components, world)
    setupItemsFinder (components)
    setupDataEnhancer(components)

    
    components.init()

    return { components, viewport }
 }