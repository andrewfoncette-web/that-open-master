import * as OBC from "@thatopen/components";

export const setupIfcLoader = async (components: OBC.Components) => {
    const ifcLoader = components.get(OBC.IfcLoader);

    await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
            path: "https://unpkg.com/web-ifc@0.0.79/",
            absolute: true,
        },
    });
};

