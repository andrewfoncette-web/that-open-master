import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { queriesList } from "../tables/queries";

export interface QueriesPanelState {
    components: OBC.Components;
}

export const queriesPanelTemplate: BUI.StatefullComponent<QueriesPanelState> = (state) => {
    const { components } = state;

    const [queriesTable] = queriesList({
        components,
    });

    const onSearch = (e: Event) => {
        const input = e.target as BUI.TextInput;
        queriesTable.queryString = input.value;
    };

    return BUI.html`
        <div class="bim-panel-frame">
            <bim-panel-section fixed label="Queries List">
                <div style="display: flex; gap: 0.5rem;">
                    <bim-text-input
                        @input=${onSearch}
                        placeholder="Search..."
                        debounce="200"
                    ></bim-text-input>
                </div>

                ${queriesTable}
            </bim-panel-section>
        </div>
    `;
};