import * as BUI from "@thatopen/ui";
import { appIcons } from "../../globals";

export interface GridSidebarState {
    grid?: BUI.Grid<any, any>;
}

export const gridSidebarTemplate: BUI.StatefullComponent<GridSidebarState> = (
    state,
    update
) => {
    const { grid } = state;

    let sidebarButtons: BUI.TemplateResult | undefined
    if (grid) {

        console.log("Sidebar grid layouts:", grid.layouts);
        console.log("Sidebar layout names:", Object.keys(grid.layouts));

        sidebarButtons = BUI.html`
            <div style="display: flex; flex-direction: row; gap: 0.5rem; width: 100%">
             ${Object.keys(grid.layouts).map((layout) => {
                const onClick = () => {
                   grid.layout = layout;
                   update();
                };

                let icon = "";

                switch (layout) {
                    case "Models":
                       icon = appIcons.PROJECT;
                       break;

                    case "Queries":
                       icon = appIcons.SELECT;
                       break;

                    case "Viewer":
                       icon = appIcons.FOCUS;
                       break;
                }

    return BUI.html`
        <bim-button
            ?active=${grid.layout === layout}
            @click=${onClick}
            style="flex: 0"
            label=${layout}
            icon=${icon}
        ></bim-button>
    `;
})}
            </div>
        `;
    }

    return BUI.html `
    <div style="display: flex; flex-direction: column; justify-content: space-between; 
    align-items: center; border-bottom: 1px solid var
    (--bim-ui_bg-contrast-40); padding: 0.5rem;">
        <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%">
           ${sidebarButtons}
        </div>
    </div>
    `;   
};