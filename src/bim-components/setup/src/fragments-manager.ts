import * as OBC from "@thatopen/components";

export function setupFragmentsManager(
    components: OBC.Components,
    world: OBC.SimpleWorld<
        OBC.SimpleScene,
        OBC.OrthoPerspectiveCamera,
        OBC.SimpleRenderer
    >
) {
    const fragments = components.get(OBC.FragmentsManager);

    fragments.init(
        "/node_modules/@thatopen/fragments/dist/Worker/worker.mjs"
    );

    fragments.list.onItemSet.add(async ({ value: model }) => {
        // Clears the ItemsFinder cache, so the next time a query
        // is run, it does the search again to include the results from the
        // new model
        const finder = components.get(OBC.ItemsFinder)
        for (const [, query] of finder.list) {
            query.clearCache()
        }
        // Set the camera used by the model.
        model.useCamera(world.camera.three);

        // Add the model to the world scene.
        world.scene.three.add(model.object);

        // Update the Fragments Manager.
        await fragments.core.update(true);
    });

    world.camera.controls.addEventListener("rest", async () => {
        await fragments.core.update(true);
    });
}