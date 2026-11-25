import * as BUI from "@thatopen/ui";
import { ComponentsGrid } from "./src";
import { viewportContainerTemplate } from "../../containers/viewport";
import { itemsDataPanelTemplate } from "../../sections"; 
import { modelsPanelTemplate } from "../../sections";
import { queriesPanelTemplate } from "../../sections";
import * as OBC from "@thatopen/components";

interface ComponentsGridState {
    components: OBC.Components 
    viewport?: BUI.Viewport
}

export const componentsGridTemplate: BUI.StatefullComponent<ComponentsGridState> = (state) => {
    const { components, viewport } = state
    const onCreated = (e?: Element) => {
        if (!e) return;
        const grid = e as ComponentsGrid;

        grid.elements = {
            viewport: {
                template: viewportContainerTemplate,
                initialState: { viewport },
            },
            itemsData: {
                template: itemsDataPanelTemplate,
                initialState: {components}
            },
            models: {
                template: modelsPanelTemplate,
                initialState: { components }
            },
            queries: {
                template: queriesPanelTemplate,
                initialState: { components }
            }
        };

        grid.layouts = {
            Models: {
                template: `
                "models viewport itemsData" 1fr
                "queries viewport itemsData" 1fr
                /16rem 1fr 16rem
                `, 
            },
            Queries: {
                template: `
                "viewport queries" 1fr
                /1fr 22rem
                `,
            },
            Viewer: {
                template: `
                "viewport" 1fr
                /1fr
                `,
            },
        };

        console.log("Inner grid layout names:", Object.keys(grid.layouts));
        console.log("Inner grid layouts:", grid.layouts);

        grid.layout = "Models";
    }
     return BUI.html `<bim-grid ${BUI.ref(onCreated)} class="components-grid"></bim-grid>`
}
   
